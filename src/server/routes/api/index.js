import axios from 'axios';
import isEmpty from 'lodash/isEmpty';
import config from '../../../../config/appConfig';

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

function isSqsDataValid(params, type) {
  const { barcodes, protectCGD, action, email } = params;
  if (type === 'transfer') {
    const { bibRecordNumber } = params;

    if (isEmpty(barcodes) || isEmpty(bibRecordNumber) || typeof protectCGD !== 'boolean' || isEmpty(action) || isEmpty(email)) {
      return false;
    }
  }

  if (type === 'update') {
    if (isEmpty(barcodes) || typeof protectCGD !== 'boolean' || isEmpty(action) || isEmpty(email)) {
      return false;
    }
  }

  return true;
}

export function handleSqsDataProcessing(sqsClient, type) {
  return (req, res, next) => {
    const { api } = config.sqs;
    const params = req.body;

    if (!sqsClient) {
      return res.status(503).json({
        error: 'SQS Client is not defined',
        status: 503
      });
    }

    if (!type || type === '') {
      return res.status(503).json({
        error: 'SQS transaction type is undefined',
        status: 503
      });
    }

    if (!params) {
      return res.status(400).json({
        error: 'Error: SQS payload data is undefined',
        status: 400
      });
    }


    if (isSqsDataValid(params, type) === false) {
      return res.status(400).json({
        error: 'Error: SQS required payload properties are invalid',
        debugInfo: { payload: params, type: type },
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
