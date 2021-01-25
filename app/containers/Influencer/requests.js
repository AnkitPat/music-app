/**
 *
 * Influencer
 *
 */

import React, {memo, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import {compose} from 'redux';
import {useInjectSaga} from 'utils/injectSaga';
import {useInjectReducer} from 'utils/injectReducer';
import {getInfluencerRequests, updateInfluencerStatus} from './actions';
import {makeSelectLoader, makeSelectRequests} from './selectors';
import reducer from './reducer';
import saga from './saga';
import PaperCard from '../../components/PaperCard';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle, faBan} from "@fortawesome/free-solid-svg-icons";
import LoadingIndicator from "../../components/LoadingIndicator";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";

export function Requests(
  {
    getRequests,
    influencerRequests,
    loader,
    updateInfluencerStatusAction
  }) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [approvalOpen, setApprovalOpen] = useState(false);
  const [influencer, setInfluencer] = useState(null);

  useInjectReducer({key: 'influencer', reducer});
  useInjectSaga({key: 'influencer', saga});

  useEffect(() => {
    getRequests();
  }, []);

  const columns = [{
    dataField: 'name',
    text: 'Name'
  }, {
    dataField: 'description',
    text: 'Description'
  }, {
    dataField: 'influencerStatus.title',
    text: 'Status'
  }, {
    dataField: 'actions',
    text: 'Actions',
    isDummyField: true,
    csvExport: false,
    formatter: actionsFormatter,
  }];

  function actionsFormatter(cell, row, rowIndex, formatExtraData) {
    return (
      <div
        style={{
          textAlign: "center",
          cursor: "pointer",
          lineHeight: "normal"
        }}>
        <button className="btn btn-success mr-3" onClick={() => openApprovalModal(row)}>
          <FontAwesomeIcon icon={faCheckCircle}/>
        </button>
        <button className="btn btn-danger" onClick={() => openRejectModal(row)}>
          <FontAwesomeIcon icon={faBan}/>
        </button>
      </div>
    );
  }

  function openRejectModal(data) {
    setInfluencer(data);
    setRejectOpen(true);
  }

  function openApprovalModal(data) {
    setInfluencer(data);
    setApprovalOpen(true);
  }

  function handleRejectClose() {
    setRejectOpen(false);
  }

  function handleApprovalClose() {
    setApprovalOpen(false);
  }

  function rejectInfluencer() {
    updateInfluencerStatusAction({id: influencer.id, influencerStatusId: 1})
    setInfluencer(null);
    setRejectOpen(false);
  }

  function approveInfluencer() {
    updateInfluencerStatusAction({id: influencer.id, influencerStatusId: 2})
    setInfluencer(null);
    setApprovalOpen(false);
  }

  return (
    <PaperCard title="Tastemakers Requests">
      <div className="row">
        <div className="col">
          {loader || !influencerRequests ? <LoadingIndicator/> :
            <BootstrapTable
              striped
              bordered={false}
              bootstrap4
              pagination={paginationFactory()}
              keyField='id'
              data={influencerRequests}
              columns={columns}/>
          }
        </div>
      </div>
      <Modal
        show={rejectOpen}
        onHide={handleRejectClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Reject</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to reject the request?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleRejectClose}>
            No
          </Button>
          <Button variant="primary" onClick={rejectInfluencer}>Yes</Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={approvalOpen}
        onHide={handleApprovalClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Approve Influencer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {influencer &&
            <>
              <div className="bio">
                <h3>Name</h3>
                <p>{influencer.name}</p>
                <h3>Bio</h3>
                <p>{influencer.description}</p>
                <h3>How can you help artists</h3>
                <p>{influencer.helpArtistDescription}</p>
              </div>
              <div className="genres">
                <h3>Genres</h3>
                {influencer.influencerGenres.map(item =>
                  <Badge pill variant="warning" key={item.genre.id}>
                    {item.genre.title}
                  </Badge>
                )}
              </div>
              <div className="services">
                <h3>Services</h3>

              </div>
            </>
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleRejectClose}>
            No
          </Button>
          <Button variant="primary" onClick={approveInfluencer}>Yes</Button>
        </Modal.Footer>
      </Modal>
    </PaperCard>
  );
}

Requests.propTypes = {
  getRequests: PropTypes.func,
  influencerRequests: PropTypes.any,
  loader: PropTypes.bool,
  updateInfluencerStatusAction: PropTypes.func
};

const mapStateToProps = createStructuredSelector({
  influencerRequests: makeSelectRequests(),
  loader: makeSelectLoader()
});

function mapDispatchToProps(dispatch) {
  return {
    getRequests: () => dispatch(getInfluencerRequests()),
    updateInfluencerStatusAction: (data) => dispatch(updateInfluencerStatus(data))
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(Requests);