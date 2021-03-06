import PropTypes from 'prop-types';
import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {createStructuredSelector} from 'reselect';
import format from 'date-fns/format';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import PaperCard from '../../components/PaperCard';
import {useInjectReducer} from '../../utils/injectReducer';
import {useInjectSaga} from '../../utils/injectSaga';
import {fetchPaymentHistoryAction, getEarningsAction, getWithdrawalRequestsAction} from './actions';
import reducer from './reducer';
import saga from './saga';
import {makeSelectEarnings, makeSelectPaymentHistory, makeSelectWithdrawalRequests} from './selectors';
import {Button} from 'react-bootstrap';
import history from '../../utils/history';
import {makeSelectInfluencerDetails, makeSelectUserDetails} from "../App/selectors";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import WithdrawalRequests from "../../components/WithdrawalRequests/Loadable";
import TastemakerEarnings from "../../components/TastemakerEarnings/Loadable";
import PlanSvg from "../../images/svg/plan_icon_color.svg";

const WalletHistory = (
  {
    paymentHistory,
    fetchPaymentHistory,
    influencerProfile,
    getWithdrawalRequests,
    withdrawalRequests,
    getEarnings,
    earnings,
    userDetails
  }) => {
  useInjectReducer({key: 'wallet', reducer});
  useInjectSaga({key: 'wallet', saga});

  useEffect(() => {
    fetchPaymentHistory();
    getWithdrawalRequests();

  }, []);

  useEffect(() => {
    if (Object.keys(influencerProfile).length !== 0) {
      getWithdrawalRequests();
      getEarnings();
    }
  }, [influencerProfile]);

  // eslint-disable-next-line no-unused-vars
  function dateFormatter(cell, row, rowIndex, formatExtraData) {
    return format(new Date(row.updatedAt), 'do MMM yyyy');
  }

  const columns = [
    {
      dataField: 'credits',
      text: 'Credits',
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return <span><img src={PlanSvg} alt="wallet Logo" width={17} height={17}/> {row.credits}</span>
      },
      style: {
        width: '20%'
      },
      headerStyle: {
        width: '20%'
      }
    },
    {
      dataField: 'amount',
      text: 'Amount',
      formatter: (cell, row, rowIndex, formatExtraData) => {
        return <span>${row.amount}</span>
      },
      style: {
        width: '20%'
      },
      headerStyle: {
        width: '20%'
      }
    },
    {
      dataField: 'orderStatus.title',
      text: 'Status',
      style: {
        width: '30%',
        textAlign: 'center'

      },
      headerStyle: {
        width: '30%',
        textAlign: 'center'

      }
    },
    {
      dataField: 'updatedAt',
      text: 'Purchased Date',
      formatter: dateFormatter,
      style: {
        width: '30%',
        textAlign: 'center'

      },
      headerStyle: {
        width: '30%',
        textAlign: 'center'

      }
    },
  ];

  return (
    <PaperCard title="Credit Purchase History">
        <>
          <Button variant="success" onClick={() => history.push('/wallet/withdrawal')}>Withdrawal Request</Button>
          <div className="mt-4">
            <Tabs defaultActiveKey="history" id="uncontrolled-tab-example">
              <Tab eventKey="history" title="Purchase History">
                <BootstrapTable
                  striped
                  bordered={false}
                  bootstrap4
                  pagination={paginationFactory()}
                  keyField="id"
                  data={paymentHistory}
                  columns={columns}
                />
              </Tab>
              {userDetails.roleId !== 2 &&
              <Tab eventKey="earnings" title="Earnings">
                <TastemakerEarnings earnings={earnings}/>
              </Tab>
              }
              <Tab eventKey="withdrawal" title="Withdrawal Requests">
                <WithdrawalRequests withdrawalRequests={withdrawalRequests}/>
              </Tab>
            </Tabs>
          </div>
        </>
    </PaperCard>
  );
}

WalletHistory.propTypes = {
  paymentHistory: PropTypes.any,
  fetchPaymentHistory: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  paymentHistory: makeSelectPaymentHistory(),
  influencerProfile: makeSelectInfluencerDetails(),
  withdrawalRequests: makeSelectWithdrawalRequests(),
  earnings: makeSelectEarnings(),
  userDetails: makeSelectUserDetails()
});

function mapDispatchToProps(dispatch) {
  return {
    fetchPaymentHistory: () => dispatch(fetchPaymentHistoryAction()),
    getWithdrawalRequests: () => dispatch(getWithdrawalRequestsAction()),
    getEarnings: () => dispatch(getEarningsAction())
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(WalletHistory);
