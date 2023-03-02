const _ = require("lodash"); //빈값 체크 모듈
const path = require("path");
const envType = process.env.NODE_ENV || "development";
require("dotenv").config({
  path: path.join(__dirname, `../config/${envType}.env`),
});

module.exports = async (sequelize, DataTypes) => {
  const wallet = sequelize.define(
    "Wallet",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      account_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      account: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      private_key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      is_master: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createAt: {
        type: DataTypes.DATE,
        field: "create_at",
      },
      updateAt: {
        type: DataTypes.DATE,
        field: "update_at",
      },
    },
    {
      freezeTableName: true,
    }
  );

  wallet.sync().then(async () => {
    const masterWallet = await wallet.findOne({
      where: { account: process.env.MASTER_WALLET_ADDRESS },
    });
  });
  if(_.isEmpty(masterWallet)){
    await wallet.create({
        account_name: "master",
        account: process.env.MASTER_WALLET_ADDRESS,
        private_key: process.env.MASTER_WALLET_PRIVATE_KEY,
        is_master: true,
    })
  }
  return wallet;
};
