const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

// ADD PRODUCT
const addProduct = async (req, res) => {
  try {

    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    const {
      name,
      price,
      oldPrice,
      rating,
      category,
    } = req.body;

    if (!name || !price || !category || !req.file) {
      return res.status(400).json({
        success: false,
        message: "Name, price and image are required",
      });
    }

    const product = await Product.create({
      name,
      price,
      oldPrice,
      rating,
      category,
      image: req.file.path,
      cloudinaryPublicId: req.file.filename,
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to add product",
    });
  }
};


// GET ALL PRODUCTS
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get products",
    });
  }
};


// GET PRODUCT BY ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Invalid product ID",
    });
  }
};


// EDIT PRODUCT
const editProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const {
      name,
      price,
      oldPrice,
      rating,
      category,
    } = req.body;

    if (name) product.name = name;
    if (price) product.price = price;
    if (oldPrice) product.oldPrice = oldPrice;
    if (rating) product.rating = rating;
    if (category) product.category = category;

    // If a new image is uploaded
    if (req.file) {

      // Delete old image
      if (product.cloudinaryPublicId) {
        await cloudinary.uploader.destroy(
          product.cloudinaryPublicId
        );
      }

      product.image = req.file.path;
      product.cloudinaryPublicId = req.file.filename;
    }

    await product.save();

    res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};


// DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(
        product.cloudinaryPublicId
      );
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};


module.exports = {
  addProduct,
  editProduct,
  deleteProduct,
  getProducts,
  getProductById,
};