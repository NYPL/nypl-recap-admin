import { takeLatest } from 'redux-saga/effects';
import { refileSaga } from './refileSaga';
import * as types from '../constants/index';

// Watches for REFILE_ERRORS_REQUEST action type asynchronously
export default function* watchRefileRequests() {
  yield takeLatest(types.REFILE_ERRORS_REQUEST, refileSaga);
}
