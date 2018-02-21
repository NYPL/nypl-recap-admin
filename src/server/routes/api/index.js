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
    const { api } = config.sqs;
    const params = req.body;
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

export function getRefileErrors(req, res, next) {
  // Mock response, app client token has not been done
  const mockResponse = [
    {
        "id": 1727,
        "jobId": "b36c32eb-22d1-4bdd-9878-d808ff99b48d",
        "success": true,
        "createdDate": "2018-02-16T11:52:45-05:00",
        "updatedDate": "2018-02-16T11:52:48-05:00",
        "itemBarcode": "33433009237623",
        "afMessage": null,
        "sip2Response": "{\"fixed\":{\"Ok\":\"1\",\"Resensitize\":\"Y\",\"Magnetic\":\"N\",\"Alert\":\"N\",\"TransactionDate\":\"201802160000115248\"},\"variable\":{\"Raw\":[\"AOnypl \",\"AB33433009237623\",\"AQrc2ma\",\"AJStatistik vivliographia peri Hellados 1821-1971 \\/ hypo Michal Chouliarak.\",\"CK000\",\"AF\",\"CSJLG 81-43 \",\"CRrc2ma\",\"CT     \",\"CV\",\"CY\",\"DA\",\"AY0\"],\"AO\":[\"nypl \"],\"AB\":[\"33433009237623\"],\"AQ\":[\"rc2ma\"],\"AJ\":[\"Statistik vivliographia peri Hellados 1821-1971 \\/ hypo Michal Chouliarak.\"],\"CK\":[\"000\"],\"CS\":[\"JLG 81-43 \"],\"CR\":[\"rc2ma\"],\"AY\":[\"0\"],\"AZ\":[\"C809\\r\"]}}"
    },
    {
        "id": 1726,
        "jobId": "adc3e913-9fbe-4e72-be3f-b63cb84e0e86",
        "success": false,
        "createdDate": "2018-02-16T11:19:30-05:00",
        "updatedDate": "2018-02-16T11:19:33-05:00",
        "itemBarcode": "33433009237623",
        "afMessage": "[\"Item was put on holdshelf.\"]",
        "sip2Response": "{\"fixed\":{\"Ok\":\"1\",\"Resensitize\":\"Y\",\"Magnetic\":\"N\",\"Alert\":\"Y\",\"TransactionDate\":\"201802160000111933\"},\"variable\":{\"Raw\":[\"AOnypl \",\"AB33433009237623\",\"AQrc2ma\",\"AJStatistik vivliographia peri Hellados 1821-1971 \\/ hypo Michal Chouliarak.\",\"CK000\",\"AFItem was put on holdshelf.\",\"CSJLG 81-43 \",\"CRrc2ma\",\"CT     \",\"CV01\",\"CY23333080894825\",\"DABIRD, BERNARD:2\",\"AY0\"],\"AO\":[\"nypl \"],\"AB\":[\"33433009237623\"],\"AQ\":[\"rc2ma\"],\"AJ\":[\"Statistik vivliographia peri Hellados 1821-1971 \\/ hypo Michal Chouliarak.\"],\"CK\":[\"000\"],\"AF\":[\"Item was put on holdshelf.\"],\"CS\":[\"JLG 81-43 \"],\"CR\":[\"rc2ma\"],\"CV\":[\"01\"],\"CY\":[\"23333080894825\"],\"DA\":[\"BIRD, BERNARD:2\"],\"AY\":[\"0\"],\"AZ\":[\"B778\\r\"]}}"
    },
    {
        "id": 1725,
        "jobId": "e7eab060-78e3-4104-9371-5a0950e52d04",
        "success": false,
        "createdDate": "2018-02-16T11:15:31-05:00",
        "updatedDate": "2018-02-16T11:15:33-05:00",
        "itemBarcode": "33433009237623",
        "afMessage": null,
        "sip2Response": "{\"fixed\":{\"Ok\":\"1\",\"Resensitize\":\"Y\",\"Magnetic\":\"N\",\"Alert\":\"Y\",\"TransactionDate\":\"201802160000111533\"},\"variable\":{\"Raw\":[\"AOnypl \",\"AB33433009237623\",\"AQrc2ma\",\"AJStatistik vivliographia peri Hellados 1821-1971 \\/ hypo Michal Chouliarak.\",\"CK000\",\"AF\",\"CSJLG 81-43 \",\"CRrc2ma\",\"CT     \",\"CV\",\"CY\",\"DA\",\"AY0\"],\"AO\":[\"nypl \"],\"AB\":[\"33433009237623\"],\"AQ\":[\"rc2ma\"],\"AJ\":[\"Statistik vivliographia peri Hellados 1821-1971 \\/ hypo Michal Chouliarak.\"],\"CK\":[\"000\"],\"CS\":[\"JLG 81-43 \"],\"CR\":[\"rc2ma\"],\"AY\":[\"0\"],\"AZ\":[\"C805\\r\"]}}"
    },
    {
        "id": 1724,
        "jobId": "bdd83158-1f7f-481a-9d2d-7761cf860525",
        "success": true,
        "createdDate": "2018-02-16T11:12:30-05:00",
        "updatedDate": "2018-02-16T11:12:33-05:00",
        "itemBarcode": "33433009237623",
        "afMessage": null,
        "sip2Response": "{\"fixed\":{\"Ok\":\"1\",\"Resensitize\":\"Y\",\"Magnetic\":\"N\",\"Alert\":\"N\",\"TransactionDate\":\"201802160000111232\"},\"variable\":{\"Raw\":[\"AOnypl \",\"AB33433009237623\",\"AQrc2ma\",\"AJStatistik vivliographia peri Hellados 1821-1971 \\/ hypo Michal Chouliarak.\",\"CK000\",\"AF\",\"CSJLG 81-43 \",\"CRrc2ma\",\"CT     \",\"CV\",\"CY\",\"DA\",\"AY0\"],\"AO\":[\"nypl \"],\"AB\":[\"33433009237623\"],\"AQ\":[\"rc2ma\"],\"AJ\":[\"Statistik vivliographia peri Hellados 1821-1971 \\/ hypo Michal Chouliarak.\"],\"CK\":[\"000\"],\"CS\":[\"JLG 81-43 \"],\"CR\":[\"rc2ma\"],\"AY\":[\"0\"],\"AZ\":[\"C814\\r\"]}}"
    },
    {
        "id": 1723,
        "jobId": "99e45df1-0b50-4ed7-acb3-0b6438fff024",
        "success": true,
        "createdDate": "2018-02-16T11:11:46-05:00",
        "updatedDate": "2018-02-16T11:11:48-05:00",
        "itemBarcode": "33433009237623",
        "afMessage": null,
        "sip2Response": "{\"fixed\":{\"Ok\":\"1\",\"Resensitize\":\"Y\",\"Magnetic\":\"N\",\"Alert\":\"N\",\"TransactionDate\":\"201802160000111148\"},\"variable\":{\"Raw\":[\"AOnypl \",\"AB33433009237623\",\"AQrc2ma\",\"AJStatistik vivliographia peri Hellados 1821-1971 \\/ hypo Michal Chouliarak.\",\"CK000\",\"AF\",\"CSJLG 81-43 \",\"CRrc2ma\",\"CT     \",\"CV\",\"CY\",\"DA\",\"AY0\"],\"AO\":[\"nypl \"],\"AB\":[\"33433009237623\"],\"AQ\":[\"rc2ma\"],\"AJ\":[\"Statistik vivliographia peri Hellados 1821-1971 \\/ hypo Michal Chouliarak.\"],\"CK\":[\"000\"],\"CS\":[\"JLG 81-43 \"],\"CR\":[\"rc2ma\"],\"AY\":[\"0\"],\"AZ\":[\"C80E\\r\"]}}"
    },
    {
        "id": 1722,
        "jobId": "d22c9aa2-2278-4992-869f-5bbf3a298f02",
        "success": false,
        "createdDate": "2018-02-12T13:06:59-05:00",
        "updatedDate": "2018-02-12T13:07:01-05:00",
        "itemBarcode": "33433005144989",
        "afMessage": "[\"Item was put on holdshelf.\"]",
        "sip2Response": "{\"fixed\":{\"Ok\":\"1\",\"Resensitize\":\"Y\",\"Magnetic\":\"N\",\"Alert\":\"Y\",\"TransactionDate\":\"201802120000130700\"},\"variable\":{\"Raw\":[\"AOnypl \",\"AB33433005144989\",\"AQrc2ma\",\"AJSchiermonnikoog \\/ Tekst: Louise Mellma ; Foto's: Jan Heuff.\",\"CK000\",\"AFItem was put on holdshelf.\",\"CSJFB 81-79 \",\"CRrc2ma\",\"CTmm   \",\"CV01\",\"CY23333062686553\",\"DAPOON, HO-LING:2\",\"AY0\"],\"AO\":[\"nypl \"],\"AB\":[\"33433005144989\"],\"AQ\":[\"rc2ma\"],\"AJ\":[\"Schiermonnikoog \\/ Tekst: Louise Mellma ; Foto's: Jan Heuff.\"],\"CK\":[\"000\"],\"AF\":[\"Item was put on holdshelf.\"],\"CS\":[\"JFB 81-79 \"],\"CR\":[\"rc2ma\"],\"CT\":[\"mm   \"],\"CV\":[\"01\"],\"CY\":[\"23333062686553\"],\"DA\":[\"POON, HO-LING:2\"],\"AY\":[\"0\"],\"AZ\":[\"BBDD\\r\"]}}"
    },
    {
        "id": 1721,
        "jobId": "5680cb28-5052-4309-894d-63bf71e2c09b",
        "success": false,
        "createdDate": "2018-02-12T13:06:48-05:00",
        "updatedDate": "2018-02-12T13:06:50-05:00",
        "itemBarcode": "33433005144989",
        "afMessage": "[\"Item was put on holdshelf.\"]",
        "sip2Response": "{\"fixed\":{\"Ok\":\"1\",\"Resensitize\":\"Y\",\"Magnetic\":\"N\",\"Alert\":\"Y\",\"TransactionDate\":\"201802120000130650\"},\"variable\":{\"Raw\":[\"AOnypl \",\"AB33433005144989\",\"AQrc2ma\",\"AJSchiermonnikoog \\/ Tekst: Louise Mellma ; Foto's: Jan Heuff.\",\"CK000\",\"AFItem was put on holdshelf.\",\"CSJFB 81-79 \",\"CRrc2ma\",\"CTmm   \",\"CV01\",\"CY23333062686553\",\"DAPOON, HO-LING:2\",\"AY0\"],\"AO\":[\"nypl \"],\"AB\":[\"33433005144989\"],\"AQ\":[\"rc2ma\"],\"AJ\":[\"Schiermonnikoog \\/ Tekst: Louise Mellma ; Foto's: Jan Heuff.\"],\"CK\":[\"000\"],\"AF\":[\"Item was put on holdshelf.\"],\"CS\":[\"JFB 81-79 \"],\"CR\":[\"rc2ma\"],\"CT\":[\"mm   \"],\"CV\":[\"01\"],\"CY\":[\"23333062686553\"],\"DA\":[\"POON, HO-LING:2\"],\"AY\":[\"0\"],\"AZ\":[\"BBD9\\r\"]}}"
    },
    {
        "id": 1720,
        "jobId": "56953530-0ef5-4f11-9442-96f883711db6",
        "success": false,
        "createdDate": "2018-02-12T13:06:38-05:00",
        "updatedDate": "2018-02-12T13:06:40-05:00",
        "itemBarcode": "33433005144989",
        "afMessage": "[\"Item was put on holdshelf.\"]",
        "sip2Response": "{\"fixed\":{\"Ok\":\"1\",\"Resensitize\":\"Y\",\"Magnetic\":\"N\",\"Alert\":\"Y\",\"TransactionDate\":\"201802120000130640\"},\"variable\":{\"Raw\":[\"AOnypl \",\"AB33433005144989\",\"AQrc2ma\",\"AJSchiermonnikoog \\/ Tekst: Louise Mellma ; Foto's: Jan Heuff.\",\"CK000\",\"AFItem was put on holdshelf.\",\"CSJFB 81-79 \",\"CRrc2ma\",\"CTmm   \",\"CV01\",\"CY23333062686553\",\"DAPOON, HO-LING:2\",\"AY0\"],\"AO\":[\"nypl \"],\"AB\":[\"33433005144989\"],\"AQ\":[\"rc2ma\"],\"AJ\":[\"Schiermonnikoog \\/ Tekst: Louise Mellma ; Foto's: Jan Heuff.\"],\"CK\":[\"000\"],\"AF\":[\"Item was put on holdshelf.\"],\"CS\":[\"JFB 81-79 \"],\"CR\":[\"rc2ma\"],\"CT\":[\"mm   \"],\"CV\":[\"01\"],\"CY\":[\"23333062686553\"],\"DA\":[\"POON, HO-LING:2\"],\"AY\":[\"0\"],\"AZ\":[\"BBDA\\r\"]}}"
    },
    {
        "id": 1719,
        "jobId": "46a92b9a-8c75-4b4e-9b33-b174ffbcd7d9",
        "success": false,
        "createdDate": "2018-02-12T10:42:26-05:00",
        "updatedDate": "2018-02-12T10:42:31-05:00",
        "itemBarcode": "33333259898217",
        "afMessage": "[\"Item was put on holdshelf.\"]",
        "sip2Response": "{\"fixed\":{\"Ok\":\"1\",\"Resensitize\":\"Y\",\"Magnetic\":\"N\",\"Alert\":\"Y\",\"TransactionDate\":\"201802120000104230\"},\"variable\":{\"Raw\":[\"AOnypl \",\"AB33333259898217\",\"AQndj0i\",\"AJAcorns everywhere! \\/ by Kevin Sherry.\",\"CK000\",\"AFItem was put on holdshelf.\",\"CSJ PIC S \",\"CRndj0i\",\"CTns   \",\"CV01\",\"CY23333082445394\",\"DABARRETT, PAMELA:2\",\"AY0\"],\"AO\":[\"nypl \"],\"AB\":[\"33333259898217\"],\"AQ\":[\"ndj0i\"],\"AJ\":[\"Acorns everywhere! \\/ by Kevin Sherry.\"],\"CK\":[\"000\"],\"AF\":[\"Item was put on holdshelf.\"],\"CS\":[\"J PIC S \"],\"CR\":[\"ndj0i\"],\"CT\":[\"ns   \"],\"CV\":[\"01\"],\"CY\":[\"23333082445394\"],\"DA\":[\"BARRETT, PAMELA:2\"],\"AY\":[\"0\"],\"AZ\":[\"C29D\\r\"]}}"
    },
    {
        "id": 1718,
        "jobId": "44f7f171-7bdb-43f7-b52a-059f01b15e6e",
        "success": false,
        "createdDate": "2018-02-12T10:08:54-05:00",
        "updatedDate": "2018-02-12T10:08:58-05:00",
        "itemBarcode": "33433005144989",
        "afMessage": "[\"Item was put on holdshelf.\"]",
        "sip2Response": "{\"fixed\":{\"Ok\":\"1\",\"Resensitize\":\"Y\",\"Magnetic\":\"N\",\"Alert\":\"Y\",\"TransactionDate\":\"201802120000100858\"},\"variable\":{\"Raw\":[\"AOnypl \",\"AB33433005144989\",\"AQrc2ma\",\"AJSchiermonnikoog \\/ Tekst: Louise Mellma ; Foto's: Jan Heuff.\",\"CK000\",\"AFItem was put on holdshelf.\",\"CSJFB 81-79 \",\"CRrc2ma\",\"CTmm   \",\"CV01\",\"CY23333062686553\",\"DAPOON, HO-LING:2\",\"AY0\"],\"AO\":[\"nypl \"],\"AB\":[\"33433005144989\"],\"AQ\":[\"rc2ma\"],\"AJ\":[\"Schiermonnikoog \\/ Tekst: Louise Mellma ; Foto's: Jan Heuff.\"],\"CK\":[\"000\"],\"AF\":[\"Item was put on holdshelf.\"],\"CS\":[\"JFB 81-79 \"],\"CR\":[\"rc2ma\"],\"CT\":[\"mm   \"],\"CV\":[\"01\"],\"CY\":[\"23333062686553\"],\"DA\":[\"POON, HO-LING:2\"],\"AY\":[\"0\"],\"AZ\":[\"BBD2\\r\"]}}"
    },
    {
        "id": 1717,
        "jobId": "851ea925-2d86-4a3f-a3d0-826118a8aa89",
        "success": true,
        "createdDate": "2018-02-10T07:13:08-05:00",
        "updatedDate": "2018-02-10T07:13:11-05:00",
        "itemBarcode": "33433108665559",
        "afMessage": null,
        "sip2Response": "{\"fixed\":{\"Ok\":\"1\",\"Resensitize\":\"Y\",\"Magnetic\":\"N\",\"Alert\":\"N\",\"TransactionDate\":\"201802100000071311\"},\"variable\":{\"Raw\":[\"AOnypl \",\"AB33433108665559\",\"AQrcmr2\",\"AJThe Free comrade.\",\"CK000\",\"AF\",\"CS*DY 13-634 Free comrade - Gleaner (Poplar Ridge, N.Y. : 1883)\",\"CRrcmr2\",\"CT     \",\"CV\",\"CY\",\"DA\",\"AY0\"],\"AO\":[\"nypl \"],\"AB\":[\"33433108665559\"],\"AQ\":[\"rcmr2\"],\"AJ\":[\"The Free comrade.\"],\"CK\":[\"000\"],\"CS\":[\"*DY 13-634 Free comrade - Gleaner (Poplar Ridge, N.Y. : 1883)\"],\"CR\":[\"rcmr2\"],\"AY\":[\"0\"],\"AZ\":[\"CBFC\\r\"]}}"
    },
    {
        "id": 1716,
        "jobId": "6e34061b-4bcd-4e25-b988-7da300747697",
        "success": false,
        "createdDate": "2018-02-07T16:59:12-05:00",
        "updatedDate": "2018-02-07T16:59:17-05:00",
        "itemBarcode": "33433005144989",
        "afMessage": "[\"Item was put on holdshelf.\"]",
        "sip2Response": "{\"fixed\":{\"Ok\":\"1\",\"Resensitize\":\"Y\",\"Magnetic\":\"N\",\"Alert\":\"Y\",\"TransactionDate\":\"201802070000165917\"},\"variable\":{\"Raw\":[\"AOnypl \",\"AB33433005144989\",\"AQrc2ma\",\"AJSchiermonnikoog \\/ Tekst: Louise Mellma ; Foto's: Jan Heuff.\",\"CK000\",\"AFItem was put on holdshelf.\",\"CSJFB 81-79 \",\"CRrc2ma\",\"CTmm   \",\"CV01\",\"CY23333062686553\",\"DAPOON, HO-LING:2\",\"AY0\"],\"AO\":[\"nypl \"],\"AB\":[\"33433005144989\"],\"AQ\":[\"rc2ma\"],\"AJ\":[\"Schiermonnikoog \\/ Tekst: Louise Mellma ; Foto's: Jan Heuff.\"],\"CK\":[\"000\"],\"AF\":[\"Item was put on holdshelf.\"],\"CS\":[\"JFB 81-79 \"],\"CR\":[\"rc2ma\"],\"CT\":[\"mm   \"],\"CV\":[\"01\"],\"CY\":[\"23333062686553\"],\"DA\":[\"POON, HO-LING:2\"],\"AY\":[\"0\"],\"AZ\":[\"BBC7\\r\"]}}"
    },
    {
        "id": 1715,
        "jobId": "06360ea9-c089-4999-87d3-7df2c873e267",
        "success": false,
        "createdDate": "2018-02-07T09:54:46-05:00",
        "updatedDate": "2018-02-07T09:54:49-05:00",
        "itemBarcode": "33433005144989",
        "afMessage": "[\"Item was put on holdshelf.\"]",
        "sip2Response": "{\"fixed\":{\"Ok\":\"1\",\"Resensitize\":\"Y\",\"Magnetic\":\"N\",\"Alert\":\"Y\",\"TransactionDate\":\"201802070000095448\"},\"variable\":{\"Raw\":[\"AOnypl \",\"AB33433005144989\",\"AQrc2ma\",\"AJSchiermonnikoog \\/ Tekst: Louise Mellma ; Foto's: Jan Heuff.\",\"CK000\",\"AFItem was put on holdshelf.\",\"CSJFB 81-79 \",\"CRrc2ma\",\"CTmm   \",\"CV01\",\"CY23333062686553\",\"DAPOON, HO-LING:2\",\"AY0\"],\"AO\":[\"nypl \"],\"AB\":[\"33433005144989\"],\"AQ\":[\"rc2ma\"],\"AJ\":[\"Schiermonnikoog \\/ Tekst: Louise Mellma ; Foto's: Jan Heuff.\"],\"CK\":[\"000\"],\"AF\":[\"Item was put on holdshelf.\"],\"CS\":[\"JFB 81-79 \"],\"CR\":[\"rc2ma\"],\"CT\":[\"mm   \"],\"CV\":[\"01\"],\"CY\":[\"23333062686553\"],\"DA\":[\"POON, HO-LING:2\"],\"AY\":[\"0\"],\"AZ\":[\"BBC6\\r\"]}}"
    },
    {
        "id": 1714,
        "jobId": "8c56ad7c-e72a-4a71-abe0-2076d665fbf8",
        "success": false,
        "createdDate": "2018-02-07T09:42:32-05:00",
        "updatedDate": "2018-02-07T09:42:34-05:00",
        "itemBarcode": "33433005144989",
        "afMessage": "[\"Item was put on holdshelf.\"]",
        "sip2Response": "{\"fixed\":{\"Ok\":\"1\",\"Resensitize\":\"Y\",\"Magnetic\":\"N\",\"Alert\":\"Y\",\"TransactionDate\":\"201802070000094234\"},\"variable\":{\"Raw\":[\"AOnypl \",\"AB33433005144989\",\"AQrc2ma\",\"AJSchiermonnikoog \\/ Tekst: Louise Mellma ; Foto's: Jan Heuff.\",\"CK000\",\"AFItem was put on holdshelf.\",\"CSJFB 81-79 \",\"CRrc2ma\",\"CTmm   \",\"CV01\",\"CY23333062686553\",\"DAPOON, HO-LING:2\",\"AY0\"],\"AO\":[\"nypl \"],\"AB\":[\"33433005144989\"],\"AQ\":[\"rc2ma\"],\"AJ\":[\"Schiermonnikoog \\/ Tekst: Louise Mellma ; Foto's: Jan Heuff.\"],\"CK\":[\"000\"],\"AF\":[\"Item was put on holdshelf.\"],\"CS\":[\"JFB 81-79 \"],\"CR\":[\"rc2ma\"],\"CT\":[\"mm   \"],\"CV\":[\"01\"],\"CY\":[\"23333062686553\"],\"DA\":[\"POON, HO-LING:2\"],\"AY\":[\"0\"],\"AZ\":[\"BBCE\\r\"]}}"
    },
    {
        "id": 1713,
        "jobId": "e45aea75-f703-43e9-a2d4-ca7bfb919901",
        "success": false,
        "createdDate": "2018-02-05T16:57:38-05:00",
        "updatedDate": "2018-02-05T16:57:41-05:00",
        "itemBarcode": "33433005144989",
        "afMessage": "[\"Item was put on holdshelf.\"]",
        "sip2Response": "{\"fixed\":{\"Ok\":\"1\",\"Resensitize\":\"Y\",\"Magnetic\":\"N\",\"Alert\":\"Y\",\"TransactionDate\":\"201802050000165741\"},\"variable\":{\"Raw\":[\"AOnypl \",\"AB33433005144989\",\"AQrc2ma\",\"AJSchiermonnikoog \\/ Tekst: Louise Mellma ; Foto's: Jan Heuff.\",\"CK000\",\"AFItem was put on holdshelf.\",\"CSJFB 81-79 \",\"CRrc2ma\",\"CTmm   \",\"CV01\",\"CY23333062686553\",\"DAPOON, HO-LING:2\",\"AY0\"],\"AO\":[\"nypl \"],\"AB\":[\"33433005144989\"],\"AQ\":[\"rc2ma\"],\"AJ\":[\"Schiermonnikoog \\/ Tekst: Louise Mellma ; Foto's: Jan Heuff.\"],\"CK\":[\"000\"],\"AF\":[\"Item was put on holdshelf.\"],\"CS\":[\"JFB 81-79 \"],\"CR\":[\"rc2ma\"],\"CT\":[\"mm   \"],\"CV\":[\"01\"],\"CY\":[\"23333062686553\"],\"DA\":[\"POON, HO-LING:2\"],\"AY\":[\"0\"],\"AZ\":[\"BBCE\\r\"]}}"
    },
    {
        "id": 1712,
        "jobId": "14d700f5-de43-4bbc-bf6f-ca02e9f2c109",
        "success": true,
        "createdDate": "2018-02-05T16:54:06-05:00",
        "updatedDate": "2018-02-05T16:54:08-05:00",
        "itemBarcode": "33433073222956",
        "afMessage": null,
        "sip2Response": "{\"fixed\":{\"Ok\":\"1\",\"Resensitize\":\"Y\",\"Magnetic\":\"N\",\"Alert\":\"N\",\"TransactionDate\":\"201802050000165407\"},\"variable\":{\"Raw\":[\"AOnypl \",\"AB33433073222956\",\"AQmag92\",\"AJHamilton \\/ Randy McNutt and Cheryl Bauer.\",\"CK000\",\"AF\",\"CSIVB (Hamilton) 06-3386 \",\"CRmag92\",\"CT     \",\"CV\",\"CY\",\"DA\",\"AY0\"],\"AO\":[\"nypl \"],\"AB\":[\"33433073222956\"],\"AQ\":[\"mag92\"],\"AJ\":[\"Hamilton \\/ Randy McNutt and Cheryl Bauer.\"],\"CK\":[\"000\"],\"CS\":[\"IVB (Hamilton) 06-3386 \"],\"CR\":[\"mag92\"],\"AY\":[\"0\"],\"AZ\":[\"CF63\\r\"]}}"
    },
    {
        "id": 1711,
        "jobId": "8d9da1f2-6f7c-4eb6-bef9-d3150ed90025",
        "success": true,
        "createdDate": "2018-02-05T15:01:06-05:00",
        "updatedDate": "2018-02-05T15:01:10-05:00",
        "itemBarcode": "33433073222956",
        "afMessage": null,
        "sip2Response": "{\"fixed\":{\"Ok\":\"1\",\"Resensitize\":\"Y\",\"Magnetic\":\"N\",\"Alert\":\"N\",\"TransactionDate\":\"201802050000150109\"},\"variable\":{\"Raw\":[\"AOnypl \",\"AB33433073222956\",\"AQmag92\",\"AJHamilton \\/ Randy McNutt and Cheryl Bauer.\",\"CK000\",\"AF\",\"CSIVB (Hamilton) 06-3386 \",\"CRmag92\",\"CT     \",\"CV\",\"CY\",\"DA\",\"AY0\"],\"AO\":[\"nypl \"],\"AB\":[\"33433073222956\"],\"AQ\":[\"mag92\"],\"AJ\":[\"Hamilton \\/ Randy McNutt and Cheryl Bauer.\"],\"CK\":[\"000\"],\"CS\":[\"IVB (Hamilton) 06-3386 \"],\"CR\":[\"mag92\"],\"AY\":[\"0\"],\"AZ\":[\"CF6A\\r\"]}}"
    },
    {
        "id": 1710,
        "jobId": "d2c65c2d-3478-4fe9-b1de-a54a7a60c158",
        "success": false,
        "createdDate": "2018-02-05T14:58:20-05:00",
        "updatedDate": "2018-02-05T14:58:23-05:00",
        "itemBarcode": "33433073222956",
        "afMessage": null,
        "sip2Response": "{\"fixed\":{\"Ok\":\"1\",\"Resensitize\":\"Y\",\"Magnetic\":\"N\",\"Alert\":\"Y\",\"TransactionDate\":\"201802050000145822\"},\"variable\":{\"Raw\":[\"AOnypl \",\"AB33433073222956\",\"AQmag92\",\"AJHamilton \\/ Randy McNutt and Cheryl Bauer.\",\"CK000\",\"AF\",\"CSIVB (Hamilton) 06-3386 \",\"CRmag92\",\"CT     \",\"CV\",\"CY\",\"DA\",\"AY0\"],\"AO\":[\"nypl \"],\"AB\":[\"33433073222956\"],\"AQ\":[\"mag92\"],\"AJ\":[\"Hamilton \\/ Randy McNutt and Cheryl Bauer.\"],\"CK\":[\"000\"],\"CS\":[\"IVB (Hamilton) 06-3386 \"],\"CR\":[\"mag92\"],\"AY\":[\"0\"],\"AZ\":[\"CF59\\r\"]}}"
    },
    {
        "id": 1709,
        "jobId": "b32582a1-183a-43c6-9eda-e095b5ef082d",
        "success": false,
        "createdDate": "2018-02-05T14:55:39-05:00",
        "updatedDate": "2018-02-05T14:55:42-05:00",
        "itemBarcode": "33433073222956",
        "afMessage": "[\"Item was put on holdshelf.\"]",
        "sip2Response": "{\"fixed\":{\"Ok\":\"1\",\"Resensitize\":\"Y\",\"Magnetic\":\"N\",\"Alert\":\"Y\",\"TransactionDate\":\"201802050000145542\"},\"variable\":{\"Raw\":[\"AOnypl \",\"AB33433073222956\",\"AQmag92\",\"AJHamilton \\/ Randy McNutt and Cheryl Bauer.\",\"CK000\",\"AFItem was put on holdshelf.\",\"CSIVB (Hamilton) 06-3386 \",\"CRmag92\",\"CTmm   \",\"CV01\",\"CY23333062686553\",\"DAPOON, HO-LING:2\",\"AY0\"],\"AO\":[\"nypl \"],\"AB\":[\"33433073222956\"],\"AQ\":[\"mag92\"],\"AJ\":[\"Hamilton \\/ Randy McNutt and Cheryl Bauer.\"],\"CK\":[\"000\"],\"AF\":[\"Item was put on holdshelf.\"],\"CS\":[\"IVB (Hamilton) 06-3386 \"],\"CR\":[\"mag92\"],\"CT\":[\"mm   \"],\"CV\":[\"01\"],\"CY\":[\"23333062686553\"],\"DA\":[\"POON, HO-LING:2\"],\"AY\":[\"0\"],\"AZ\":[\"BE2F\\r\"]}}"
    },
    {
        "id": 1708,
        "jobId": "711f5c27-4d59-42f3-b41f-7cf48ff95fc9",
        "success": true,
        "createdDate": "2018-02-05T14:52:55-05:00",
        "updatedDate": "2018-02-05T14:52:58-05:00",
        "itemBarcode": "33433000900021",
        "afMessage": null,
        "sip2Response": "{\"fixed\":{\"Ok\":\"1\",\"Resensitize\":\"Y\",\"Magnetic\":\"N\",\"Alert\":\"N\",\"TransactionDate\":\"201802050000145258\"},\"variable\":{\"Raw\":[\"AOnypl \",\"AB33433000900021\",\"AQrc2ma\",\"AJIch kenne keine Angst : Ansgar, [801-865], Missionar bei den Wikingern \\/ Hannes Gamillscheg.\",\"CK000\",\"AF\",\"CSJXC 81-6 \",\"CRrc2ma\",\"CT     \",\"CV\",\"CY\",\"DA\",\"AY0\"],\"AO\":[\"nypl \"],\"AB\":[\"33433000900021\"],\"AQ\":[\"rc2ma\"],\"AJ\":[\"Ich kenne keine Angst : Ansgar, [801-865], Missionar bei den Wikingern \\/ Hannes Gamillscheg.\"],\"CK\":[\"000\"],\"CS\":[\"JXC 81-6 \"],\"CR\":[\"rc2ma\"],\"AY\":[\"0\"],\"AZ\":[\"C2CD\\r\"]}}"
    },
    {
        "id": 1707,
        "jobId": "fe6444c2-7a99-4c6e-9044-be9cc009526f",
        "success": true,
        "createdDate": "2018-02-05T14:51:32-05:00",
        "updatedDate": "2018-02-05T14:51:34-05:00",
        "itemBarcode": "33433005145002",
        "afMessage": null,
        "sip2Response": "{\"fixed\":{\"Ok\":\"1\",\"Resensitize\":\"Y\",\"Magnetic\":\"N\",\"Alert\":\"N\",\"TransactionDate\":\"201802050000145134\"},\"variable\":{\"Raw\":[\"AOnypl \",\"AB33433005145002\",\"AQrc2ma\",\"AJUDP : declaracin poltica de la UDP.\",\"CK000\",\"AF\",\"CSJFB 81-81 \",\"CRrc2ma\",\"CT     \",\"CV\",\"CY\",\"DA\",\"AY0\"],\"AO\":[\"nypl \"],\"AB\":[\"33433005145002\"],\"AQ\":[\"rc2ma\"],\"AJ\":[\"UDP : declaracin poltica de la UDP.\"],\"CK\":[\"000\"],\"CS\":[\"JFB 81-81 \"],\"CR\":[\"rc2ma\"],\"AY\":[\"0\"],\"AZ\":[\"D5EE\\r\"]}}"
    },
    {
        "id": 1706,
        "jobId": "23c05048-8b21-446b-a28e-694caa9acebc",
        "success": true,
        "createdDate": "2018-02-05T14:50:01-05:00",
        "updatedDate": "2018-02-05T14:50:03-05:00",
        "itemBarcode": "33433005144989",
        "afMessage": null,
        "sip2Response": "{\"fixed\":{\"Ok\":\"1\",\"Resensitize\":\"Y\",\"Magnetic\":\"N\",\"Alert\":\"N\",\"TransactionDate\":\"201802050000145003\"},\"variable\":{\"Raw\":[\"AOnypl \",\"AB33433005144989\",\"AQrc2ma\",\"AJSchiermonnikoog \\/ Tekst: Louise Mellma ; Foto's: Jan Heuff.\",\"CK000\",\"AF\",\"CSJFB 81-79 \",\"CRrc2ma\",\"CT     \",\"CV\",\"CY\",\"DA\",\"AY0\"],\"AO\":[\"nypl \"],\"AB\":[\"33433005144989\"],\"AQ\":[\"rc2ma\"],\"AJ\":[\"Schiermonnikoog \\/ Tekst: Louise Mellma ; Foto's: Jan Heuff.\"],\"CK\":[\"000\"],\"CS\":[\"JFB 81-79 \"],\"CR\":[\"rc2ma\"],\"AY\":[\"0\"],\"AZ\":[\"CD0F\\r\"]}}"
    },
    {
        "id": 1705,
        "jobId": "544f4351-d209-4498-97ca-2a1946ac4603",
        "success": true,
        "createdDate": "2018-02-05T14:49:51-05:00",
        "updatedDate": "2018-02-05T14:49:53-05:00",
        "itemBarcode": "33433005144989",
        "afMessage": null,
        "sip2Response": "{\"fixed\":{\"Ok\":\"1\",\"Resensitize\":\"Y\",\"Magnetic\":\"N\",\"Alert\":\"N\",\"TransactionDate\":\"201802050000144953\"},\"variable\":{\"Raw\":[\"AOnypl \",\"AB33433005144989\",\"AQrc2ma\",\"AJSchiermonnikoog \\/ Tekst: Louise Mellma ; Foto's: Jan Heuff.\",\"CK000\",\"AF\",\"CSJFB 81-79 \",\"CRrc2ma\",\"CT     \",\"CV\",\"CY\",\"DA\",\"AY0\"],\"AO\":[\"nypl \"],\"AB\":[\"33433005144989\"],\"AQ\":[\"rc2ma\"],\"AJ\":[\"Schiermonnikoog \\/ Tekst: Louise Mellma ; Foto's: Jan Heuff.\"],\"CK\":[\"000\"],\"CS\":[\"JFB 81-79 \"],\"CR\":[\"rc2ma\"],\"AY\":[\"0\"],\"AZ\":[\"CD02\\r\"]}}"
    },
    {
        "id": 1704,
        "jobId": "18207d92-892d-45e3-8336-272fa426a99a",
        "success": true,
        "createdDate": "2018-02-05T14:42:39-05:00",
        "updatedDate": "2018-02-05T14:42:40-05:00",
        "itemBarcode": "33433005145002",
        "afMessage": null,
        "sip2Response": "{\"fixed\":{\"Ok\":\"1\",\"Resensitize\":\"Y\",\"Magnetic\":\"N\",\"Alert\":\"N\",\"TransactionDate\":\"201802050000144240\"},\"variable\":{\"Raw\":[\"AOnypl \",\"AB33433005145002\",\"AQrc2ma\",\"AJUDP : declaracin poltica de la UDP.\",\"CK000\",\"AF\",\"CSJFB 81-81 \",\"CRrc2ma\",\"CT     \",\"CV\",\"CY\",\"DA\",\"AY0\"],\"AO\":[\"nypl \"],\"AB\":[\"33433005145002\"],\"AQ\":[\"rc2ma\"],\"AJ\":[\"UDP : declaracin poltica de la UDP.\"],\"CK\":[\"000\"],\"CS\":[\"JFB 81-81 \"],\"CR\":[\"rc2ma\"],\"AY\":[\"0\"],\"AZ\":[\"D5F1\\r\"]}}"
    },
    {
        "id": 1703,
        "jobId": "65e809dd-8e84-48e8-808b-7650981c3507",
        "success": true,
        "createdDate": "2018-02-05T14:40:15-05:00",
        "updatedDate": "2018-02-05T14:40:18-05:00",
        "itemBarcode": "33433013581933",
        "afMessage": null,
        "sip2Response": "{\"fixed\":{\"Ok\":\"1\",\"Resensitize\":\"Y\",\"Magnetic\":\"N\",\"Alert\":\"N\",\"TransactionDate\":\"201802050000144018\"},\"variable\":{\"Raw\":[\"AOnypl \",\"AB33433013581933\",\"AQrc2ma\",\"AJAlexander Hamilton. [v.1]. Youth to maturity, 1755-1788 \\/ by Broadus Mitchell.\",\"CK000\",\"AF\",\"CSK-10 6509 v. 1\",\"CRrc2ma\",\"CT     \",\"CV\",\"CY\",\"DA\",\"AY0\"],\"AO\":[\"nypl \"],\"AB\":[\"33433013581933\"],\"AQ\":[\"rc2ma\"],\"AJ\":[\"Alexander Hamilton. [v.1]. Youth to maturity, 1755-1788 \\/ by Broadus Mitchell.\"],\"CK\":[\"000\"],\"CS\":[\"K-10 6509 v. 1\"],\"CR\":[\"rc2ma\"],\"AY\":[\"0\"],\"AZ\":[\"C6DE\\r\"]}}"
    }
  ];

  return res.json({
    status: 200,
    count: 25,
    data: mockResponse
  });
}
