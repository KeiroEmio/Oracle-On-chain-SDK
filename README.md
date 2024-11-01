项目简介
Oracle On-chain SDK 是一个基于以太坊和 Solidity 构建的智能合约套件，用于桥接链上活动与链下计算工作负载。该 SDK 通过管理用户订阅、编码/解码数据以及确保区块链与外部计算资源之间的安全、高效通信，实现了去中心化计算任务的自动化处理。

功能
订阅管理：用户可以创建、续订和取消订阅，以获取执行链下计算任务的权限。
任务管理：订阅用户可以提交计算任务，任务状态会自动更新为 Pending、Completed 或 Failed。
预言机集成：链下计算服务监听合约事件，执行计算任务，并将结果通过预言机提交回链上。
数据编码/解码：确保链上与链下的数据格式兼容，支持动态处理任务请求和结果。
气体优化与回退机制：优化智能合约的 Gas 消耗，并在链下计算失败时触发回退机制。
合约架构
SubscriptionManager：管理用户订阅，包括创建、续订和取消订阅。
TaskManager：管理计算任务的创建和状态更新，确保只有订阅用户可以提交任务。
Oracle：作为预言机，接收链下计算结果并更新任务状态。
环境设置
前提条件
Node.js (v14 或更高)
npm
Hardhat (已通过 npm 安装)
安装依赖
在项目根目录下运行以下命令，安装必要的依赖：

bash
复制代码
npm install
配置环境变量
在项目根目录下创建一个 .env 文件，用于存储敏感信息：

env
复制代码

# .env

ETH_NODE_URL=https://rinkeby.infura.io/v3/YOUR_INFURA_PROJECT_ID
PRIVATE_KEY=your_private_key_here
CONTRACT_ADDRESS= # 部署后填写
注意：

将 YOUR_INFURA_PROJECT_ID 替换为您在 Infura 或其他提供商处获取的节点 URL。
将 your_private_key_here 替换为您的钱包私钥（绝对不要泄露您的私钥！）。
CONTRACT_ADDRESS 在部署后会自动填写。
