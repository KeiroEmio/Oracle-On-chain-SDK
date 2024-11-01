require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      chainId: 1337
    },
    sepolia: {
      url: "https://sepolia.infura.io/v3/016a451a08ec48d9b12facd9e0f418b1",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      chainId: 11155111 
    }
  }
};