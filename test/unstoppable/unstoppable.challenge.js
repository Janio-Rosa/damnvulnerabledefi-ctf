const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Unstoppable', function () {
    let deployer, attacker, someUser;

    // Pool has 1M * 10**18 tokens
    const TOKENS_IN_POOL = ethers.utils.parseEther('1000000');
    const INITIAL_ATTACKER_TOKEN_BALANCE = ethers.utils.parseEther('100');

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */

        [deployer, attacker, someUser] = await ethers.getSigners();

        const DamnValuableTokenFactory = await ethers.getContractFactory('DamnValuableToken', deployer);
        const UnstoppableLenderFactory = await ethers.getContractFactory('UnstoppableLender', deployer);

        this.token = await DamnValuableTokenFactory.deploy();
        this.pool = await UnstoppableLenderFactory.deploy(this.token.address);

        await this.token.approve(this.pool.address, TOKENS_IN_POOL);
        await this.pool.depositTokens(TOKENS_IN_POOL);

        await this.token.transfer(attacker.address, INITIAL_ATTACKER_TOKEN_BALANCE);

        expect(
            await this.token.balanceOf(this.pool.address)
        ).to.equal(TOKENS_IN_POOL);

        expect(
            await this.token.balanceOf(attacker.address)
        ).to.equal(INITIAL_ATTACKER_TOKEN_BALANCE);

         // Show it's possible for someUser to take out a flash loan
         const ReceiverContractFactory = await ethers.getContractFactory('ReceiverUnstoppable', someUser);
         this.receiverContract = await ReceiverContractFactory.deploy(this.pool.address);
         await this.receiverContract.executeFlashLoan(10);
    });

    it('Exploit', async function () {
        /** CODE YOUR EXPLOIT HERE */
await this.token.approve(deployer.address, TOKENS_IN_POOL);
//await this.token.approve(someUser.address, TOKENS_IN_POOL );
//await this.token.approve(attacker.address, TOKENS_IN_POOL);
//await this.token.approve(this.pool.address, TOKENS_IN_POOL);
//await this.token.approve(this.token.address, TOKENS_IN_POOL);
console.log(deployer.address);
console.log(this.token.address);
console.log(this.pool.address);
console.log(someUser.address);
console.log(attacker.address);
console.log(this.receiverContract.address);

//	 await this.token.approve(attacker.address,INITIAL_ATTACKER_TOKEN_BALANCE);
//         console.log(INITIAL_ATTACKER_TOKEN_BALANCE);
//         await this.token.transferFrom(attacker.address,this.pool.address,ethers.utils.parseEther('1'));
//         await this.token.transfer(this.pool.address,1);
//         await this.token.transfer(this.pool.address,INITIAL_ATTACKER_TOKEN_BALANCE);
//         await this.token.transferFrom(this.pool.address,attacker.address,INITIAL_ATTACKER_TOKEN_BALANCE);
//         await this.token.transferFrom(this.pool.address,attacker.address,1);
//         await this.token.transfer(attacker.address,10);
	   await this.token.transferFrom(this.pool.address,attacker.address,10 );

//	await this.token.transfer(this.pool.address, INITIAL_ATTACKER_TOKEN_BALANCE, {from: attacker.address, } );
    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        // It is no longer possible to execute flash loans
        await expect(
            this.receiverContract.executeFlashLoan(10)
        ).to.be.reverted;
    });
});
