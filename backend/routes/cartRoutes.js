const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, async (req, res) => {
    const cart = await Cart.findOne({ user: req.user.id })
        .populate("items.product");

    res.json(cart || { user: req.user.id, items: [] });
});

router.post("/add", protect, async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ message: "Insufficient stock" });
        }

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = await Cart.create({
                user: req.user.id,
                items: [{ product: productId, quantity }]
            });
        } else {
            const item = cart.items.find(
                item => item.product.toString() === productId
            );

            if (item) {
                item.quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }

            await cart.save();
        }

        await cart.populate("items.product");

        res.json({
            message: "Product added to cart",
            cart
        });
    } catch (error) {
        res.status(500).json({ message: "Cart error" });
    }
});

router.delete("/remove/:productId", protect, async (req, res) => {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
        item => item.product.toString() !== req.params.productId
    );

    await cart.save();

    res.json({
        message: "Product removed from cart",
        cart
    });
});

module.exports = router;
