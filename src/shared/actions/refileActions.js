import * as types from '../constants/index';

// Returns an action type
export const refileErrorsAction = (payload) => ({
  type: types.REFILE_ERRORS_REQUEST,
  payload
});
