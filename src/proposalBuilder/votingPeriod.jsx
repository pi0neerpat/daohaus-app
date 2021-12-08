import React, { useMemo, useState } from 'react';
import { Box, Button, Flex, Progress } from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';
import { ParaSm } from '../components/typography';
import { decodeAction } from '../utils/minionUtils';
import { validate } from '../utils/validation';
import { useTX } from '../contexts/TXContext';
import { TX } from '../data/contractTX';
import {
  PropActionBox,
  StatusCircle,
  StatusDisplayBox,
  VotingSection,
} from './actionPrimitives';

export const VotingPeriod = ({ interactions, proposal }) => {
  const [isLoading, setLoading] = useState(false);
  const { submitTransaction } = useTX();
  const gracePeriodTime = useMemo(() => {
    if (validate.number(Number(proposal?.votingPeriodStarts))) {
      return formatDistanceToNow(
        new Date(Number(proposal?.votingPeriodEnds) * 1000),
        {
          addSuffix: true,
        },
      );
    }
  }, [proposal]);

  const voteYes = async () => {
    setLoading(true);
    await submitTransaction({
      args: [proposal.proposalIndex, 1],
      tx: TX.SUBMIT_VOTE,
    });
    setLoading(false);
  };

  const voteNo = async () => {
    setLoading(true);
    await submitTransaction({
      args: [proposal.proposalIndex, 2],
      tx: TX.SUBMIT_VOTE,
    });
    setLoading(false);
  };

  return (
    <PropActionBox>
      <StatusDisplayBox>
        <StatusCircle color='green' />
        <ParaSm fontWeight='700' mr='1'>
          Voting
        </ParaSm>
        <ParaSm>ends in {gracePeriodTime}</ParaSm>
      </StatusDisplayBox>
      <Progress value={80} mb='3' colorScheme='secondary.500' />
      <VotingSection voteYes={voteYes} voteNo={voteNo} loadingAll={isLoading} />
    </PropActionBox>
  );
};
