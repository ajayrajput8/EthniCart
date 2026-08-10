const express = require("express");

const {
  addProduct,
  editProduct,
  deleteProduct,
  getProducts,
  getProductById,
} = require("../controllers/productController");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// GET ALL PRODUCTS
// GET /api/products
router.get("/", getProducts);

// GET SINGLE PRODUCT
// GET /api/products/:id
router.get("/:id", getProductById);

// ADD PRODUCT
// POST /api/products
router.post(
  "/",
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        console.error("🔥 MULTER/CLOUDINARY ERROR:");
        console.error(err);
        console.error("MESSAGE:", err.message);

        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      console.log("✅ Upload middleware passed");
      console.log("BODY:", req.body);
      console.log("FILE:", req.file);

      next();
    });
  },
  addProduct
);


// EDIT PRODUCT
// PUT /api/products/:id
router.put(
  "/:id",
  upload.single("image"),
  editProduct
);


// DELETE PRODUCT
// DELETE /api/products/:id
router.delete(
  "/:id",
  deleteProduct
);


module.exports = router;