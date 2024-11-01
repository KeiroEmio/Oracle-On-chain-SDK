// 使用 Ethers.js 进行交互
//类似与实例化一个用户进行交互
const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider("YOUR_ETH_NODE_URL");
const wallet = new ethers.Wallet("USER_PRIVATE_KEY", provider);
const taskManagerAddress = "TASK_MANAGER_CONTRACT_ADDRESS";

const taskManagerABI = [
    "function createSubscription(uint256 planDuration) external payable",
    "function createTask(bytes data) external"
];

const taskManager = new ethers.Contract(taskManagerAddress, taskManagerABI, wallet);

// 创建订阅，计划持续时间为 3600 秒（1 小时），支付 0.36 ETH
const planDuration = 3600; // 1 hour in seconds
const payment = ethers.utils.parseEther("0.36");

async function createSubscription() {
    const tx = await taskManager.createSubscription(planDuration, { value: payment });
    console.log(`Subscription transaction hash: ${tx.hash}`);
    await tx.wait();
    console.log("Subscription created successfully.");
}

createSubscription();

async function createTask() {
    // 定义任务数据，假设 JobRequest 包含一个 uint256 和一个 string
    const input = 42;
    const operation = "double";
    const encodedData = ethers.utils.defaultAbiCoder.encode(
        ["uint256", "string"],
        [input, operation]
    );

    const tx = await taskManager.createTask(encodedData);
    console.log(`Create task transaction hash: ${tx.hash}`);
    await tx.wait();
    console.log("Task created successfully.");
}

createTask();

async function createTask() {
    const input = 42;
    const operation = "double";
    const encodedData = ethers.utils.defaultAbiCoder.encode(
        ["uint256", "string"],
        [input, operation]
    );

    const tx = await taskManager.createTask(encodedData);
    console.log(`Create task transaction hash: ${tx.hash}`);
    await tx.wait();
    console.log("Task created successfully.");
}

createTask();
