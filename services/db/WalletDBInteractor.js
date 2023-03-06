const _ = require("lodash");
const errorCodes = require("../../constants/errorCodes").errorCodes;
const { Wallet } = require("../../models");

class WalletDBInteractor {
  static async insertWallet(walletInfo) {
    const funcName = "insertWallet";
    try {
      console.log(`ttttttttttttttt------------`);
      console.log(`${JSON.stringify(Wallet)}`);
      console.log(`ttttttttttttttt------------`);
      const sameWallet = await Wallet.findOne({
        where: {
          account: walletInfo.account,
        },
      });
      console.log(`[${funcName}] sameWallet: ${JSON.stringify(sameWallet)}`);

      if (_.isEmpty(sameWallet)) {
        const created = await Wallet.create(walletInfo);
        if (!_.isEmpty(created)) {
          return {
            status: errorCodes.success,
            err: null,
          };
        } else {
          throw new Error(`account ${walletInfo.account} not inserted well`);
        }
      }
      return {
        status: errorCodes.client_issue,
        err: null,
      };
    } catch (err) {
      console.error(`[${funcName}] err:`, err);
      return {
        status: errorCodes.server_issue,
        err: err,
      };
    }
  }
}

module.exports = WalletDBInteractor;
