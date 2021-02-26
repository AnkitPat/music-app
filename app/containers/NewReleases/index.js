import React, { memo } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { getNewReleases } from '../HomePage/actions';
import PropTypes from 'prop-types';
import { useInjectReducer } from '../../utils/injectReducer';
import reducer from '../HomePage/reducer';
import { useInjectSaga } from '../../utils/injectSaga';
import homePageData from '../HomePage/saga';
import { makeSelectNewReleaseLoading, makeSelectNewReleases } from '../HomePage/selectors';
import CarouselFront from '../../components/CarouselFront';
import { FormattedMessage } from 'react-intl';
import messages from '../HomePage/messages';
import { HOVER_PLAY_ICON_COLOR } from '../../utils/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import './index.scss';
import PaperCard from '../../components/PaperCard';
import LoadingIndicator from '../../components/LoadingIndicator';
import { redirectOnAlbum } from '../../utils/redirect';

const NewReleases = ({ getNewReleasesAction, newReleases, newReleasesLoading }) => {

    useInjectReducer({ key: 'home', reducer });
    useInjectSaga({ key: 'home', saga: homePageData })
    React.useEffect(() => {
        getNewReleasesAction();
    }, []);

    const renderReleaseItem = (item, index) => {
        return (
            <div className="releaseItemContainer" key={index}>
                <div
                    className="img-preview carousel-image-container rounded cursor-pointer"
                    onClick={e => {
                        e.preventDefault();
                        redirectOnAlbum(item.slug);
                    }}
                >
                    <img src={item.artwork} alt="" className="rounded carousel-image" />
                    <div className="hover-box">
                        <FontAwesomeIcon
                            icon={faPlayCircle}
                            className="test"
                            size="3x"
                            color={HOVER_PLAY_ICON_COLOR}
                        />
                    </div>
                </div>
                <div className="pt-4">
                    <h4>{item.title}</h4>
                    {item.description.length > 45 ? <OverlayTrigger
                        placement="top"
                        delay={{ show: 250, hide: 400 }}
                        overlay={<Tooltip id={`song-title-tooltip`}>{item.description}</Tooltip>}
                    ><h6>{item.description.substring(0, 45)}...</h6></OverlayTrigger> :
                        <h6>{item.description}</h6>
                    }
                </div>
            </div>
        )
    }
    return (
        <>
            {newReleasesLoading ? <LoadingIndicator/> : <PaperCard title="New Releases">
                <div className="releaseList">
                    {newReleases.map((release, index) => renderReleaseItem(release, index))}
                </div>
            </PaperCard>}
        </>
    )
}

NewReleases.prototype = {
    getNewReleasesAction: PropTypes.func,
    newReleases: PropTypes.array,
    newReleasesLoading: PropTypes.bool

}

const mapStateToProps = createStructuredSelector({
    newReleases: makeSelectNewReleases(),
    newReleasesLoading: makeSelectNewReleaseLoading(),

})

const mapDispatchToProps = (dispatch) => {
    return {
        getNewReleasesAction: () => dispatch(getNewReleases()),
    }
}

const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps
)

export default compose(withConnect, memo)(NewReleases);