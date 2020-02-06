'use strict';

//import { integer } from "aws-sdk/clients/cloudfront";

const magicRepository = require('./magicRepository');

const AWS = require('aws-sdk');
const config = {
    region: 'us-east-1',
    endpoint: 'https://dynamodb.us-east-1.amazonaws.com'
};

var dynamoDB = new AWS.DynamoDB(config);
var magicList = [];

// const params = {
//     TableName: 'data-table',
//     Key: {
//         data: event.pathParameters.data
//     }
// };

async function canHave(playerid) {
    console.log('Starting data retrieval');
    var playerinfo;
    await magicRepository.getPlayerInfo(playerid).then((result) => {
        playerinfo = result;
        console.log('Got player data', result);
    });

    var magicInfo;
    await magicRepository.getMagicList().then((result) => {
        magicInfo = result;
        console.log('Got magic data', result.length);
    });

    var magicList = await generateAllowedMagicList(playerinfo, magicInfo);
    magicList.forEach(m => {
        console.log("Magic Id: " + m.magicid + " Magic Name: " + m.magicName);
    });
    return magicList;
}

async function generateAllowedMagicList(pInfo, mList) {
    console.log('Starting generation');

    var magicList = [];
    //console.log('pInfo', pInfo);

    if (pInfo == 'undefined' || pInfo == null ||
        mList == 'undefined' || mList.length == 0) return;

    var playerInfo = pInfo.Item;
    playerInfo.items.forEach(currentItemOfPlayer => {
        var magicItem = {
            magicid: 0,
            magicName: ''
        };

        mList.forEach(function (magic) {
            //console.log(playerInfo.experience, magic.experience_required);
            if (playerInfo.experience >= magic.experience_required) {
                var allMatches = false;

                for (var i = 0; i < magic.magic_items.length; i++) {
                    var itemReqForMagic = magic.magic_items[i];
                    //magic.magic_items.forEach(itemReqForMagic => {
                    if (currentItemOfPlayer.item_id == itemReqForMagic.item_id &&
                        currentItemOfPlayer.item_count >= itemReqForMagic.item_count) {
                        allMatches = true;
                    } else {
                        allMatches = false;
                        break;
                        /////
                    }

                    if (allMatches) {
                        magicItem.magicid = magic.magicid;
                        magicItem.magicName = magic.magic_name;

                        magicList.push(magicItem);
                    }
                }
                //});
            }
        });

    });
    return magicList;
}

module.exports = {
    canHave
};