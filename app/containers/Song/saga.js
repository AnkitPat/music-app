import {call, put, takeLatest} from 'redux-saga/effects';
import api from '../../utils/api';
import {
  deleteSongFail,
  deleteSongSuccess, getGenresFail, getGenresSuccess,
  getSongRequestFail,
  getSongRequestSuccess,
  postSongRequestFail,
  postSongRequestSuccess,
  songRequest,
  songRequestFail,
  songRequestSuccess,
  updateSongRequestFail,
  updateSongRequestSuccess,
  uploadSongFailure,
  uploadSongSuccess,
} from './actions';
import {
  DELETE_SONG, GET_GENRES,
  GET_SONG_REQUEST,
  GET_SONGS_REQUEST,
  POST_SONG_REQUEST, UPDATE_SONG_REQUEST,
  UPLOAD_SONG_REQUEST,
} from './constants';
import history from '../../utils/history';
import {toast} from "react-toastify";

function getSongsApi() {
  return api.get('/songs');
}

function getSongApi(id) {
  return api.get(`/songs/${id}`);
}

function deleteSongApi(id) {
  return api.delete(`/songs/${id}`);
}

function postSong(data) {
  return api.request({
    method: 'post',
    url: '/songs',
    data,
  });
}

function fetchGenres() {
  return api.get('/songs/genres');
}

function editSong(data) {
  return api.put('/songs', data);
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

export function* getSong({id}) {
  try {
    const result = yield call(getSongApi, id);
    yield put(getSongRequestSuccess(result.data));
  } catch (e) {
    toast.error(e.message);
    yield put(getSongRequestFail(e.message));
  }
}

function postSongApi(action) {
  const formData = new FormData();
  formData.append('file', action.audio[0]);
  return api.post(`/songs/upload/audio/`, formData);
}

export function* uploadSong(action) {
  try {
    const result = yield call(postSongApi, action);
    yield put(uploadSongSuccess(result));
    history.push('/song-list');
    toast.success('Song uploaded successfully.');
  } catch (err) {
    toast.error(err);
    yield put(uploadSongFailure(err));
  }
}

export function* deleteSong({id}) {
  try {
    const result = yield call(deleteSongApi, id);
    yield put(songRequest());
    yield put(deleteSongSuccess(result));
    toast.success('Song deleted successfully.');
  } catch (err) {
    toast.error(err);
    yield put(deleteSongFail(err));
  }
}

export function* saveSongSaga({data}) {
  try {
    const result = yield call(postSongApi, data);
    const songData = {
      ...data,
      songKey: result.data.songKey,
      url: result.data.location
    }
    yield call(postSong, songData);
    yield put(postSongRequestSuccess());
    history.push('/songList');
    toast.success('Song saved successfully.');
  } catch (e) {
    toast.error(e.message);
    yield put(postSongRequestFail(e.message));
  }
}

export function* updateSongSaga({data}) {
  try {
    let songData = {
      id: data.id,
      title: data.title,
      description: data.description,
      genreId: data.genreId,
      releaseDate: data.releaseDate
    }
    if (data.audio.length !== 0) {
      const result = yield call(postSongApi, data);
      songData.songKey = result.data.songKey;
      songData.url = result.data.location;
    }

    yield call(editSong, songData);
    yield put(updateSongRequestSuccess());
    history.push('/songList');
    toast.success('Song updated successfully.');
  } catch (e) {
    toast.error(e.message);
    yield put(updateSongRequestFail(e.message));
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

export default function* watchSong() {
  yield takeLatest(GET_SONGS_REQUEST, fetchSongs);
  yield takeLatest(UPLOAD_SONG_REQUEST, uploadSong);
  yield takeLatest(DELETE_SONG, deleteSong);
  yield takeLatest(GET_SONG_REQUEST, getSong);
  yield takeLatest(POST_SONG_REQUEST, saveSongSaga);
  yield takeLatest(UPDATE_SONG_REQUEST, updateSongSaga);
  yield takeLatest(GET_GENRES, getGenresSaga);
}
