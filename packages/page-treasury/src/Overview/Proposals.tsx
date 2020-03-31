// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveTreasuryProposal } from '@polkadot/api-derive/types';
import { AccountId, Balance } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Table } from '@polkadot/react-components';
import { useApi, useAccounts, useCall } from '@polkadot/react-hooks';

import Proposal from './Proposal';
import { useTranslation } from '../translate';

interface Props {
  className?: string;
  isApprovals?: boolean;
  proposals?: DeriveTreasuryProposal[];
}

function ProposalsBase ({ className, isApprovals, proposals }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const members = useCall<[AccountId, Balance][]>((api.query.electionsPhragmen || api.query.elections).members, []);
  const [isMember, setIsMember] = useState(false);
  const history = useHistory();

  useEffect((): void => {
    allAccounts && members && setIsMember(
      members
        .map(([accountId]): string => accountId.toString())
        .some((accountId): boolean => allAccounts.includes(accountId))
    );
  }, [allAccounts, members]);

  const _onRespond = (): void => {
    history.push('/council/motions');
  };

  return (
    <Table className={className}>
      <Table.Head>
        <th className='start' colSpan={2}><h1>{isApprovals ? t('Approved') : t('Proposals')}</h1></th>
        <th className='address'>{t('beneficiary')}</th>
        <th>{t('payment')}</th>
        <th>{t('bond')}</th>
        <th colSpan={2}>&nbsp;</th>
      </Table.Head>
      <Table.Body empty={proposals && (isApprovals ? t('No approved proposals') : t('No pending proposals'))}>
        {proposals?.map((proposal): React.ReactNode => (
          <Proposal
            isMember={isMember}
            onRespond={_onRespond}
            proposal={proposal}
            key={proposal.id.toString()}
            withSend={!isApprovals}
          />
        ))}
      </Table.Body>
    </Table>
  );
}

export default React.memo(ProposalsBase);