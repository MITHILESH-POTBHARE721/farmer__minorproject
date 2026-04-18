const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get all orders for logged in user
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'buyer') {
      query.buyer = req.user.id;
    } else if (req.user.role === 'farmer') {
      // Find orders where any item's farmer matches the current user
      query['items.farmer'] = req.user.id;
    }

    const orders = await Order.find(query)
      .populate('buyer', 'name phone email')
      .populate('items.product', 'name images category')
      .populate('items.farmer', 'name phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name phone email address')
      .populate('items.product', 'name images category unit')
      .populate('items.farmer', 'name phone email address');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if user is authorized to view this order
    const isBuyer = order.buyer._id.toString() === req.user.id;
    const isFarmer = order.items.some(
      (item) => item.farmer._id.toString() === req.user.id
    );

    if (!isBuyer && !isFarmer && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Buyer only)
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please add items to order',
      });
    }

    if (!paymentMethod || !['online', 'cash_on_delivery'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Please select a valid payment method (online or cash_on_delivery)',
      });
    }

    // Validate and process items
    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`,
        });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient quantity for ${product.name}`,
        });
      }

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        farmer: product.farmer,
      });

      totalAmount += product.price * item.quantity;

      // Reduce product quantity
      product.quantity -= item.quantity;
      if (product.quantity === 0) {
        product.isAvailable = false;
      }
      await product.save();
    }

    const order = await Order.create({
      buyer: req.user.id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'online' ? 'completed' : 'pending',
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Farmer or Admin)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if user is a farmer involved in this order
    const isInvolvedFarmer = order.items.some(
      (item) => item.farmer.toString() === req.user.id
    );

    if (!isInvolvedFarmer && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this order',
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Update payment received status (Farmer confirms cash payment received)
// @route   PUT /api/orders/:id/payment-received
// @access  Private (Farmer only)
exports.confirmPaymentReceived = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check if user is a farmer involved in this order
    const isInvolvedFarmer = order.items.some(
      (item) => item.farmer.toString() === req.user.id
    );

    if (!isInvolvedFarmer) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this order',
      });
    }

    // Only allow confirming payment for cash on delivery orders
    if (order.paymentMethod !== 'cash_on_delivery') {
      return res.status(400).json({
        success: false,
        message: 'Payment confirmation only applicable for cash on delivery orders',
      });
    }

    order.paymentReceived = true;
    order.paymentReceivedAt = new Date();
    order.paymentStatus = 'completed';
    await order.save();

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get farmer's sales
// @route   GET /api/orders/my-sales
// @access  Private (Farmer only)
exports.getMySales = async (req, res) => {
  try {
    // Include all non-cancelled orders (pending, confirmed, shipped, delivered)
    const orders = await Order.find({
      'items.farmer': req.user.id,
      status: { $nin: ['cancelled'] },
    })
      .populate('buyer', 'name phone email')
      .populate('items.product', 'name images category unit')
      .sort({ createdAt: -1 });

    // Calculate total sales from all non-cancelled orders
    let totalSales = 0;
    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.farmer.toString() === req.user.id) {
          totalSales += item.price * item.quantity;
        }
      });
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      totalSales,
      data: orders,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
