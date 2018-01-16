import axios from 'axios';
import { fromJS, Map, List } from 'immutable';
import config from '../../../../config/appConfig';

function constructApiHeaders(token = '') {
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
}

export function getPatronData(req, res, next) {
  if (req.tokenResponse.isTokenValid
    && req.tokenResponse.accessToken
    && req.tokenResponse.decodedPatron
    && req.tokenResponse.decodedPatron.sub
  ) {
    const userId = req.tokenResponse.decodedPatron.sub;
    const userToken = req.tokenResponse.accessToken;
    const patronHoldsApi = `${config.api.development}/patrons/${userId}/holds`;
    const itemsApi = `${config.api.development}/items`;

    console.log('getPatronData API Call', userId);

    // axios
    //   .get(patronHoldsApi, constructApiHeaders(userToken))
    //   .then((response) => {
    //     if (response.data) {
    //       // Data is empty for the Patron
    //       if (response.data.statusCode === 404) {
    //         console.log(response.data.statusCode, response.data.message);
    //         res.locals.data = {};
    //       }
    //       // Data exists for the Patron
    //       if (response.data.statusCode === 200 && response.data.data) {
    //         res.locals.data = {
    //           PatronStore: {
    //             patronHolds: response.data.data,
    //           },
    //         };
    //       }
    //     }
    //     // Continue next function call
    //     next();
    //   })
    //   .catch((error) => {
    //     // Debugging
    //     console.log(`API ERROR: ${patronHoldsApi}`, error);
    //     res.locals.data = {};
    //     // Continue next function call
    //     next();
    //   });
  }
}
