const express = require("express");
const cors = require("cors");
require("dotenv").config();

const usersRouter = require("./routes/users");
const productsRouter = require("./routes/products");
const ordersRouter = require("./routes/orders");
const deliveryRouter = require("./routes/delivery");

const app = express();

app.use(cors());
app.use(express.json());


// =========================
// BASIC ROUTE
// =========================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "ABS Marketplace Backend is running!"
    });

});


// =========================
// API ROUTES
// =========================

app.use("/api/users", usersRouter);

app.use("/api/products", productsRouter);

app.use("/api/orders", ordersRouter);

app.use("/api/delivery", deliveryRouter);


// =========================
// 404 HANDLER
// =========================

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message: "API route not found."

    });

});


// =========================
// ERROR HANDLER
// =========================

app.use((error, req, res, next) => {

    console.error(error);

    res.status(500).json({

        success: false,

        message: "Internal server error."

    });

});


// =========================
// START SERVER
// =========================

const PORT =
    process.env.PORT || 5000;


app.listen(PORT, () => {

    console.log(
        `ABS Marketplace Backend running on port ${PORT}`
    );

});
