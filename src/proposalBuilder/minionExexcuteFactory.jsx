import React from 'react';

import ExecuteAction from './executeAction';
import ExecuteRarible from './executeRarible';
import ExecuteSafeMinion from './executeSafeMinion';
import UberStakingAction from './uberStakingAction';
import { TX } from '../data/txLegos/contractTX';
import { CUSTOM_CARD_DATA } from '../data/proposalData';
import ExecuteMinionBuyout from './executeMinionBuyout';
import MinionTributeAction from './minionTributeAction';
import { MINION_TYPES } from '../utils/proposalUtils';

const MinionExexcuteFactory = props => {
  const { proposal } = props;

  const {
    proposalType,
    minion: { minionType },
  } = proposal;
  const executeType = CUSTOM_CARD_DATA[proposalType]?.execute;

  if (executeType === 'executeAction') {
    return <ExecuteAction {...props} />;
  }
  if (executeType === 'UH_delegate') {
    return (
      <ExecuteAction
        {...props}
        executeTX={TX.UBERHAUS_MINION_EXECUTE_APPOINTMENT}
      />
    );
  }
  if (executeType === 'UH_staking') {
    return <UberStakingAction {...props} />;
  }
  if (executeType === 'raribleAction') {
    return <ExecuteRarible {...props} />;
  }
  if (executeType === 'safeMinionAction') {
    return <ExecuteSafeMinion {...props} />;
  }
  if (executeType === 'minionBuyoutAction') {
    return <ExecuteMinionBuyout {...props} />;
  }
  if (executeType === 'minionTributeAction') {
    return <MinionTributeAction {...props} />;
  }
  if (minionType === MINION_TYPES.SAFE) {
    return <ExecuteSafeMinion {...props} />;
  }
  return <ExecuteAction {...props} />;
};

export default MinionExexcuteFactory;
