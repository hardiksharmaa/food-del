import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//config variables
const currency = "inr";
const deliveryCharge = 50;
const frontend_URL = process.env.FRONTEND_URL || 'https://food-del-frontend-seay.onrender.com';

const placeOrder = async (req, res) => {

    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "Delivery Charge"
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${frontend_URL}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_URL}/verify?success=false&orderId=${newOrder._id}`,
            line_items: line_items,
            mode: 'payment',
        });

        // Save Stripe session ID to order for verification
        await orderModel.findByIdAndUpdate(newOrder._id, { stripeSessionId: session.id });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

const placeOrderCod = async (req, res) => {

    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            payment: true,
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        res.json({ success: true, message: "Order Placed" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// Listing Order for Admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// User Orders for Frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

const updateStatus = async (req, res) => {
    console.log(req.body);
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" })
    } catch (error) {
        res.json({ success: false, message: "Error" })
    }

}

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        // Find the order
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        // If order already verified, return success
        if (order.payment === true) {
            return res.json({ success: true, message: "Order already verified" });
        }

        // If user cancelled, delete the order
        if (success !== "true") {
            await orderModel.findByIdAndDelete(orderId);
            return res.json({ success: false, message: "Payment cancelled" });
        }

        // Verify payment with Stripe API using session ID
        if (!order.stripeSessionId) {
            // If no session ID, this might be an old order or COD order
            // For security, don't mark as paid without verification
            return res.json({ success: false, message: "Cannot verify payment - no session ID" });
        }

        // Retrieve the Stripe session to verify payment status
        const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId);
        
        // Only mark as paid if Stripe confirms payment was successful
        if (session.payment_status === 'paid') {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Payment verified" });
        } else {
            // Payment not completed, delete the order
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Payment not completed" });
        }
    } catch (error) {
        console.error("Order verification error:", error);
        res.json({ success: false, message: "Verification failed" });
    }

}

export { placeOrder, listOrders, userOrders, updateStatus, verifyOrder, placeOrderCod }
