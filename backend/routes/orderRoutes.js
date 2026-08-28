const express = require("express");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, async (req, res) => {
    try {
        const { shippingAddress } = req.body;

        if (!shippingAddress) {
            return res.status(400).json({
                message: "Shipping address is required"
            });
        }

        const cart = await Cart.findOne({
            user: req.user.id
        }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                message: "Cart is empty"
            });
        }

        let totalAmount = 0;

        const items = cart.items.map(item => {
            totalAmount += item.product.price * item.quantity;

            return {
                product: item.product._id,
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity
            };
        });

        for (const item of cart.items) {
            await Product.findByIdAndUpdate(
                item.product._id,
                { $inc: { stock: -item.quantity } }
            );
        }

        const order = await Order.create({
            user: req.user.id,
            items,
            totalAmount,
            shippingAddress
        });

        cart.items = [];
        await cart.save();

        res.status(201).json({
            message: "Order placed successfully",
            order
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to place order"
        });
    }
});

router.get("/my-orders", protect, async (req, res) => {
    const orders = await Order.find({
        user: req.user.id
    }).populate("items.product");

    res.json(orders);
});

router.get("/", protect, adminOnly, async (req, res) => {
    const orders = await Order.find()
        .populate("user", "name email")
        .populate("items.product");

    res.json(orders);
});

router.put("/:id/status", protect, adminOnly, async (req, res) => {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
    );

    if (!order) {
        return res.status(404).json({
            message: "Order not found"
        });
    }

    res.json({
        message: "Order status updated",
        order
    });
});

module.exports = router;
