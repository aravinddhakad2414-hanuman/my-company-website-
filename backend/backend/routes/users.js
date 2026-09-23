const express = require("express");
const bcrypt = require("bcryptjs");

const router = express.Router();

/*
    Temporary in-memory users.
    Later these will be stored in the real database.
*/

const users = [];


/* =========================
   SIGN UP
========================= */

router.post("/signup", async (req, res) => {

    try {

        const {
            name,
            email,
            phone,
            password,
            role,
            address
        } = req.body;


        if (!name || !email || !password) {

            return res.status(400).json({
                success: false,
                message: "Name, email and password are required."
            });

        }


        const allowedRoles = [
            "customer",
            "seller",
            "delivery"
        ];


        if (!allowedRoles.includes(role)) {

            return res.status(400).json({
                success: false,
                message: "Invalid account type."
            });

        }


        const existingUser = users.find(
            user => user.email === email
        );


        if (existingUser) {

            return res.status(409).json({
                success: false,
                message: "Email already registered."
            });

        }


        const hashedPassword =
            await bcrypt.hash(password, 10);


        const newUser = {

            id: Date.now(),

            name,

            email,

            phone: phone || "",

            password: hashedPassword,

            role,

            address: address || "",

            createdAt: new Date()

        };


        users.push(newUser);


        res.status(201).json({

            success: true,

            message: "Account created successfully.",

            user: {

                id: newUser.id,

                name: newUser.name,

                email: newUser.email,

                role: newUser.role

            }

        });


    } catch (error) {

        res.status(500).json({

            success: false,

            message: "Server error."

        });

    }

});


/* =========================
   LOGIN
========================= */

router.post("/login", async (req, res) => {

    try {

        const {
            email,
            password,
            role
        } = req.body;


        const user = users.find(
            user =>
                user.email === email &&
                user.role === role
        );


        if (!user) {

            return res.status(401).json({

                success: false,

                message: "Invalid email, password or account type."

            });

        }


        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({

                success: false,

                message: "Invalid email or password."

            });

        }


        res.json({

            success: true,

            message: "Login successful.",

            user: {

                id: user.id,

                name: user.name,

                email: user.email,

                role: user.role

            }

        });


    } catch (error) {

        res.status(500).json({

            success: false,

            message: "Server error."

        });

    }

});


/* =========================
   GET USERS
========================= */

router.get("/", (req, res) => {

    const safeUsers = users.map(user => ({

        id: user.id,

        name: user.name,

        email: user.email,

        phone: user.phone,

        role: user.role,

        address: user.address,

        createdAt: user.createdAt

    }));


    res.json({

        success: true,

        users: safeUsers

    });

});


module.exports = router;
