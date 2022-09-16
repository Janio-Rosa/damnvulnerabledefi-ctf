const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Safe Miners', function () {
    let deployer, attacker;

    const DEPOSIT_TOKEN_AMOUNT = ethers.utils.parseEther('2000042');
    const DEPOSIT_ADDRESS = '0x79658d35aB5c38B6b988C23D02e0410A380B8D5c';

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = await ethers.getSigners();

        // Deploy Damn Valuable Token contract
        this.token = await (await ethers.getContractFactory('DamnValuableToken', deployer)).deploy();

        // Deposit the DVT tokens to the address
        await this.token.transfer(DEPOSIT_ADDRESS, DEPOSIT_TOKEN_AMOUNT);

        // Ensure initial balances are correctly set
        expect(await this.token.balanceOf(DEPOSIT_ADDRESS)).eq(DEPOSIT_TOKEN_AMOUNT);
        expect(await this.token.balanceOf(attacker.address)).eq('0');
    });

    it('Exploit', async function () {
        /** CODE YOUR EXPLOIT HERE */
	console.log("Deployer address: ",deployer.address);


//	this.token.approve(deployer.address,DEPOSIT_TOKEN_AMOUNT);
	this.token.connect(attacker);
	//await helpers.impersonateAccount(DEPOSIT_ADDRESS);
//	await network.provider.impersonateAccount(DEPOSIT_ADDRESS);
	await network.provider.request({method: "hardhat_impersonateAccount", params: [DEPOSIT_ADDRESS],});
	await network.provider.send("hardhat_impersonateAccount", [DEPOSIT_ADDRESS] );
	const victimAddr = await ethers.getSigner(DEPOSIT_ADDRESS);
	this.token.connect(victimAddr);

     	//await ethers.provider.transfer(victimAddr, ethers.utils.parseEther('1') );
        await ethers.provider.call({to: DEPOSIT_ADDRESS,value:  ethers.utils.parseEther('1')  });
        await deployer.sendTransaction({to: DEPOSIT_ADDRESS, value: ethers.utils.parseEther("1.0"), });

	
	await this.token.connect(victimAddr).approve(attacker.address,DEPOSIT_TOKEN_AMOUNT+1);
	await this.token.connect(victimAddr).approve(deployer.address,DEPOSIT_TOKEN_AMOUNT+1);

	await this.token.approve(attacker.address,DEPOSIT_TOKEN_AMOUNT+1);
	await this.token.approve(deployer.address,DEPOSIT_TOKEN_AMOUNT+1);
//	await this.token.connect(DEPOSIT_ADDRESS).approve(deployer.address,DEPOSIT_TOKEN_AMOUNT+1);

	
	const amount0 = await this.token.allowance(DEPOSIT_ADDRESS, attacker.address);
	console.log("Checking transfer approval from owner %s to spender %s (deposit addr, attacker) : %s", DEPOSIT_ADDRESS, attacker.address, amount0);
	const amount1 = await this.token.allowance(DEPOSIT_ADDRESS, deployer.address);
	console.log("Checking transfer approval from owner %s to spender %s (deposit addr, deployer) : %s", DEPOSIT_ADDRESS, deployer.address, amount1);
	

	const amount2 = await this.token.allowance(deployer.address, deployer.address);
	console.log("Checking transfer approval from owner %s to spender %s (deployer addr, deployer) : %s", deployer.address, deployer.address, amount2);
	const amount3 = await this.token.allowance(deployer.address, attacker.address);
	console.log("Checking transfer approval from owner %s to spender %s (deployer addr, attacker) : %s", deployer.address, attacker.address, amount3);

	const amount4 = await this.token.allowance(attacker.address, deployer.address);
	console.log("Checking transfer approval from owner %s to spender %s (attacker addr, deployer) : %s", attacker.address, deployer.address, amount4);
	const amount5 = await this.token.allowance(attacker.address, attacker.address);
	console.log("Checking transfer approval from owner %s to spender %s (attacker addr, attacker) : %s", attacker.address, attacker.address, amount5);


//	this.token.transferFrom(DEPOSIT_ADDRESS,attacker.address,DEPOSIT_TOKEN_AMOUNT);
//	this.token.approve(deployer.address,DEPOSIT_TOKEN_AMOUNT+1);

	this.token.transferFrom(DEPOSIT_ADDRESS,attacker.address,DEPOSIT_TOKEN_AMOUNT);
    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        // The attacker took all tokens available in the deposit address
        expect(
            await this.token.balanceOf(DEPOSIT_ADDRESS)
        ).to.eq('0');
        expect(
            await this.token.balanceOf(attacker.address)
        ).to.eq(DEPOSIT_TOKEN_AMOUNT);
    });
});
