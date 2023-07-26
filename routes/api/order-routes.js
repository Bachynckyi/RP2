const express = require("express");
const ctrl = require("../../controllers/orders-controllers");
const router = express.Router();

router.post("/addorderoneclick", ctrl.addOrderByOneClick);
router.post("/addorderbasket", ctrl.addOrderByBasket);

module.exports = router;