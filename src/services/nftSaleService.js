import Web3 from 'web3';

import NFTSaleAbi from '../contracts/niftySale.json';

import { chainByID } from '../utils/chain';

// xdai
export const MCNFT_ADDRESS = '0x938f6dEC7f5bd987C5196693c88A2f541CB90b01';

export const NiftyService = ({
  web3,
  chainID,
  tokenAddress,
  // atBlock = 'latest',
}) => {
  if (!web3) {
    const rpcUrl = chainByID(chainID).rpc_url;
    web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
  }
  const abi = NFTSaleAbi;
  const contract = new web3.eth.Contract(abi, tokenAddress);
  return service => {
    if (service === 'tokenOfOwnerByIndex') {
      return async ({ accountAddr, index }) => {
        try {
          const tokenOfOwnerByIndex = await contract.methods
            .tokenOfOwnerByIndex(accountAddr, index)
            .call();
          return tokenOfOwnerByIndex;
        } catch (error) {
          console.error('ERR:', error);
        }
        return null;
      };
    }

    return null;
  };
};
