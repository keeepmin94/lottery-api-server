const ResponseHandler = require("../services/ResponseHandler");
const WalletDBInteractor = require("../services/db/WalletDBInteractor");
const errorCodes = require("../constants/errorCodes").errorCodes;
const LotteryInteractor = require("../services/contract/LotteryInteractor");
//LotteryInteractor안에 cunstructor있는 클래스 사용하려면 인스턴스 생성 후 사용
const lotteryInteractor = new LotteryInteractor();
const CipherUtil = require("../services/CipherUtil");

class LotteryController {
  static async enter(req, res) {
    const funcName = "enter";
    try {
      const accountName = req.body.account_name;
      const enterAmt = req.body.enter_amt;
      console.log(`[${funcName}] req.body: ${JSON.stringify(req.body)}`);

      const wallet = await WalletDBInteractor.getWallet(accountName);
      console.log(`[${funcName}] wallet: ${JSON.stringify(wallet)}`);

      if (wallet.status == errorCodes.client_issue) {
        return ResponseHandler.sendClientError(
          400,
          req,
          res,
          "this account doesn't exist in DB"
        );
      } else if (wallet.status == errorCodes.server_issue) {
        throw new Error(wallet.err);
      }

      const enterResult = await lotteryInteractor.enter(
        wallet.result.account,
        CipherUtil.decrypt(wallet.result.private_key),
        enterAmt
      );

      if (!enterResult.status) {
        throw new Error(enterResult.errMsg);
      }

      return ResponseHandler.sendSuccess(
        res,
        "success",
        200
      )({
        status: "Confirmed",
        tx_hash: enterResult.result,
      });
    } catch (err) {
      console.error(`[${funcName}] err:`, err);
      return ResponseHandler.sendServerError(req, res, err);
    }
  }

  static async getBalance(req, res) {
    const funcName = "getBalance";
    try {
      const balanceResult = await lotteryInteractor.getBalance();

      if (!balanceResult.status) {
        throw new Error(balanceResult.errMsg);
      }

      return ResponseHandler.sendSuccess(
        res,
        "success",
        200
      )({
        status: "Confirmed",
        balance: balanceResult.result,
      });
    } catch (err) {
      console.error(`[${funcName}] err:`, err);
      return ResponseHandler.sendServerError(req, res, err);
    }
  }

  static async getPlayers(req, res) {
    const funcName = "getPlayers";
    try {
    } catch (err) {
      console.error(`[${funcName}] err:`, err);
      return ResponseHandler.sendServerError(req, res, err);
    }
  }

  static async lotteryId(req, res) {}

  static async lotteryHistory(req, res) {}
}

module.exports = LotteryController;
