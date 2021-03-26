import {toast} from "react-toastify";
import {call, put, takeLatest} from "redux-saga/effects";
// import { take, call, put, select } from 'redux-saga/effects';

import {axiosInstance} from "../../utils/api";
import {saveArtistAction, fetchArtistAction, saveSupportDataAction} from "./actions";
import {FETCH_ARTIST, FETCH_SUPPORT_DATA, FOLLOW_ARTIST, SUPPORT_ARTIST} from "./constants";

// Individual exports for testing
function fetchArtistProfile(id) {
  return axiosInstance().get(`users/artist/${id}`)
}

function fetchPublicArtistProfile(id) {
  return axiosInstance().get(`users/public/artist/${id}`)
}

function followArtist(data) {
  return axiosInstance().post('users/followArtist/action', data)
}

function supportArtistAPI(artistId) {

}

function fetchSupportDataAPI(artistId) {
  
}

function* fetchArtistSaga(action) {
  const {id} = action;
  try {
    const token = yield localStorage.getItem('token');
    const response = yield call(token ? fetchArtistProfile : fetchPublicArtistProfile, id)

    yield put(saveArtistAction(response.data))
  } catch (e) {
    toast.error(e);
  }
}

function* followArtistSaga(action) {
  const {artistId, follow, id} = action;
  try {
    yield call(followArtist, {artistId, follow});
    if (follow) toast.success("Artist added to your library")
    else toast.success("Artist removed from your library")

    const token = yield localStorage.getItem('token');
    const response = yield call(token ? fetchArtistProfile : fetchPublicArtistProfile, id)

    yield put(saveArtistAction(response.data))
  } catch (e) {
    toast.error(e);
  }
}

function* supoortArtistSaga(action) {
  try {

    const {artistId} = action;
    yield call(supportArtistAPI, artistId)
    toast.success('Artist Supported');
  } catch(e) {
    toast.error(e);
  }
}

function* fetchSupportDataSaga(action) {
  try {
    const {artistId}=action;
    const response = yield call(fetchSupportDataAPI, artistId);
    if (response) {
      yield put(saveSupportDataAction(response.data))
    }
  } catch (e) {
    toast.error(e)
  }
}

export default function* artistSaga() {
  yield takeLatest(FETCH_ARTIST, fetchArtistSaga);
  yield takeLatest(FOLLOW_ARTIST, followArtistSaga);
  yield takeLatest(SUPPORT_ARTIST, supoortArtistSaga);
  yield takeLatest(FETCH_SUPPORT_DATA, fetchSupportDataSaga);
}
