import React, {memo, useEffect} from 'react';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router-dom';
import {compose} from 'redux';
import {createStructuredSelector} from 'reselect';
import moment from 'moment';
import PropTypes from 'prop-types';
import PaperCard from '../../components/PaperCard';
import {Image, Row, Col} from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import {toast} from 'react-toastify';
import {useInjectReducer} from '../../utils/injectReducer';
import {useInjectSaga} from '../../utils/injectSaga';
import {makeSelectCampaign} from './selectors';
import reducer from './reducer';
import saga from './saga';
import {fetchCampaignAction, getSelectedCampaignAction} from './actions';
import defaultImage from '../../images/default-image.png';
import {columns} from './tableFormatter';
import history from '../../utils/history';
import {CampaignStatus} from '../Requests/constants';

const Details = (
  {
    match,
    selectedCampaign,
    getSelectedCampaign,
    fetchCampaigns,
  }) => {
  useInjectReducer({key: 'campaign', reducer});
  useInjectSaga({key: 'campaign', saga});
  useEffect(() => {
    if (match.params.id) {
      getSelectedCampaign(match.params.id);
    }
  }, [match.params.id]);

  useEffect(() => {
    fetchCampaigns();
    getSelectedCampaign(match.params.id);
  }, []);

  return (
    <>
      <PaperCard title="Campaign Details">
        <small className="d-flex align-items-center">
          <Link className="mr-1 text-warning" to="/campaigns">Campaigns</Link> {'>'} <Link className="ml-1" style={{
          pointerEvents: 'none',
          opacity: 0.6,
          color: '#fff'
        }} to={''}>Campaigns Details</Link>
        </small>
        <Row className="mt-5">
          <Col md={12}>
            {selectedCampaign && selectedCampaign.song && (
              <div className="d-flex mb-4 align-items-center">
                <Image
                  width={100}
                  height={100}
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = defaultImage;
                  }}
                  src={(selectedCampaign.song.albumSongs.length >0 && selectedCampaign.song.albumSongs[0].album.artwork) || ''}
                  alt=""
                  roundedCircle
                />
                <div className="ml-3">
                  {selectedCampaign.song.title}
                  <small className="text-muted d-block">
                    Created on: {moment(selectedCampaign.createdDate).format(
                      'DD MMMM YYYY',
                    )}
                  </small>
                </div>
              </div>
            )}
          </Col>
          <Col className="table-cursor">
            <BootstrapTable
              striped
              hover
              bordered={false}
              bootstrap4
              pagination={paginationFactory()}
              keyField="id"
              data={
                (selectedCampaign && selectedCampaign.campaignInfluencers) || []
              }
              rowEvents={{
                onClick: (e, row) => {
                  if (
                    row.campaignStatusId === CampaignStatus.COMPLETED ||
                    row.campaignStatusId === CampaignStatus.DECLINED ||
                    row.campaignStatusId === CampaignStatus.APPROVED
                  ) {
                    history.push(
                      `/campaigns/${selectedCampaign.id}/influencer/${row.id}`,
                    );
                  } else if(row.campaignStatusId === CampaignStatus.DISPUTE) {
                    toast.error('Bliiink team will contact you.');
                  } else {
                    toast.warning('Influencer not completed requested.');
                  }
                },
              }}
              columns={columns}
            />
          </Col>
        </Row>
      </PaperCard>
    </>
  );
};

Details.propTypes = {
  match: PropTypes.any,
  selectedCampaign: PropTypes.any,
  getSelectedCampaign: PropTypes.func,
  fetchCampaigns: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  selectedCampaign: makeSelectCampaign(),
});

function mapDispatchToProps(dispatch) {
  return {
    fetchCampaigns: () => dispatch(fetchCampaignAction()),
    getSelectedCampaign: id => dispatch(getSelectedCampaignAction(id)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
  withRouter,
)(Details);
