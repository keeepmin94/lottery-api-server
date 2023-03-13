const ContractUtil = require("./ContractUtil");
const contractUtil = new ContractUtil();

class LotteryInteractor {
  constructor() {
    this.#initializeContract();
  }

  // 클래스 매소드에서 메소드명 앞에 #이 붙으면 private 메소드를 뜻함
  async #initializeContract() {
    this.web3 = contractUtil.web3;
    this.Lottery = await contractUtil.getContract("Lottery");
  }

  async enter(signer, pk, enterAmt) {
    const funcName = "enter";
    try {
      //가스비 추정 (web3 제공 함수 estimateGas) -> https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html
      const gas = await this.Lottery.methods
        .enter()
        .estimateGas({ from: signer, value: enterAmt })
        .catch((revertReason) => {
          throw new Error(`estimating gas error: ${revertReason}`);
        });

      const to = this.Lottery._address;
      const data = this.Lottery.methods.enter().encodeABI(); //enter함수 자체를 encodeABI통해서 내용 생성후 함수 내용을 넘겨줌

      const serializedTx = await contractUtil.signTransaction(
        signer,
        pk,
        to,
        gas,
        enterAmt,
        data
      );

      //서명이 완료된 트랜잭션 전송
      let txHash;
      await this.web3.eth
        .sendSignedTransaction(serializedTx)
        .on("transactionHash", async (tx) => {
          //마이너들에게 채택이 되면(블럭에 담기면) transactionHash 이벤트 캐치
          console.log(`[${funcName}] transaction created! tx hash: ${tx}`);
          txHash = tx;
        });

      return {
        status: true,
        result: txHash,
        errMsg: null,
      };
    } catch (err) {
      console.error(`[${funcName}] err:`, err);
      return {
        status: false,
        result: null,
        errMsg: err.message,
      };
    }
  }

  async getBalance() {
    const funcName = "getBalance";
    try {
      const balance = await this.Lottery.methods.getBalance().call();
      console.log(`[${funcName}] balance of Lottery: ${balance}`);

      return {
        status: true,
        result: balance,
        errMsg: null,
      };
    } catch (err) {
      console.error(`[${funcName}] err:`, err);
      return {
        status: false,
        result: null,
        errMsg: err.message,
      };
    }
  }

  async getPlayers() {
    const funcName = "getPlayers";
    try {
      const players = await this.Lottery.methods.getPlayers().call();
      console.log(
        `[${funcName}] players of Lottery: ${JSON.stringify(players)}`
      );

      return {
        status: true,
        result: players,
        errMsg: null,
      };
    } catch (err) {
      console.error(`[${funcName}] err:`, err);
      return {
        status: false,
        result: null,
        errMsg: err.message,
      };
    }
  }
}

module.exports = LotteryInteractor;
