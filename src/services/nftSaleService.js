import Web3 from 'web3';

import NFTSaleAbi from '../contracts/niftySale.json';

import { chainByID } from '../utils/chain';

export const NftSaleService = ({
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
  const contract = new web3.eth.Contract(
    abi,
    '0x0D0217FB49A71A631251b0796EF0e595B0B6d622', // xdai NFT sale contract
  );
  return service => {
    if (service === 'orders') {
      return async ({ tokenId }) => {
        try {
          const saleOrder = await contract.methods
            .orders(tokenAddress, tokenId)
            .call();
          console.log('saleOrder', saleOrder);
          return saleOrder;
        } catch (error) {
          console.error('ERR:', error);
        }
        return null;
      };
    }
    // uint256 _tokenId,
    // address _nftAddress,
    // uint256 _price,
    // address _token,
    // address _alternateReceiver,
    // string memory details
    if (service === 'setNewOrderNoop') {
      console.log('setNewOrderNoop');
      return async ({ tokenId, nftAddress, price, token, altRec }) => {
        console.log('?????????????/', contract.methods);
        try {
          const newSaleOrderHex = await contract.methods
            .setNewOrder(tokenId, nftAddress, price, token, altRec)
            .encodeABI();
          return newSaleOrderHex;
        } catch (error) {
          console.error('ERR:', error);
        }
        return null;
      };
    }
    if (service === 'fillOrder') {
      return async ({ tokenId }) => {
        console.log('contract.methods', contract.methods);
        console.log('tokenAddress, tokenId', tokenAddress, tokenId);
        try {
          const saleOrder = await contract.methods
            .orders(tokenAddress, tokenId)
            .call();
          console.log('saleOrder', saleOrder);
          return saleOrder;
        } catch (error) {
          console.error('ERR:', error);
        }
        return null;
      };
    }

    return null;
  };
};
