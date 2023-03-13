const Web3 = require("web3");
const path = require("path");
const config = require("../../config/appConfig");
const envType = process.env.NODE_ENV || "development";
require("dotenv").config({
  path: path.join(__dirname, `../../config/${envType}.env`),
});
const fs = require("fs");
const { FeeMarketEIP1559Transaction } = require("@ethereumjs/tx");
const Common = require("@ethereumjs/common").default;
const { Chain, Hardfork } = require("@ethereumjs/common");

class ContractUtil {
  constructor() {
    this.#initializeWeb3();
  }

  #initializeWeb3() {
    this.web3 = new Web3(
      new Web3.providers.HttpProvider(config.blockchain[envType])
    );
  }

  // 컨트랙트 가져오기
  async getContract(contractName) {
    const funcName = "getContract";
    try {
      // web3가 연결 잘 되어있는지 확인
      if (!(await this.web3.eth.net.isListening())) {
        this.#initializeWeb3(); // 다시 연결
      }
      const abi = this.#getContractAbi(contractName);
      const ca = process.env[contractName];

      const contract = new this.web3.eth.Contract(abi, ca);

      return contract;
    } catch (err) {
      console.error(`[${funcName}] err:`, err);
    }
  }

  // abi 파일 추출
  #getContractAbi(contractName) {
    const funcName = "getContractAbi";
    try {
      const dir = path.resolve(__dirname, "../../contractAbis");
      const json = fs.readFileSync(`${dir}/${contractName}.json`);
      const instance = JSON.parse(json); //object형태로 치환

      return instance.abi;
    } catch (err) {
      console.error(`[${funcName}] err:`, err);
    }
  }

  //EIP1559 트랜잭션 생성 & 전자 서명
  async signTransaction(signer, pk, to, gas, value, data) {
    const funcName = "signTransaction";
    try {
      const nonce = await this.web3.eth.getTransactionCount(signer); // 사용자 계정의 논스값
      const priorityFee = this.web3.utils.toWei("1", "Gwei"); //사용자가 거래를 블록에 포함시기위해 채굴자에게 직접 지불하는 가스 가격
      const pendingBlock = await this.web3.eth.getBlock("pending");
      const baseFeePerGas = pendingBlock.baseFeePerGas; //블록에 트랜잭션을 포함하기 위해 필요한 최소 가스 가격
      const chainId = await this.web3.eth.net.getId();

      const rawTx = {
        nonce: this.web3.utils.toHex(nonce),
        to: to,
        maxPriorityFeePerGas: this.web3.utils.toHex(priorityFee), //채굴자에게 줄 수 있는 팁의 최대값
        maxFeePerGas: this.web3.utils.toHex(
          // 자신이 최대로 허용할 수 있는 가스의 최대 가격  (MaxFee를 BaseFee보다 낮게 설정하면 거래가 처리되지 않거나 계속 pending 상태로 머뭄)
          Math.floor(baseFeePerGas * 1.01) + Number(priorityFee)
        ),
        gas: this.web3.utils.toHex(gas),
        gasLimit: this.web3.utils.toHex(Math.floor(gas * 1.01)),
        value: this.web3.utils.toHex(value),
        data: data,
        chainId: this.web3.utils.toHex(chainId),
      };
      console.log(`[${funcName}] rawTx: ${JSON.stringify(rawTx)}`);

      const common = new Common({
        chain: Chain.Goerli,
        hardfork: Hardfork.London,
      });

      const tx = FeeMarketEIP1559Transaction.fromTxData(rawTx, { common }); //EIP1559타입 Transaction 생성
      const signedTx = tx.sign(Buffer.from(pk, "hex")); //사용자의 pk로 transaction 서명

      //FeeMarketEIP1559Transaction -> HEX
      const serializedTx = "0x" + signedTx.serialize().toString("hex");

      console.log(
        `[${funcName}] signedTx: ${JSON.stringify(
          signedTx
        )}, serializedTx: ${serializedTx}`
      );

      return serializedTx;
    } catch (err) {
      console.error(`[${funcName}] err:`, err);
    }
  }
}

module.exports = ContractUtil;
