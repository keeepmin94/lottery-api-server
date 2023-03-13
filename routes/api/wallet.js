const express = require("express");
const router = express.Router();

const WalletController = require("../../controllers/WalletController");

router.post("", WalletController.createWallet);
//http://localhost:3000/wallet POST

module.exports = router;
