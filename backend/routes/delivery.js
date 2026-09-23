const express = require("express");

const router = express.Router();

const deliveries = [];


/* =========================
   DELIVERY PARTNER REGISTER
========================= */

router.post("/register", (req, res) => {

    const {
        userId,
        name,
        phone,
        area,
        vehicleType
    } = req.body;


    if (!userId || !name || !phone) {

        return res.status(400).json({

            success: false,

            message:
                "User ID, name and phone are required."

        });

    }


    const partner = {

        id: Date.now(),

        userId,

        name,

        phone,

        area: area || "",

        vehicleType:
            vehicleType || "bike",

        available: true,

        totalDeliveries: 0,

        totalEarnings: 0,

        createdAt: new Date()

    };


    deliveries.push(partner);


    res.status(201).json({

        success: true,

        message:
            "Delivery partner registered.",

        partner

    });

});


/* =========================
   GET DELIVERY PARTNERS
========================= */

router.get("/", (req, res) => {

    res.json({

        success: true,

        partners: deliveries

    });

});


/* =========================
   AVAILABLE PARTNERS
========================= */

router.get("/available", (req, res) => {

    const availablePartners =
        deliveries.filter(
            partner => partner.available
        );


    res.json({

        success: true,

        partners: availablePartners

    });

});


/* =========================
   UPDATE AVAILABILITY
========================= */

router.patch(
    "/:id/availability",
    (req, res) => {

        const {
            available
        } = req.body;


        const partner =
            deliveries.find(
                item =>
                    item.id ===
                    Number(req.params.id)
            );


        if (!partner) {

            return res.status(404).json({

                success: false,

                message:
                    "Delivery partner not found."

            });

        }


        partner.available =
            Boolean(available);


        res.json({

            success: true,

            message:
                "Availability updated.",

            partner

        });

    }
);


/* =========================
   DELIVERY COMPLETED
========================= */

router.post(
    "/:id/complete",
    (req, res) => {

        const partner =
            deliveries.find(
                item =>
                    item.id ===
                    Number(req.params.id)
            );


        if (!partner) {

            return res.status(404).json({

                success: false,

                message:
                    "Delivery partner not found."

            });

        }


        const earning =
            Number(req.body.earning || 30);


        partner.totalDeliveries += 1;

        partner.totalEarnings += earning;

        partner.available = true;


        res.json({

            success: true,

            message:
                "Delivery completed.",

            earning,

            partner

        });

    }
);


/* =========================
   DELIVERY HISTORY
========================= */

router.get(
    "/:id/history",
    (req, res) => {

        const partner =
            deliveries.find(
                item =>
                    item.id ===
                    Number(req.params.id)
            );


        if (!partner) {

            return res.status(404).json({

                success: false,

                message:
                    "Delivery partner not found."

            });

        }


        res.json({

            success: true,

            totalDeliveries:
                partner.totalDeliveries,

            totalEarnings:
                partner.totalEarnings

        });

    }
);


module.exports = router;
