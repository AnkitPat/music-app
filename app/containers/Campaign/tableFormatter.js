import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Image } from 'react-bootstrap';
import { CampaignStatus } from '../Requests/constants';
export const columns = [
  {
    dataField: '',
    text: '#',
    formatter: pictureFormatter,
    style: {
      width: '10%',
    },
    headerStyle: {
      textAlign: 'left',
    },
  },
  {
    dataField: 'influencer.name',
    text: 'Influencer name',
  },
  {
    dataField: 'influencer.description',
    text: 'Description',
  },
  {
    dataField: 'amount',
    text: 'Amount',
  },
  {
    dataField: 'createdDate',
    text: 'Status',
    formatter: statusFormatter,
  },
];
export function pictureFormatter(cell, row) {
  if (row.influencer && row.influencer.user && row.influencer.user.avatar) {
    return (
      <span>
        <Image
          src={row.influencer.user.avatar}
          style={{ width: 40, height: 40, borderRadius: 20 }}
        />
      </span>
    );
  }

  return <span>{cell}</span>;
}

function statusFormatter(cell, row) {
  if (row.campaignStatusId === 1) {
    return (
      <span>
        <div style={{ color: 'lightyellow' }}>
          <FontAwesomeIcon icon={faCircle} /> Not accepted
        </div>
      </span>
    );
  }

  if (
    row.campaignStatusId === CampaignStatus['IN-PROGRESS'] ||
    row.campaignStatusId === CampaignStatus.ACCEPTED
  ) {
    return (
      <span>
        <div style={{ color: 'lightyellow' }}>
          <FontAwesomeIcon icon={faCircle} /> In Progress
        </div>
      </span>
    );
  }

  if (row.campaignStatusId === CampaignStatus.COMPLETED) {
    return (
      <span>
        <div style={{ color: 'lightyellow' }}>
          <FontAwesomeIcon icon={faCircle} />
          Not Approved
        </div>
      </span>
    );
  }

  if (row.campaignStatusId === CampaignStatus.APPROVED) {
    return (
      <span>
        <div style={{ color: 'lightyellow' }}>
          <FontAwesomeIcon icon={faCircle} />
          Approved
        </div>
      </span>
    );
  }

  if (row.campaignStatusId === CampaignStatus.DECLINED) {
    return (
      <span>
        <div style={{ color: 'lightyellow' }}>
          <FontAwesomeIcon icon={faCircle} />
          Declined
        </div>
      </span>
    );
  }

  return <span>{cell}</span>;
}
