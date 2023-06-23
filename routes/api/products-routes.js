const express = require("express");
const ctrl = require("../../controllers/products-controllers");
const router = express.Router();
// const { isValidId } = require("../../middlewares");
const { authenticate } = require("../../middlewares");
const uploadCloud = require("../../middlewares/uploadMiddleware");

router.post("/addproduct", authenticate, uploadCloud.single("photo"), ctrl.addProduct);
router.post("/addcategory", authenticate, uploadCloud.single("photo"), ctrl.addCategory);
router.post("/addsubcategory", authenticate, uploadCloud.single("photo"), ctrl.addSubcategory);

router.get("/getallcategories", ctrl.getAllCategories);
router.get("/getallsubcategories", ctrl.getAllSubcategories);
router.get("/getproductbycategory/:id", ctrl.getProductByCategory);


// router.get("/userfavoritenotices", authenticate, ctrl.getNoticesAddedToFavoriteByUser);
// router.get("/mynotices", authenticate, ctrl.getNoticesСreatedByUser);
// router.get("/:id", isValidId, ctrl.getNoticeById);
// router.delete("/removenoticefromfavorite/:id", authenticate, isValidId, ctrl.deleteNoticeFromFavorite);
// router.delete("/:id", authenticate, ctrl.deleteNoticeCreatedByUser);
// router.patch("/addnoticetofavorite/:id", authenticate, isValidId, ctrl.addNoticeToFavorite);

module.exports = router;
