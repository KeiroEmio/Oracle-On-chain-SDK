// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SubscriptionManager {
    struct Subscription {
        uint256 id;
        address subscriber;
        uint256 planDuration; // 订阅计划的持续时间（秒）
        uint256 expiration; // 订阅到期时间戳
    }

    uint256 public subscriptionCount;
    mapping(uint256 => Subscription) public subscriptions;
    mapping(address => uint256[]) public userSubscriptions;

    event SubscriptionCreated(
        uint256 indexed id,
        address indexed subscriber,
        uint256 planDuration,
        uint256 expiration
    );
    event SubscriptionRenewed(uint256 indexed id, uint256 newExpiration);
    event SubscriptionCancelled(uint256 indexed id);

    function createSubscription(uint256 planDuration) external payable {
        require(
            msg.value >= getPlanPrice(planDuration),
            "Insufficient payment"
        );
        subscriptionCount += 1;
        uint256 expiration = block.timestamp + planDuration;
        subscriptions[subscriptionCount] = Subscription({
            id: subscriptionCount,
            subscriber: msg.sender,
            planDuration: planDuration,
            expiration: expiration
        });
        userSubscriptions[msg.sender].push(subscriptionCount);
        emit SubscriptionCreated(
            subscriptionCount,
            msg.sender,
            planDuration,
            expiration
        );
    }

    function renewSubscription(
        uint256 subscriptionId,
        uint256 planDuration
    ) external payable {
        Subscription storage sub = subscriptions[subscriptionId];
        require(sub.subscriber == msg.sender, "Not subscriber");
        require(sub.expiration >= block.timestamp, "Subscription expired");
        require(
            msg.value >= getPlanPrice(planDuration),
            "Insufficient payment"
        );
        sub.expiration += planDuration;
        emit SubscriptionRenewed(subscriptionId, sub.expiration);
    }

    function cancelSubscription(uint256 subscriptionId) external {
        Subscription storage sub = subscriptions[subscriptionId];
        require(sub.subscriber == msg.sender, "Not subscriber");
        require(
            sub.expiration >= block.timestamp,
            "Subscription already expired"
        );
        sub.expiration = block.timestamp; // 立即过期
        emit SubscriptionCancelled(subscriptionId);
    }

    function getPlanPrice(uint256 planDuration) public pure returns (uint256) {
        // 示例定价策略：每秒0.01 ether（实际应根据需求调整）
        return planDuration * 0.0001 ether;
    }

    function hasValidSubscription(address user) public view returns (bool) {
        uint256[] memory subs = userSubscriptions[user];
        for (uint256 i = 0; i < subs.length; i++) {
            if (subscriptions[subs[i]].expiration >= block.timestamp) {
                return true;
            }
        }
        return false;
    }
}
