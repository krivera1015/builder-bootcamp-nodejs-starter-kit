//'use strict';
const dataProvider = require('./datamanager');

/****** (PARAMS) - Table Name  */
var playerTablename = 'player';
var magicTableName = 'magic';

/**************************** */

/********* Query strcutures for all the tables */
// var playerQuery = {
//   TableName: playerTablename,
//   ProjectionExpression: '#playerid, experience, #items',
//   ExpressionAttributeNames: {
//     "#playerid": "playerid",
//     "#items": "items"
//   },
//   FilterExpression: "#playerid = :pId",
//   ExpressionAttributeValues: {
//     ":pId": {
//       "N": "1"
//     }
//   }
//   //TableName: program.table,
//   //Limit: 1000
// };

var magicQuery = {
  TableName: magicTableName,
  ProjectionExpression: 'magicid, magic_name, experience_required, magic_items',
};

async function getPlayerInfo(playerid) {
  // playerQuery.Key = {
  //   "playerid": playerid
  // };

  const playerQuery = {
    TableName: playerTablename,
    Key: {
      "playerid": playerid
    },
    ProjectionExpression: '#playerid, experience, #itemList',
    ExpressionAttributeNames: {
      "#playerid": "playerid",
      "#itemList": "items"
    },
    // FilterExpression: "#playerid = :pId",
    // ExpressionAttributeValues: {
    //   ":pId": {
    //     "N": "1"
    //   }
    // }
    //TableName: program.table,
    //Limit: 1000
  };


  return await dataProvider.queryTable(playerQuery, 'player');
}

async function getMagicList() {
  return await dataProvider.scanTable(magicQuery);
}

module.exports = {
  getPlayerInfo,
  getMagicList
};