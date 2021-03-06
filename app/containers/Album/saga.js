// import { take, call, put, select } from 'redux-saga/effects';

// Individual exports for testing
import { call, put, takeLatest } from '@redux-saga/core/effects';
import { toast } from 'react-toastify';
import jwt_decode from 'jwt-decode';
import {
  CAST_VOTE,
  DELETE_ALBUM,
  FOLLOW_ALBUM,
  GET_ALBUM,
  GET_GENRES,
  GET_MY_ALBUMS_REQUEST,
  GET_SONGS_REQUEST,
  LOAD_ALBUM,
  POST_ALBUMS_REQUEST,
  UPDATE_ALBUM,
} from './constants';
import { axiosInstance } from '../../utils/api';
import { axiosTrackingInstance } from '../../utils/trackingApi';
import {
  deleteAlbumFail,
  deleteAlbumSuccess,
  getAlbumFail,
  getAlbumSuccess,
  getGenresFail,
  getGenresSuccess,
  getMyAlbumsRequest,
  getMyAlbumsRequestFail,
  getMyAlbumsRequestSuccess,
  loadAlbum,
  loadAlbumFail,
  loadAlbumSuccess,
  postAlbumRequestFail,
  postAlbumRequestSuccess,
  songRequestFail,
  songRequestSuccess,
  updateAlbumFail,
  updateAlbumSuccess, voteLoadingSuccess,
} from './actions';

import history from '../../utils/history';
import {getUserDetails} from '../App/actions';

function getAlbumInfo(albumSlug) {
  return axiosInstance().get(`/albums/songs/slug/${albumSlug}`);
}

function getAlbumInfoForLoggedIn(albumSlug) {
  return axiosInstance().get(`/albums/details/${albumSlug}`);
}

function fetchMyAlbums() {
  return axiosInstance().get('/albums/myAlbums');
}

function postAlbum(data) {
  return axiosInstance().request({
    method: 'post',
    url: '/albums',
    data,
  });
}

function editAlbum(data) {
  return axiosInstance().put('/albums', data);
}

function postAlbumImage(data) {
  const imageData = new FormData();
  imageData.append('photo', data.albumImage[0]);
  return axiosInstance().post('/albums/upload', imageData);
}

function getSongsApi() {
  return axiosInstance().get('/songs');
}

function getAlbum(id) {
  return axiosInstance().get(`/albums/${id}`);
}

function deleteAlbumApi(id) {
  return axiosInstance().delete(`/albums/${id}`);
}

function fetchGenres() {
  return axiosInstance().get('/songs/genres');
}

function followAlbumApi(data) {
  return axiosInstance().post('albums/action', data);
}

function postVoteApi(data) {
  return axiosInstance().post('songs/vote', {songId: data.id});
}

function getSongStreams(id) {
  return axiosTrackingInstance().get(`records/album/${id}`);
}

export function* fetchSongs() {
  try {
    const result = yield call(getSongsApi);
    yield put(songRequestSuccess(result.data));
  } catch (e) {
    toast.error(e.message);
    yield put(songRequestFail(e.message));
  }
}

export function* albumSaga(action) {
  try {
    const token = yield localStorage.getItem('token');
    if (token) {
      const decoded = jwt_decode(token);
      const result = yield call(
        decoded.exp < new Date().getTime() / 1000
          ? getAlbumInfo
          : getAlbumInfoForLoggedIn,
        action.slug,
      );
      const getStreamCount = yield call(getSongStreams, result.data.id);
      if (getStreamCount.data.length > 0) {
        getStreamCount.data.forEach(item => {
          let index = result.data.albumSongs.findIndex(song => song.songId === item._id);
          if (index !== -1) {
            result.data.albumSongs[index].streamCount = item.count
          }
        })
        yield put(loadAlbumSuccess(result.data));
      } else {
        yield put(loadAlbumSuccess(result.data));
      }
    } else {
      const result = yield call(getAlbumInfo, action.slug);
      const getStreamCount = yield call(getSongStreams, result.data.id);
      if (getStreamCount.data.length > 0) {
        getStreamCount.data.forEach(item => {
          let index = result.data.albumSongs.findIndex(song => song.songId === item._id);
          if (index !== -1) {
            result.data.albumSongs[index].streamCount = item.count
          }
        })
        yield put(loadAlbumSuccess(result.data));
      } else {
        yield put(loadAlbumSuccess(result.data));
      }
      yield put(loadAlbumSuccess(result.data));
    }
  } catch (e) {
    toast.error(e.message);
    yield put(loadAlbumFail(e.message));
  }
}

