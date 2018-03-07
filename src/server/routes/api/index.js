import isEmpty from 'lodash/isEmpty';
import config from '../../../../config/appConfig';
import NyplApiClient from '@nypl/nypl-data-api-client';
// Read local .env file. The environment variables will be assigned with process.env in the beginning
import dotEnv from 'dotenv';
dotEnv.config();

function constructApiHeaders(token = '') {
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
}

function getSqsPayload(object) {
  return {
    'MessageBody': object.message,
    'QueueUrl': object.queueUrl
  };
}

function validateSqsData(params, type) {
  const { barcodes, protectCGD, action, email, bibRecordNumber } = params;
  const statusCode = 400;
  const errorsList = [];

  if (isEmpty(params)) {
    errorsList.push({
      parameters: 'The required POST parameters are undefined'
    });
  }

  if (isEmpty(barcodes)) {
    errorsList.push({
      barcodes: 'The barcodes required array parameter is not defined or empty'
    });
  }

  if (typeof protectCGD !== 'boolean') {
    errorsList.push({
      protectCGD: 'The protectCGD required boolean parameter is not defined'
    });
  }

  if (isEmpty(action)) {
    errorsList.push({
      action: 'The action required string parameter is not defined'
    });
  }

  if (isEmpty(email)) {
    errorsList.push({
      email: 'The email required string parameter is not defined'
    });
  }

  if (type === 'transfer' && isEmpty(bibRecordNumber)) {
    errorsList.push({
      bibRecordNumber: 'The bibRecordNumber required string parameter is not defined'
    });
  }

  return !isEmpty(errorsList) ? { isValid: false, parameters: errorsList } : { isValid: true };
}

export function handleSqsDataProcessing(sqsClient, type) {
  return (req, res, next) => {
    const api = process.env.SQS_API;
    const email = req.user.email;
    const params = {...req.body, email};
    const validatedSqsData = validateSqsData(params, type);

    if (!sqsClient) {
      return res.status(500).json({
        error: 'Error: SQS Client is not defined; cannot initialize client instance',
        status: 500
      });
    }

    if (isEmpty(type)) {
      return res.status(500).json({
        error: 'Error: SQS transaction type is undefined',
        status: 500
      });
    }

    if (validatedSqsData.isValid === false) {
      return res.status(400).json({
        error: 'Error: SQS required payload properties are undefined or invalid; check debugInfo for more information',
        debugInfo: { payload: validatedSqsData.parameters, type: type },
        status: 400
      });
    }

    const paramsAsJsonString = JSON.stringify(params);
    const sqsPayload = getSqsPayload({ message: paramsAsJsonString, queueUrl: api });

    sqsClient.sendMessage(sqsPayload, (err, data) => {
      if (err) {
        console.log("Error", err);
        return res.status(503).json({
          error: err,
          status: 503
        });
      }

      return res.json({
        status: 200,
        response: data
      });
    });
  };
}

/**
* constructDateQuery(dateInput, isEndDate = false)
* @desc Builds the queries of the dates for sending to the API
*/
function constructDateQuery(dateInput, isEndDate = false) {
  const lastSecond = (isEndDate) ? 'T23:59:59' : '';

  if (dateInput && typeof dateInput === 'string') {
    const dateArray = dateInput.split('/');

    // Checks if it has a valid date format
    if (!dateArray || dateArray.length !== 3) {
      return undefined;
    }

    if (dateArray[0].length !== 2 || dateArray[1].length !== 2 || dateArray[2].length !== 4) {
      return undefined;
    }

    // Checks if the month is valid
    if (parseInt(dateArray[0], 10) < 1 || parseInt(dateArray[0], 10) > 12) {
      return undefined;
    }

    // Checks if the date is valid
    if (parseInt(dateArray[1], 10) < 1 || parseInt(dateArray[1], 10) > 31) {
      return undefined;
    }

    return `${dateArray[2]}-${dateArray[0]}-${dateArray[1]}${lastSecond}`;
  }

  return undefined;
}

/**
* getRefileErrors(req, res, next)
* @desc Gets the refile error records from the API endpoint and returns it to the front end
*/
export function getRefileErrors(req, res, next) {
  // The format of start date and end date should be YYYY-MM-DD
  // end date should be send with specific time to indicate to the end of the date
  const startDateQuery = constructDateQuery(req.body.startDate, false);
  const endDateQuery = constructDateQuery(req.body.endDate, true);
  const offsetQuery = req.body.offset;
  const limitQuery = 25;

  // For the case the date inputs are not valid format or value
  if (!startDateQuery || !endDateQuery) {
    res.status(400)
    .header('Content-Type', 'application/json')
    .json({
      message: 'Not valid date inputs.'
    });
  }

  const client = new NyplApiClient({
    base_url: 'https://dev-platform.nypl.org/api/v0.1/',
    oauth_key: config.oauth.refileRequestId,
    oauth_secret: process.env.REFILE_REQUEST_SECRET,
    oauth_url: config.oauth.tokenUrlForNyplApiClient,
  });

  client.get(
    `recap/refile-requests?createdDate=[${startDateQuery},${endDateQuery}]&offset=${offsetQuery}&limit=${limitQuery}&includeTotalCount=true`,
    {
      json: true,
    }
  )
  .then(response => {
    res.json({
      status: 200,
      count: limitQuery,
      data: response
    });
  })
  .catch(error => {
    res.json({
      status: 400,
      count: limitQuery,
      data: error
    });
  });
}
