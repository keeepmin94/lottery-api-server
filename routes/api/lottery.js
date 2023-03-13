const express = require("express");
const router = express.Router();

const LotteryController = require("../../controllers/LotteryController");

router.post("/enter", LotteryController.enter);

router.get("/balance", LotteryController.getBalance);
router.get("/players", LotteryController.getPlayers);

module.exports = router;
