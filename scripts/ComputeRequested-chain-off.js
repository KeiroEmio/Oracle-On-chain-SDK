require('dotenv').config();
const { ethers } = require('ethers');

const ETH_NODE_URL = process.env.SPEOLIA_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const oracleABI = [
    // 仅包含需要用到的事件和函数的ABI
    "event ComputeRequested(uint256 indexed taskId, bytes data)",
    "function submitResult(uint256 taskId, bytes result, tuple(bytes data, bytes signature) proof) external",
    "function submitFailure(uint256 taskId, string reason) external"
];

const provider = new ethers.providers.JsonRpcProvider(ETH_NODE_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const oracleContract = new ethers.Contract(CONTRACT_ADDRESS, oracleABI, wallet);

// 监听ComputeRequested事件
oracleContract.on('ComputeRequested', async (taskId, data, event) => {
    console.log(`Received ComputeRequested for Task ID: ${taskId}`);

    try {
        const decodedData = ethers.utils.defaultAbiCoder.decode(
            ["uint256", "string"],
            data
        );
        const [input, operation] = decodedData;

        console.log(`Task Data - Input: ${input}, Operation: ${operation}`);

        // 执行链下计算任务
        //chain-off 计算并调用链的证明
        let result;
        if (operation === "double") {
            result = input * 2;
        } else if (operation === "square") {
            result = input * input;
        } else {
            throw new Error("Unsupported operation");
        }

        console.log(`Computed Result: ${result}`);

        const encodedResult = ethers.utils.defaultAbiCoder.encode(["uint256"], [result]);

        // 创建证明（这里简化为不进行实际签名）
        const proof = {
            data: ethers.utils.hexlify(ethers.utils.toUtf8Bytes("Proof Data")),
            signature: ethers.utils.hexlify(ethers.utils.toUtf8Bytes("Signature"))
        };

        // 提交结果回链上
        const tx = await oracleContract.submitResult(taskId, encodedResult, proof);
        console.log(`Submitted result for Task ID: ${taskId}, Tx Hash: ${tx.hash}`);
        
        // 等待交易确认
        await tx.wait();
        console.log(`Transaction confirmed for Task ID: ${taskId}`);
    } catch (error) {
        console.error(`Error processing Task ID: ${taskId} - ${error.message}`);

        // 提交失败原因回链上
        try {
            const tx = await oracleContract.submitFailure(taskId, error.message);
            console.log(`Submitted failure for Task ID: ${taskId}, Tx Hash: ${tx.hash}`);
            await tx.wait();
            console.log(`Failure transaction confirmed for Task ID: ${taskId}`);
        } catch (failureError) {
            console.error(`Failed to submit failure for Task ID: ${taskId} - ${failureError.message}`);
        }
    }
});

// 处理未捕获的异常
process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});
