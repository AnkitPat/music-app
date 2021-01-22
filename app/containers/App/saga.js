/**
 * Gets the default data to save in redux
 */

import { call, put, takeLatest } from 'redux-saga/effects';
import jwt_decode from 'jwt-decode';
import { PREPARE_APP, GET_USER_DETAILS } from './constants';
import { getUserDetailsFail, getUserDetailsSuccess, setRole } from './actions';
import { axiosInstance } from '../../utils/api';

function fetchUserInformation() {
  return axiosInstance().get('/auth/userDetails');
}

export function* prepareApp() {
  const token = yield localStorage.getItem('token');
  const decoded = jwt_decode(token);
  yield put(setRole(decoded.role));
}

export function* getUserInformation() {
  try {
    const result = yield call(fetchUserInformation);
    yield put(getUserDetailsSuccess(result.data));
  } catch (error) {
    yield put(getUserDetailsFail(error));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* getFeaturedAlbumData() {
  yield takeLatest(PREPARE_APP, prepareApp);
  yield takeLatest(GET_USER_DETAILS, getUserInformation);
}
