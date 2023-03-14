const express = require("express");
const router = express.Router();

const LotteryController = require("../../controllers/LotteryController");

router.post("/enter", LotteryController.enter);

router.get("/balance", LotteryController.getBalance);
router.get("/players", LotteryController.getPlayers);
router.get("/id", LotteryController.lotteryId);
router.get("/history", LotteryController.lotteryHistory);
router.get("/random", LotteryController.getRandomNumber);
router.get("/player/balance", LotteryController.getPlayerBalance);

module.exports = router;
