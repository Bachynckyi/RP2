const express = require("express");
const ctrl = require("../../controllers/auth-controllers");
const { validateBody } = require("../../utils");
const { authenticate } = require("../../middlewares");
const { schemas } = require("../../models/user");
// const uploadCloud = require("../../middlewares/uploadMiddleware");
const router = express.Router();

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);
router.post("/login", validateBody(schemas.loginSchema), ctrl.login);
router.post("/logout", authenticate, ctrl.logout);
router.get("/current", authenticate, ctrl.getCurrent);
router.patch("/addtobasket", authenticate, ctrl.addToBasket);
router.patch("/removefrombasket/:id", authenticate, ctrl.removeFromBasket);

// router.put("/update/:id", authenticate, validateBody(schemas.addSchema), ctrl.updateUserById);
// router.get("/newtoken/:id", authenticate, ctrl.refreshToken);
// router.get("/:id", ctrl.getUserById);
// router.patch("/updateavatar", authenticate, uploadCloud.single("image"), ctrl.updateAvatar)

module.exports = router;
