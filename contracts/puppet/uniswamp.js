[
  {
    name: 'TokenPurchase',
    inputs: [ [Object], [Object], [Object] ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'EthPurchase',
    inputs: [ [Object], [Object], [Object] ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'AddLiquidity',
    inputs: [ [Object], [Object], [Object] ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'RemoveLiquidity',
    inputs: [ [Object], [Object], [Object] ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'Transfer',
    inputs: [ [Object], [Object], [Object] ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'Approval',
    inputs: [ [Object], [Object], [Object] ],
    anonymous: false,
    type: 'event'
  },
  {
    name: 'setup',
    outputs: [],
    inputs: [ [Object] ],
    constant: false,
    payable: false,
    type: 'function',
    gas: 175875
  },
  {
    name: 'addLiquidity',
    outputs: [ [Object] ],
    inputs: [ [Object], [Object], [Object] ],
    constant: false,
    payable: true,
    type: 'function',
    gas: 82605
  },
  {
    name: 'removeLiquidity',
    outputs: [ [Object], [Object] ],
    inputs: [ [Object], [Object], [Object], [Object] ],
    constant: false,
    payable: false,
    type: 'function',
    gas: 116814
  },
  {
    name: '__default__',
    outputs: [],
    inputs: [],
    constant: false,
    payable: true,
    type: 'function'
  },
  {
    name: 'ethToTokenSwapInput',
    outputs: [ [Object] ],
    inputs: [ [Object], [Object] ],
    constant: false,
    payable: true,
    type: 'function',
    gas: 12757
  },
  {
    name: 'ethToTokenTransferInput',
    outputs: [ [Object] ],
    inputs: [ [Object], [Object], [Object] ],
    constant: false,
    payable: true,
    type: 'function',
    gas: 12965
  },
  {
    name: 'ethToTokenSwapOutput',
    outputs: [ [Object] ],
    inputs: [ [Object], [Object] ],
    constant: false,
    payable: true,
    type: 'function',
    gas: 50455
  },
  {
    name: 'ethToTokenTransferOutput',
    outputs: [ [Object] ],
    inputs: [ [Object], [Object], [Object] ],
    constant: false,
    payable: true,
    type: 'function',
    gas: 50663
  },
  {
    name: 'tokenToEthSwapInput',
    outputs: [ [Object] ],
    inputs: [ [Object], [Object], [Object] ],
    constant: false,
    payable: false,
    type: 'function',
    gas: 47503
  },
  {
    name: 'tokenToEthTransferInput',
    outputs: [ [Object] ],
    inputs: [ [Object], [Object], [Object], [Object] ],
    constant: false,
    payable: false,
    type: 'function',
    gas: 47712
  },
  {
    name: 'tokenToEthSwapOutput',
    outputs: [ [Object] ],
    inputs: [ [Object], [Object], [Object] ],
    constant: false,
    payable: false,
    type: 'function',
    gas: 50175
  },
  {
    name: 'tokenToEthTransferOutput',
    outputs: [ [Object] ],
    inputs: [ [Object], [Object], [Object], [Object] ],
    constant: false,
    payable: false,
    type: 'function',
    gas: 50384
  },
  {
    name: 'tokenToTokenSwapInput',
    outputs: [ [Object] ],
    inputs: [ [Object], [Object], [Object], [Object], [Object] ],
    constant: false,
    payable: false,
    type: 'function',
    gas: 51007
  },
  {
    name: 'tokenToTokenTransferInput',
    outputs: [ [Object] ],
    inputs: [ [Object], [Object], [Object], [Object], [Object], [Object] ],
    constant: false,
    payable: false,
    type: 'function',
    gas: 51098
  },
  {
    name: 'tokenToTokenSwapOutput',
    outputs: [ [Object] ],
    inputs: [ [Object], [Object], [Object], [Object], [Object] ],
    constant: false,
    payable: false,
    type: 'function',
    gas: 54928
  },
  {
    name: 'tokenToTokenTransferOutput',
    outputs: [ [Object] ],
    inputs: [ [Object], [Object], [Object], [Object], [Object], [Object] ],
    constant: false,
    payable: false,
    type: 'function',
    gas: 55019
  },
  {
    name: 'tokenToExchangeSwapInput',
    outputs: [ [Object] ],
    inputs: [ [Object], [Object], [Object], [Object], [Object] ],
    constant: false,
    payable: false,
    type: 'function',
    gas: 49342
  },
  {
    name: 'tokenToExchangeTransferInput',
    outputs: [ [Object] ],
    inputs: [ [Object], [Object], [Object], [Object], [Object], [Object] ],
    constant: false,
    payable: false,
    type: 'function',
    gas: 49532
  },
  {
    name: 'tokenToExchangeSwapOutput',
    outputs: [ [Object] ],
    inputs: [ [Object], [Object], [Object], [Object], [Object] ],
    constant: false,
    payable: false,
    type: 'function',
    gas: 53233
  },
  {
    name: 'tokenToExchangeTransferOutput',
    outputs: [ [Object] ],
    inputs: [ [Object], [Object], [Object], [Object], [Object], [Object] ],
    constant: false,
    payable: false,
    type: 'function',
    gas: 53423
  },
  {
    name: 'getEthToTokenInputPrice',
    outputs: [ [Object] ],
    inputs: [ [Object] ],
    constant: true,
    payable: false,
    type: 'function',
    gas: 5542
  },
  {
    name: 'getEthToTokenOutputPrice',
    outputs: [ [Object] ],
    inputs: [ [Object] ],
    constant: true,
    payable: false,
    type: 'function',
    gas: 6872
  },
  {
    name: 'getTokenToEthInputPrice',
    outputs: [ [Object] ],
    inputs: [ [Object] ],
    constant: true,
    payable: false,
    type: 'function',
    gas: 5637
  },
  {
    name: 'getTokenToEthOutputPrice',
    outputs: [ [Object] ],
    inputs: [ [Object] ],
    constant: true,
    payable: false,
    type: 'function',
    gas: 6897
  },
  {
    name: 'tokenAddress',
    outputs: [ [Object] ],
    inputs: [],
    constant: true,
    payable: false,
    type: 'function',
    gas: 1413
  },
  {
    name: 'factoryAddress',
    outputs: [ [Object] ],
    inputs: [],
    constant: true,
    payable: false,
    type: 'function',
    gas: 1443
  },
  {
    name: 'balanceOf',
    outputs: [ [Object] ],
    inputs: [ [Object] ],
    constant: true,
    payable: false,
    type: 'function',
    gas: 1645
  },
  {
    name: 'transfer',
    outputs: [ [Object] ],
    inputs: [ [Object], [Object] ],
    constant: false,
    payable: false,
    type: 'function',
    gas: 75034
  },
  {
    name: 'transferFrom',
    outputs: [ [Object] ],
    inputs: [ [Object], [Object], [Object] ],
    constant: false,
    payable: false,
    type: 'function',
    gas: 110907
  },
  {
    name: 'approve',
    outputs: [ [Object] ],
    inputs: [ [Object], [Object] ],
    constant: false,
    payable: false,
    type: 'function',
    gas: 38769
  },
  {
    name: 'allowance',
    outputs: [ [Object] ],
    inputs: [ [Object], [Object] ],
    constant: true,
    payable: false,
    type: 'function',
    gas: 1925
  },
  {
    name: 'name',
    outputs: [ [Object] ],
    inputs: [],
    constant: true,
    payable: false,
    type: 'function',
    gas: 1623
  },
  {
    name: 'symbol',
    outputs: [ [Object] ],
    inputs: [],
    constant: true,
    payable: false,
    type: 'function',
    gas: 1653
  },
  {
    name: 'decimals',
    outputs: [ [Object] ],
    inputs: [],
    constant: true,
    payable: false,
    type: 'function',
    gas: 1683
  },
  {
    name: 'totalSupply',
    outputs: [ [Object] ],
    inputs: [],
    constant: true,
    payable: false,
    type: 'function',
    gas: 1713

