import { combineReducers } from 'redux';
import refile from './refileReducer';

// Combines all reducers to a single reducer function
const rootReducer = combineReducers({
  refile,
});

export default rootReducer;
