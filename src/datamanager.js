'use strict';

const AWS = require('aws-sdk');
const config = {
    region: 'us-east-1',
    //endpoint: 'https://dynamodb.us-east-1.amazonaws.com'
};
var dynamoDBClient = new AWS.DynamoDB.DocumentClient(config);

async function queryTable(query) {
  const items = await dynamoDBClient.get(query).promise();
  return items;
}

async function scanTable(query, tablename) {
  let lastEvaluatedKey = 'dummy'; // string must not be empty
  const itemsAll = [];
  while (lastEvaluatedKey) {
    //console.log('Fetching ' + tablename + ' data....');
    const data = await dynamoDBClient.scan(query).promise();
    itemsAll.push(...data.Items);
    lastEvaluatedKey = data.LastEvaluatedKey;
    if (lastEvaluatedKey) {
      query.ExclusiveStartKey = lastEvaluatedKey;
    }
  }
  return itemsAll;
}

/**************************** */

module.exports = {
  queryTable,
  scanTable
};