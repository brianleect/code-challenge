const { ethers } = require("ethers");

// https://rinkeby.etherscan.io/address/0x9D9d8f7e3BE8e10F7F50E1110b88DABc9b1aaA48#code
const ADDR = "0x9D9d8f7e3BE8e10F7F50E1110b88DABc9b1aaA48";   // your contract address
const ABI = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [{ "internalType": "address", "name": "walletAddress", "type": "address" }, { "internalType": "contract IERC20[]", "name": "tokenAddresses", "type": "address[]" }], "name": "getBalances", "outputs": [{ "components": [{ "internalType": "contract IERC20", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "balance", "type": "uint256" }], "internalType": "struct UtilityContract.BalanceOutput[]", "name": "", "type": "tuple[]" }], "stateMutability": "view", "type": "function" }];

const ADDRESS = "0x5195396556aa51E4C123bAcC9fE965FD102D1947"; // some wallet address with token balance
const TOKENS = [    // token contract addresses
    "0x3ed51337eec64f1a3475547d022a05e4b3b8910b", // MARK
    "0xc778417e063141139fce010982780140aa0cd5ab", // WETH
];

// you can use your own RPC provider url (no need to deploy to mainnet)
const provider = new ethers.providers.JsonRpcProvider('https://eth-rinkeby.alchemyapi.io/v2/cUZRHgkLGr_evFRnEekhFObEav1VOmRm');

const test = async () => {
    const contract = new ethers.Contract(ADDR, ABI, provider);

    const balances = await contract.getBalances(ADDRESS, TOKENS);

    return balances;
};

test().then(console.log);