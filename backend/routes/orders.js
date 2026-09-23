const express = require("express");

const router = express.Router();

const orders = [];

const COMMISSION_RATE = 0.05;


/*
ORDER STATUS FLOW

placed
   ↓
confirmed
   ↓
ready_for_pickup
   ↓
picked_up
   ↓
out_for_delivery
   ↓
delivered
*/


/* =========================
   CREATE ORDER
========================= */

router.post("/", (req, res) => {

    const {
        customerId,
        sellerId,
        items,
        deliveryAddress,
        paymentMethod
    } = req.body;


    if (
        !customerId ||
        !sellerId ||
        !items ||
        !items.length ||
        !deliveryAddress
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Customer, seller, items and delivery address are required."

        });

    }


    const subtotal = items.reduce(
        (total, item) => {

            return total +
                (Number(item.price) * Number(item.quantity || 1));

        },
        0
    );


    const deliveryFee = 30;

    const totalAmount =
        subtotal + deliveryFee;


    const commission =
        Math.round(
            subtotal * COMMISSION_RATE * 100
        ) / 100;


    const sellerAmount =
        subtotal - commission;


    const newOrder = {

        id: Date.now(),

        customerId,

        sellerId,

        deliveryPartnerId: null,

        items,

        subtotal,

        deliveryFee,

        totalAmount,

        commission,

        sellerAmount,

        deliveryAddress,

        paymentMethod:
            paymentMethod || "cod",

        status: "placed",

        createdAt: new Date(),

        updatedAt: new Date()

    };


    orders.push(newOrder);


    res.status(201).json({

        success: true,

        message: "Order placed successfully.",

        order: newOrder

    });

});


/* =========================
   GET ALL ORDERS
   ADMIN
========================= */

router.get("/", (req, res) => {

    res.json({

        success: true,

        orders

    });

});


/* =========================
   CUSTOMER ORDERS
========================= */

router.get(
    "/customer/:customerId",
    (req, res) => {

        const customerOrders =
            orders.filter(
                order =>
                    String(order.customerId) ===
                    String(req.params.customerId)
            );


        res.json({

            success: true,

            orders: customerOrders

        });

    }
);


/* =========================
   SELLER ORDERS
========================= */

router.get(
    "/seller/:sellerId",
    (req, res) => {

        const sellerOrders =
            orders.filter(
                order =>
                    String(order.sellerId) ===
                    String(req.params.sellerId)
            );


        res.json({

            success: true,

            orders: sellerOrders

        });

    }
);


/* =========================
   DELIVERY ORDERS
========================= */

router.get(
    "/delivery/available",
    (req, res) => {

        const availableOrders =
            orders.filter(
                order =>
                    order.status === "ready_for_pickup" &&
                    !order.deliveryPartnerId
            );


        res.json({

            success: true,

            orders: availableOrders

        });

    }
);


/* =========================
   ASSIGN DELIVERY PARTNER
========================= */

router.post(
    "/:id/assign-delivery",
    (req, res) => {

        const {
            deliveryPartnerId
        } = req.body;


        const order =
            orders.find(
                item =>
                    item.id ===
                    Number(req.params.id)
            );


        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found."

            });

        }


        if (order.deliveryPartnerId) {

            return res.status(400).json({

                success: false,

                message:
                    "Delivery partner already assigned."

            });

        }


        order.deliveryPartnerId =
            deliveryPartnerId;

        order.updatedAt = new Date();


        res.json({

            success: true,

            message:
                "Delivery partner assigned.",

            order

        });

    }
);


/* =========================
   UPDATE ORDER STATUS
========================= */

router.patch(
    "/:id/status",
    (req, res) => {

        const {
            status
        } = req.body;


        const allowedStatuses = [

            "placed",

            "confirmed",

            "ready_for_pickup",

            "picked_up",

            "out_for_delivery",

            "delivered",

            "cancelled"

        ];


        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({

                success: false,

                message: "Invalid order status."

            });

        }


        const order =
            orders.find(
                item =>
                    item.id ===
                    Number(req.params.id)
            );


        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found."

            });

        }


        order.status = status;

        order.updatedAt = new Date();


        res.json({

            success: true,

            message:
                "Order status updated.",

            order

        });

    }
);


/* =========================
   GET SINGLE ORDER
========================= */

router.get("/:id", (req, res) => {

    const order =
        orders.find(
            item =>
                item.id ===
                Number(req.params.id)
        );


    if (!order) {

        return res.status(404).json({

            success: false,

            message: "Order not found."

        });

    }


    res.json({

        success: true,

        order

    });

});


module.exports = router;
