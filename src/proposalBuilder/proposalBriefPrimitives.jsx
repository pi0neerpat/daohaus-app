import React, { useMemo } from 'react';
import { Flex, Box, Skeleton } from '@chakra-ui/react';
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiErrorWarningLine,
} from 'react-icons/ri';

import { Bold, ParaMd } from '../components/typography';

import {
  generateOfferText,
  generateRequestText,
} from '../utils/proposalCardUtils';

export const PropCardTransfer = ({
  incoming,
  outgoing,
  itemText,
  customUI,
  action,
  specialLocation,
  error,
}) => {
  return (
    <Flex alignItems='center' mb='4'>
      {incoming && (
        <Box transform='translateY(1px)' mr='1'>
          <RiArrowRightLine size='1.1rem' />
        </Box>
      )}
      {outgoing && (
        <Box transform='translateY(1px)' mr='1'>
          <RiArrowLeftLine size='1.1rem' />
        </Box>
      )}
      {error && (
        <Box mr='1'>
          <RiErrorWarningLine size='1.1rem' />
        </Box>
      )}
      {customUI}
      {itemText && (
        <>
          {specialLocation ? (
            <ParaMd>
              {action}
              <Bold> {itemText} </Bold> to <Bold> {specialLocation}</Bold>
            </ParaMd>
          ) : (
            <ParaMd>
              {action}
              <Bold> {itemText} </Bold>
            </ParaMd>
          )}
        </>
      )}
    </Flex>
  );
};
export const PropCardRequest = ({ proposal }) => {
  const requestText = useMemo(() => {
    if (proposal) {
      return generateRequestText(proposal);
    }
  }, [proposal]);
  return (
    <PropCardTransfer outgoing action='Requesting' itemText={requestText} />
  );
};

export const PropCardOffer = ({ proposal }) => {
  const requestText = useMemo(() => {
    if (proposal) {
      return generateOfferText(proposal);
    }
  }, [proposal]);
  return <PropCardTransfer incoming action='Offering' itemText={requestText} />;
};
export const PropCardError = ({ message }) => {
  return (
    <PropCardTransfer
      error
      customUI={
        <ParaMd>{message || 'Error: could not load proposal data'}</ParaMd>
      }
    />
  );
};

export const AsyncCardTransfer = props => {
  const { isLoaded } = props;
  return (
    <Skeleton isLoaded={isLoaded} height='1.5rem'>
      <PropCardTransfer {...props} />
    </Skeleton>
  );
};