export function* myAlbumsSaga() {
  try {
    const result = yield call(fetchMyAlbums);
    yield put(getMyAlbumsRequestSuccess(result.data));
  } catch (e) {
    toast.error(e.message);
    yield put(getMyAlbumsRequestFail(e.message));
  }
}

export function* saveAlbumSaga({ data, callback }) {
  try {
    const result = yield call(postAlbumImage, data);
    const albumData = {
      ...data,
      artwork: result.data.location,
      imageKey: result.data.imageKey,
    };
    yield call(postAlbum, albumData);
    yield put(postAlbumRequestSuccess());
    toast.success('Album uploaded successfully.');
    if (callback) {
      yield put(getMyAlbumsRequest())
      callback();
    } else {
      history.push('/albumList');
    }
  } catch (e) {
    toast.error(e.message);
    yield put(postAlbumRequestFail(e.message));
  }
}

export function* getEditAlbum({ id }) {
  try {
    const result = yield call(getAlbum, id);
    yield put(getAlbumSuccess(result.data));
  } catch (e) {
    toast.error(e.message);
    yield put(getAlbumFail(e.message));
  }
}

export function* deleteAlbum({ id }) {
  try {
    const result = yield call(deleteAlbumApi, id);
    yield put(getMyAlbumsRequest());
    yield put(deleteAlbumSuccess(result.data));
    toast.success('Album deleted successfully.');
  } catch (e) {
    toast.error(e.message);
    yield put(deleteAlbumFail(e.message));
  }
}

export function* updateAlbum({ data }) {
  try {
    if (data.albumImage.length === 0) {
      const result = yield call(editAlbum, data);
      yield put(updateAlbumSuccess(result.data));
    } else {
      const response = yield call(postAlbumImage, data);
      const albumData = {
        ...data,
        artwork: response.data.location,
        imageKey: response.data.imageKey,
      };
      const result = yield call(editAlbum, albumData);
      yield put(updateAlbumSuccess(result.data));
    }

    history.push('/albumList');
    toast.success('Album updated successfully.');
  } catch (e) {
    toast.error(e.message);
    yield put(updateAlbumFail(e.message));
  }
}

export function* getGenresSaga() {
  try {
    const result = yield call(fetchGenres);
    yield put(getGenresSuccess(result.data));
  } catch (e) {
    toast.error(e.message);
    yield put(getGenresFail(e.message));
  }
}

export function* followAlbumSaga(action) {
  const { albumId, like, albumSlug } = action;
  try {
    yield call(followAlbumApi, { albumId, like });
    if (like) toast.success('Album added to your library');
    else toast.success('Album removed from your library');
    const token = yield localStorage.getItem('token');
    const result = yield call(
      token ? getAlbumInfoForLoggedIn : getAlbumInfo,
      albumSlug,
    );
    yield put(loadAlbumSuccess(result.data));
  } catch (e) {
    if (like) toast.error('Error in saving album');
    else toast.error('Error in unlike album');
  }
}

export function* postVote(action) {
  try {
    yield call(postVoteApi, {id: action.songId});
    yield put(voteLoadingSuccess());
    yield put(getUserDetails());
    yield put(loadAlbum(action.slug))
  } catch (e) {
    yield put(voteLoadingSuccess());
  }
}

export default function* watchAlbum() {
  yield takeLatest(LOAD_ALBUM, albumSaga);
  yield takeLatest(GET_MY_ALBUMS_REQUEST, myAlbumsSaga);
  yield takeLatest(POST_ALBUMS_REQUEST, saveAlbumSaga);
  yield takeLatest(GET_SONGS_REQUEST, fetchSongs);
  yield takeLatest(GET_ALBUM, getEditAlbum);
  yield takeLatest(DELETE_ALBUM, deleteAlbum);
  yield takeLatest(UPDATE_ALBUM, updateAlbum);
  yield takeLatest(GET_GENRES, getGenresSaga);
  yield takeLatest(FOLLOW_ALBUM, followAlbumSaga);
  yield takeLatest(CAST_VOTE, postVote);
}
