// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract DigiScribe is Ownable, ReentrancyGuard {
    // Structs
    struct Subscription {
        string serviceName;
        uint256 amount;
        uint256 frequency; // in seconds
        uint256 lastPayment;
        uint256 nextPayment;
        bool active;
        address paymentToken; // ERC20 token address for payments
    }

    struct Service {
        string name;
        address serviceWallet;
        bool exists;
    }

    // State variables
    mapping(address => Subscription[]) public userSubscriptions;
    mapping(string => Service) public registeredServices;
    mapping(address => uint256) public userRewardPoints;
    
    uint256 public constant REWARD_POINTS_PER_PAYMENT = 100;
    uint256 public constant POINTS_TO_TOKEN_RATIO = 1000; // 1000 points = 1 token
    
    IERC20 public rewardToken;
    
    // Events
    event SubscriptionCreated(address indexed user, string serviceName, uint256 amount);
    event SubscriptionCancelled(address indexed user, string serviceName);
    event PaymentProcessed(address indexed user, string serviceName, uint256 amount);
    event ServiceRegistered(string serviceName, address serviceWallet);
    event RewardsClaimed(address indexed user, uint256 amount);

    constructor(address _rewardToken) Ownable(msg.sender) {
        rewardToken = IERC20(_rewardToken);
    }

    // Service registration functions
    function registerService(string memory _serviceName, address _serviceWallet) 
        external 
        onlyOwner 
    {
        require(!registeredServices[_serviceName].exists, "Service already exists");
        registeredServices[_serviceName] = Service({
            name: _serviceName,
            serviceWallet: _serviceWallet,
            exists: true
        });
        emit ServiceRegistered(_serviceName, _serviceWallet);
    }

    // Subscription management functions
    function createSubscription(
        string memory _serviceName,
        uint256 _amount,
        uint256 _frequency,
        address _paymentToken
    ) external {
        require(registeredServices[_serviceName].exists, "Service not registered");
        require(_frequency > 0, "Invalid frequency");
        
        Subscription memory newSub = Subscription({
            serviceName: _serviceName,
            amount: _amount,
            frequency: _frequency,
            lastPayment: block.timestamp,
            nextPayment: block.timestamp + _frequency,
            active: true,
            paymentToken: _paymentToken
        });
        
        userSubscriptions[msg.sender].push(newSub);
        emit SubscriptionCreated(msg.sender, _serviceName, _amount);
    }

    function cancelSubscription(uint256 _subIndex) external {
        require(_subIndex < userSubscriptions[msg.sender].length, "Invalid subscription index");
        userSubscriptions[msg.sender][_subIndex].active = false;
        emit SubscriptionCancelled(
            msg.sender, 
            userSubscriptions[msg.sender][_subIndex].serviceName
        );
    }

    // Payment processing
    function processPayment(uint256 _subIndex) external nonReentrant {
        require(_subIndex < userSubscriptions[msg.sender].length, "Invalid subscription index");
        Subscription storage sub = userSubscriptions[msg.sender][_subIndex];
        require(sub.active, "Subscription not active");
        require(block.timestamp >= sub.nextPayment, "Payment not due yet");

        Service storage service = registeredServices[sub.serviceName];
        
        // Transfer payment tokens from user to service wallet
        IERC20(sub.paymentToken).transferFrom(
            msg.sender,
            service.serviceWallet,
            sub.amount
        );

        // Update subscription timing
        sub.lastPayment = block.timestamp;
        sub.nextPayment = block.timestamp + sub.frequency;

        // Award reward points
        userRewardPoints[msg.sender] += REWARD_POINTS_PER_PAYMENT;

        emit PaymentProcessed(msg.sender, sub.serviceName, sub.amount);
    }

    // Rewards system
    function claimRewards() external nonReentrant {
        uint256 points = userRewardPoints[msg.sender];
        require(points >= POINTS_TO_TOKEN_RATIO, "Insufficient points");

        uint256 tokens = points / POINTS_TO_TOKEN_RATIO;
        uint256 remainingPoints = points % POINTS_TO_TOKEN_RATIO;

        userRewardPoints[msg.sender] = remainingPoints;
        rewardToken.transfer(msg.sender, tokens);

        emit RewardsClaimed(msg.sender, tokens);
    }

    // View functions
    function getUserSubscriptions(address _user) 
        external 
        view 
        returns (Subscription[] memory) 
    {
        return userSubscriptions[_user];
    }

    function getSubscriptionCount(address _user) 
        external 
        view 
        returns (uint256) 
    {
        return userSubscriptions[_user].length;
    }

    function getUserRewardPoints(address _user) 
        external 
        view 
        returns (uint256) 
    {
        return userRewardPoints[_user];
    }
}