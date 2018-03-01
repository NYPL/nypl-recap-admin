import * as types from '../constants/index';

export default function(state = [], action) {
  switch (action.type) {
    case types.REFILE_ERRORS_SUCCESS:
      return [...state, action.refileErrors];
    default:
      return state;
  }
}
