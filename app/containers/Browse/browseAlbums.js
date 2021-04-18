import React, {useEffect} from 'react';
import {createStructuredSelector} from 'reselect';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {useLocation} from 'react-router';
import {fetchAlbumsAction} from './actions';
import PropTypes from 'prop-types';
import {useInjectReducer} from '../../utils/injectReducer';
import browseReducer from './reducer';
import {useInjectSaga} from '../../utils/injectSaga';
import browseSaga from './saga';
import {makeSelectAlbums, makeSelectBrowseDataLoading} from './selectors';
import './index.scss';
import {Card} from 'react-bootstrap';
import defaultImage from '../../images/album-1.jpg'
import LoadingIndicator from '../../components/LoadingIndicator';
import 'react-virtualized/styles.css';
import PaperCard from "../../components/PaperCard";
import {Link} from "react-router-dom";

const BrowseAlbums = ({fetchAlbums, albums, loading}) => {
  useInjectReducer({key: 'browse', reducer: browseReducer})
  useInjectSaga({key: 'browse', saga: browseSaga})
  const location = useLocation();
  const [item, setItem] = React.useState(null);

  useEffect(() => {
    if (location.state.data) {
      setItem(location.state.data)
      fetchAlbums(location.state.data.browseType, 0, 10, location.state.data.id)
    }
  }, []);

  return (
    <>
      {(item && !loading) ? <PaperCard title={item.title}>
        <div className="browse_container">
          {albums && albums.map(album => {
            const albumObj = item.browseType === 'genre' ? album.album : album
            return <Link to={`/album/${albumObj.slug}`}>
              <Card key={albumObj.title} className="browse_card">
                <Card.Img variant="top" src={albumObj.artwork || ''} style={{width: '14rem', height: '8rem'}}
                          onError={e => {
                            e.target.onerror = null;
                            e.target.src = defaultImage;
                          }}/>
                <Card.ImgOverlay>
                  <div className="card_title">{albumObj.title}</div>
                </Card.ImgOverlay>
              </Card>
            </Link>
          })}
        </div>

      </PaperCard> : <LoadingIndicator/>}
    </>
  )
}


BrowseAlbums.propTypes = {
  fetchAlbums: PropTypes.func,
  albums: PropTypes.array,
  loading: PropTypes.bool

}
const mapStateToProps = createStructuredSelector({
  albums: makeSelectAlbums(),
  loading: makeSelectBrowseDataLoading()
});

function mapDispatchToProps(dispatch) {
  return {
    fetchAlbums: (type, page, limit, id) => dispatch(fetchAlbumsAction(type, page, limit, id))
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(
  withConnect
)(BrowseAlbums);