import { map } from 'lodash';
import React from 'react';

/**
* @desc Renders the rows of the table to display refile errors.
*/
export function modelRefileErrorResponse(data) {
  const modeledData = [];

  if (data && data.length) {
    map(data, (item, i) => {
      const afMessageArray = (item.afMessage) ? JSON.parse(item.afMessage) : [];
      const afMessages = (afMessageArray.length) ?
        map(
          afMessageArray,
          (message, n) => <span className="af-message" key={n}>{message}</span>
        ) : null;

      let isNyplItem = 'yes';

      const sip2Response = (item.sip2Response) ? JSON.parse(item.sip2Response) : null;
      const CR = (sip2Response && sip2Response.variable.CR && sip2Response.variable.CR.length) ?
        sip2Response.variable.CR[0].trim() : undefined;

      if (CR === 'os') {
        isNyplItem = 'no';
      }

      modeledData.push(
        <tr key={i}>
          <td>{item.id}</td>
          <th className="barcode-th">{item.itemBarcode}</th>
          <td>{(item.updatedDate) ? item.createdDate.split('T')[0] : ''}</td>
          <td>{(item.updatedDate) ? item.updatedDate.split('T')[0] : ''}</td>
          <td className="af-message-td">{afMessages}</td>
          <td>{isNyplItem}</td>
        </tr>
      );
    });
  }

  return modeledData;
}
