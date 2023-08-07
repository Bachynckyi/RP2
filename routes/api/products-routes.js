const express = require("express");
const ctrl = require("../../controllers/products-controllers");
const router = express.Router();
// const { isValidId } = require("../../middlewares");
const { authenticate } = require("../../middlewares");
const uploadCloud = require("../../middlewares/uploadMiddleware");

router.post("/addproduct", authenticate, uploadCloud.single("photo"), ctrl.addProduct);
router.post("/addcategory", authenticate, uploadCloud.single("photoCategory"), ctrl.addCategory);
router.post("/addsubcategory", authenticate, uploadCloud.single("photoSubcategory"), ctrl.addSubcategory);

router.get("/getallcategories", ctrl.getAllCategories);
router.get("/getallsubcategories", ctrl.getAllSubcategories);
router.get("/getsubcategorybycategory/:id", ctrl.getSubcategoryByCategory);

router.get("/getproductbycategory/:id", ctrl.getProductByCategory);
router.get("/getproductbysearch/", ctrl.getProductBySearch);

router.patch("/updatecategory/:id", authenticate, uploadCloud.single("photoCategory"), ctrl.updateCategory);


module.exports = router;
