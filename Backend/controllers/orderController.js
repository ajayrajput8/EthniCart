const Order = require("../models/Order");
const Product = require("../models/Product");

// ADD ORDER
const addOrder = async (req, res) => {
  try {
    const {
      products,
      location,
    } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Products are required",
      });
    }

    if (!location) {
      return res.status(400).json({
        success: false,
        message: "Location is required",
      });
    }

    let totalPrice = 0;

    const orderProducts = [];

    for (const item of products) {

      const product = await Product.findById(
        item.product
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.product} not found`,
        });
      }

      const quantity = item.quantity || 1;

      totalPrice += product.price * quantity;

      orderProducts.push({
        product: product._id,
        quantity,
      });
    }

    const order = await Order.create({
      price: totalPrice,
      user: req.user._id,
      products: orderProducts,
      location,
    });

    const populatedOrder = await Order.findById(
      order._id
    )
      .populate("user", "-password")
      .populate("products.product");

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: populatedOrder,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to place order",
    });
  }
};


// CANCEL ORDER
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Make sure user owns this order
    if (
      order.user.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You cannot cancel this order",
      });
    }

    if (order.status === "delivered") {
      return res.status(400).json({
        success: false,
        message: "Delivered order cannot be cancelled",
      });
    }

    if (order.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Order is already cancelled",
      });
    }

    order.status = "cancelled";

    await order.save();

    res.json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
    });
  }
};


// GET ORDERS
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .populate("customer", "-password")
      .populate("products.product")
      .sort({
        date: -1,
      });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to get orders",
    });
  }
};


module.exports = {
  addOrder,
  cancelOrder,
  getOrders,
};