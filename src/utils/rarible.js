import { eip712Hash } from 'eth-sig-util';
import { bufferToHex } from 'ethereumjs-util';
import Web3 from 'web3';
import { supportedChains } from './chain';

import { ipfsPrePost, ipfsJsonPin } from './metadata';

export const buildEncodeOrder = args => {
  const salt = Math.floor(Math.random() * 1000);
  return {
    type: 'RARIBLE_V2',
    maker: args.minionAddress,
    make: {
      assetType: {
        assetClass: 'ERC721',
        contract: args.nftContract,
        tokenId: args.tokenId,
      },
      value: '1',
    },
    take: {
      assetType: {
        assetClass: 'ERC20',
        contract: args.tokenAddress,
      },
      value: args.price,
    },
    data: {
      dataType: 'RARIBLE_V2_DATA_V1',
      payouts: [],
      originFees: [],
    },
    salt,
    start: args.startDate,
    end: args.endDate,
  };
};

export const encodeOrder = async (order, daochain) => {
  const url = `${supportedChains[daochain].rarible.api_url}/order/encoder/order`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });
    return response.json();
  } catch (err) {
    throw new Error(err);
  }
};

export const createOrder = async (order, daochain) => {
  const url = `${supportedChains[daochain].rinkeby.api_url}/order/orders`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });
    return response.json();
  } catch (err) {
    throw new Error(err);
  }
};

export const getMessageHash = encodedOrder => {
  // what is version?
  const version = '0';
  const hash = eip712Hash(encodedOrder.signMessage, version);
  console.log('hash', hash);
  return bufferToHex(hash);
};

export const getSignatureHash = () => {
  const arbitrarySignature =
    '0xc531a1d9046945d3732c73d049da2810470c3b0663788dca9e9f329a35c8a0d56add77ed5ea610b36140641860d13849abab295ca46c350f50731843c6517eee1c';
  const arbitrarySignatureHash = Web3.utils.soliditySha3({
    t: 'bytes',
    v: arbitrarySignature,
  });

  return arbitrarySignatureHash;
};

export const pinOrderToIpfs = async (order, daoid) => {
  const keyRes = await ipfsPrePost('dao/ipfs-key', {
    daoAddress: daoid,
  });
  const ipfsRes = await ipfsJsonPin(keyRes, order);

  console.log('ipfsRes', ipfsRes);

  return ipfsRes;
};
