const express = require("express");
const ctrl = require("../../controllers/orders-controllers");
const { authenticate } = require("../../middlewares");
const router = express.Router();

router.post("/addorderoneclick", ctrl.addOrderByOneClick);

module.exports = router;