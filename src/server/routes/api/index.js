import axios from 'axios';
import aws from 'aws-sdk';
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


export function updateMetadata(req, res, next) {
  const params = req.body;

  if (!params) {
    return res.status(400).json({
      error: 'Error: malformed request; verify payload properties',
      status: 400
    });
  }

  const paramsAsJsonString = JSON.stringify(params);
  const { api , region } = config.sqs;
  aws.config.update({ region: region });
  // Send to SQS
  const sqsPayload = getSqsPayload({ message: paramsAsJsonString, queueUrl: api });
  const sqs = new aws.SQS({ apiVersion: '2012-11-05' });

  sqs.sendMessage(sqsPayload, (err, data) => {
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
}

export function transferMetadata(req, res, next) {
  const params = req.body;

  if (!params) {
    return res.status(400).json({
      error: 'Error: malformed request; verify payload properties',
      status: 400
    });
  }

  console.log(params);
}
