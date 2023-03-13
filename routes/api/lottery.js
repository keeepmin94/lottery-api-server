const express = require("express");
const router = express.Router();

const LotteryController = require("../../controllers/LotteryController");

router.post("/enter", LotteryController.enter);

module.exports = router;
