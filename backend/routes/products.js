const express = require("express");

const router = express.Router();

const products = [];


/* =========================
   GET ALL PRODUCTS
========================= */

router.get("/", (req, res) => {

    res.json({
        success: true,
        products: products
    });

});


/* =========================
   GET SINGLE PRODUCT
========================= */

router.get("/:id", (req, res) => {

    const product = products.find(
        item => item.id === Number(req.params.id)
    );


    if (!product) {

        return res.status(404).json({

            success: false,

            message: "Product not found."

        });

    }


    res.json({

        success: true,

        product: product

    });

});


/* =========================
   ADD PRODUCT
========================= */

router.post("/", (req, res) => {

    const {
        sellerId,
        name,
        description,
        price,
        category,
        stock,
        image
    } = req.body;


    if (
        !sellerId ||
        !name ||
        !price ||
        !category
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Seller ID, product name, price and category are required."

        });

    }


    const newProduct = {

        id: Date.now(),

        sellerId,

        name,

        description: description || "",

        price: Number(price),

        category,

        stock: Number(stock || 0),

        image: image || "",

        active: true,

        createdAt: new Date()

    };


    products.push(newProduct);


    res.status(201).json({

        success: true,

        message: "Product added successfully.",

        product: newProduct

    });

});


/* =========================
   UPDATE PRODUCT
========================= */

router.put("/:id", (req, res) => {

    const product = products.find(
        item => item.id === Number(req.params.id)
    );


    if (!product) {

        return res.status(404).json({

            success: false,

            message: "Product not found."

        });

    }


    const {
        name,
        description,
        price,
        category,
        stock,
        image,
        active
    } = req.body;


    if (name !== undefined)
        product.name = name;

    if (description !== undefined)
        product.description = description;

    if (price !== undefined)
        product.price = Number(price);

    if (category !== undefined)
        product.category = category;

    if (stock !== undefined)
        product.stock = Number(stock);

    if (image !== undefined)
        product.image = image;

    if (active !== undefined)
        product.active = active;


    res.json({

        success: true,

        message: "Product updated successfully.",

        product: product

    });

});


/* =========================
   DELETE PRODUCT
========================= */

router.delete("/:id", (req, res) => {

    const index = products.findIndex(
        item => item.id === Number(req.params.id)
    );


    if (index === -1) {

        return res.status(404).json({

            success: false,

            message: "Product not found."

        });

    }


    products.splice(index, 1);


    res.json({

        success: true,

        message: "Product deleted successfully."

    });

});


module.exports = router;
