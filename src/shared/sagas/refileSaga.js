import { put, call } from 'redux-saga/effects';
import { getRefileErrors } from '../utils/ApiUtils';
import * as types from '../constants/index';

// Responsible for searching media library, making calls to the API
// and instructing the redux-saga middle ware on the next line of action,
// for success or failure operation.
export function* refileSaga({ payload }) {
  try {
    const refileErrors = yield call(getRefileErrors, payload);

    yield put({ type: types.REFILE_ERRORS_SUCCESS, refileErrors });
  } catch (error) {
    yield put({ type: types.REFILE_ERRORS_FAILURE, error });
  }
}
