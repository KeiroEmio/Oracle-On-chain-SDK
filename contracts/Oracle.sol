// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SubscriptionManager.sol";

contract TaskManager is SubscriptionManager {
    struct Task {
        uint256 id;
        address requester;
        bytes data;
        string status;
        bytes result;
    }

    uint256 public taskCount;
    mapping(uint256 => Task) public tasks;

    event TaskCreated(
        uint256 indexed id,
        address indexed requester,
        bytes data
    );
    event TaskCompleted(uint256 indexed id, bytes result);
    event TaskFailed(uint256 indexed id, string reason);
    event ComputeRequested(uint256 indexed taskId, bytes data);

    address public oracleAddress;
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function setOracleAddress(address _oracleAddress) external onlyOwner {
        oracleAddress = _oracleAddress;
    }

    function createTask(bytes memory data) external {
        // 检查订阅有效性
        require(hasValidSubscription(msg.sender), "Invalid subscription");

        taskCount += 1;
        tasks[taskCount] = Task({
            id: taskCount,
            requester: msg.sender,
            data: data,
            status: "Pending",
            result: ""
        });
        emit TaskCreated(taskCount, msg.sender, data);

        // 触发事件以启动链下计算
        emit ComputeRequested(taskCount, data);
    }

    function completeTask(uint256 taskId, bytes memory result) internal {
        Task storage task = tasks[taskId];
        require(
            keccak256(bytes(task.status)) == keccak256("Pending"),
            "Task not pending"
        );
        task.status = "Completed";
        task.result = result;
        emit TaskCompleted(taskId, result);
    }

    function failTask(uint256 taskId, string memory reason) internal {
        Task storage task = tasks[taskId];
        require(
            keccak256(bytes(task.status)) == keccak256("Pending"),
            "Task not pending"
        );
        task.status = "Failed";
        emit TaskFailed(taskId, reason);
    }

    function fallbackTask(uint256 taskId) external onlyOwner {
        Task storage task = tasks[taskId];
        require(
            keccak256(bytes(task.status)) == keccak256("Pending"),
            "Task not pending"
        );
        task.status = "Failed";
        emit TaskFailed(taskId, "Fallback due to timeout");
    }
}
