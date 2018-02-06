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
    const { api } = config.sqs;
    const params = req.body;
    const validatedSqsData = isSqsDataValid(params, type);

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
