import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormLabel,
  Image,
  Input,
  Tooltip,
  Link,
  Text,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { useParams } from 'react-router-dom';
import { useDao } from '../contexts/DaoContext';
import { useOverlay } from '../contexts/OverlayContext';
import TextBox from './TextBox';
import GenericModal from '../modals/genericModal';
import { hasMinion } from '../utils/dao';
import { getNftMeta } from '../utils/metadata';
import { NIFTYINK_ADDRESS } from '../services/niftyService';
import { MINION_TYPES } from '../utils/proposalUtils';
import { supportedChains } from '../utils/chain';

const MinionNftTile = ({
  meta,
  tokenId,
  token,
  sendErc721Action,
  sellNiftyAction,
  getNftOrder,
  sellNftOnDHAction,
}) => {
  const { daoOverview } = useDao();
  const { setGenericModal } = useOverlay();
  const { handleSubmit, register } = useForm();
  const { daochain } = useParams();

  const [tokenDetail, setTokenDetail] = useState();
  console.log(token);
  useEffect(() => {
    const fetchNFTData = async () => {
      console.log('meta', meta);
      if (!meta) {
        meta = '';
      }
      if (meta.indexOf('ipfs://ipfs/') === 0) {
        meta = meta.replace('ipfs://ipfs/', 'https://ipfs.io/ipfs/');
      }

      if (meta.indexOf('https://') !== 0) {
        meta = '';
      }
      try {
        const jsonMeta = await getNftMeta(meta);
        if (jsonMeta?.image.indexOf('ipfs://ipfs/') === 0) {
          jsonMeta.image = jsonMeta.image.replace(
            'ipfs://ipfs/',
            'https://ipfs.io/ipfs/',
          );
        }
        if (jsonMeta?.image.indexOf('https://') !== 0) {
          jsonMeta.image = '';
        }
        setTokenDetail(jsonMeta);
      } catch (err) {
        console.log('error with meta URI', err);
      }
    };
    fetchNFTData();
  }, []);

  const handleSend = async () => {
    console.log('tokenDetail', tokenDetail);
    const key = `send-${tokenId}`;
    setGenericModal({ [key]: true });
  };
  const handleSell = async () => {
    console.log('tokenDetail', tokenDetail);
    const key = `sell-${tokenId}`;
    setGenericModal({ [key]: true });
  };
  const handleDHSell = async () => {
    console.log('tokenDetail', tokenDetail);
    const key = `dhSell-${tokenId}`;
    setGenericModal({ [key]: true });
  };
  const handleBuy = async () => {
    console.log('tokenDetail', tokenDetail);
    const key = `buy-${tokenId}`;
    setGenericModal({ [key]: true });
  };
  const handleDetail = async () => {
    console.log('tokenDetail??', token);
    const key = `detail-${tokenId}`;
    const orderDetail = await getNftOrder(token, tokenId);
    console.log('orderDetail', orderDetail);
    setGenericModal({ [key]: true });
  };

  const sendToken = values => {
    sendErc721Action(values, token, tokenId);
  };

  const sellToken = values => {
    sellNiftyAction(values, token, tokenId);
  };

  const sellTokenOnDh = values => {
    sellNftOnDHAction(values, token, tokenId);
  };

  return (
    <Box m={6} d={['none', null, null, 'inline-block']} bg='white'>
      {tokenDetail?.image || tokenDetail?.properties?.image ? (
        <Tooltip
          hasArrow
          shouldWrapChildren
          placement='left'
          label={`${tokenDetail.name} id: ${tokenId}`}
          bg='secondary.500'
        >
          <Link href={tokenDetail?.external_url} isExternal>
            <Image src={tokenDetail?.image} h='230px' w='230px' />
          </Link>
        </Tooltip>
      ) : (
        'NFT'
      )}

      <Flex>
        <Button onClick={handleDetail}>Detail</Button>
      </Flex>

      <GenericModal closeOnOverlayClick modalId={`detail-${tokenId}`}>
        <Text mb={3} fontFamily='heading'>
          NFT Detail
        </Text>
        <Image src={tokenDetail?.image} backgroundColor='white' />
        {hasMinion(daoOverview.minions, MINION_TYPES.NIFTY) &&
          token.contractAddress === NIFTYINK_ADDRESS && (
            <Button onClick={handleSell}>Sell on Nifty Ink</Button>
          )}
        {hasMinion(daoOverview.minions, MINION_TYPES.NIFTY) &&
          supportedChains[daochain].daohaus_nft_whitelist.indexOf(
            token.contractAddress,
          ) > -1 && <Button onClick={handleDHSell}>Sell on Daohaus</Button>}
        {hasMinion(daoOverview.minions, MINION_TYPES.NIFTY) &&
          token.contractAddress ===
            supportedChains[daochain].daohaus_nft_market && (
            <Button onClick={handleBuy}>Buy nft</Button>
          )}
        <Button onClick={handleSend}>Send</Button>
      </GenericModal>

      <GenericModal closeOnOverlayClick modalId={`send-${tokenId}`}>
        <Text mb={3} fontFamily='heading'>
          Send NiftyInk
        </Text>
        <form onSubmit={handleSubmit(sendToken)}>
          {tokenDetail && (
            <Image src={tokenDetail?.image} backgroundColor='white' />
          )}
          <TextBox as={FormLabel} size='xs' htmlFor='destination'>
            Destination
          </TextBox>
          <Input
            name='destination'
            mb={5}
            ref={register({
              required: {
                value: true,
                message: 'destination is required',
              },
            })}
            focusBorderColor='secondary.500'
          />
          <TextBox as={FormLabel} size='xs' htmlFor='tokenId'>
            Token ID
          </TextBox>
          <Input
            name='tokenId'
            mb={5}
            ref={register({
              required: {
                value: true,
                message: 'Id is required',
              },
            })}
            focusBorderColor='secondary.500'
            value={tokenId}
            disabled={tokenId}
          />
          <Button type='submit'>Propose Transfer</Button>
        </form>
      </GenericModal>

      <GenericModal closeOnOverlayClick modalId={`dhSell-${tokenId}`}>
        <Text mb={3} fontFamily='heading'>
          Sell on Daohaus NFT Market
        </Text>
        <form onSubmit={handleSubmit(sellTokenOnDh)}>
          {tokenDetail && (
            <Image src={tokenDetail?.image} backgroundColor='white' />
          )}
          <TextBox as={FormLabel} size='xs' htmlFor='title'>
            Title
          </TextBox>
          <Input
            name='title'
            mb={5}
            ref={register({
              required: {
                value: true,
                message: 'Id is required',
              },
            })}
            focusBorderColor='secondary.500'
          />
          <TextBox as={FormLabel} size='xs' htmlFor='details'>
            Details
          </TextBox>
          <Input
            name='details'
            mb={5}
            ref={register({
              required: {
                value: true,
                message: 'Id is required',
              },
            })}
            focusBorderColor='secondary.500'
          />
          <TextBox as={FormLabel} size='xs' htmlFor='targetInk'>
            Price
          </TextBox>
          <Input
            name='price'
            mb={5}
            ref={register({
              required: {
                value: true,
                message: 'Price is required',
              },
            })}
            focusBorderColor='secondary.500'
          />
          <TextBox as={FormLabel} size='xs' htmlFor='tokenId'>
            Token
          </TextBox>
          <Input
            name='token'
            mb={5}
            ref={register({
              required: {
                value: true,
                message: 'Id is required',
              },
            })}
            focusBorderColor='secondary.500'
            defaultValue='0xb0C5f3100A4d9d9532a4CfD68c55F1AE8da987Eb'
          />
          <TextBox as={FormLabel} size='xs' htmlFor='altRec'>
            Alternate payment Reciever
          </TextBox>
          <Input
            name='altRec'
            mb={5}
            ref={register({
              required: {
                value: true,
                message: 'Id is required',
              },
            })}
            focusBorderColor='secondary.500'
          />
          <TextBox>10% fee to Uberhaus</TextBox>
          <Button type='submit'>Create Sell Order</Button>
        </form>
      </GenericModal>

      <GenericModal closeOnOverlayClick modalId={`sell-${tokenId}`}>
        <Text mb={3} fontFamily='heading'>
          Sell NiftyInk
        </Text>
        <form onSubmit={handleSubmit(sellToken)}>
          {tokenDetail && (
            <Image src={tokenDetail?.image} backgroundColor='white' />
          )}
          <TextBox as={FormLabel} size='xs' htmlFor='targetInk'>
            Price
          </TextBox>
          <Input
            name='price'
            mb={5}
            ref={register({
              required: {
                value: true,
                message: 'Price is required',
              },
            })}
            focusBorderColor='secondary.500'
          />
          <TextBox as={FormLabel} size='xs' htmlFor='tokenId'>
            Token ID
          </TextBox>
          <Input
            name='tokenId'
            mb={5}
            ref={register({
              required: {
                value: true,
                message: 'Id is required',
              },
            })}
            focusBorderColor='secondary.500'
            value={tokenId}
            disabled={tokenId}
          />
          <Button type='submit'>Propose Sell</Button>
        </form>
      </GenericModal>
    </Box>
  );
};

export default MinionNftTile;
