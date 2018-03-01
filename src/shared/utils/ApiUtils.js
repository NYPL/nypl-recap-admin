import axios from 'axios';

export const getRefileErrors = (apiUrl = '/refile-errors', { }) => {
  return axios.get(apiUrl).then(response => response.data);
};
