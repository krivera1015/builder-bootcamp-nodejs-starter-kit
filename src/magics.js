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
    //console.log('Starting data retrieval');
    var playerinfo;
    await magicRepository.getPlayerInfo(playerid).then((result) => {
        playerinfo = result;
        //console.log('Got player data', result);
    });

    var magicInfo;
    await magicRepository.getMagicList().then((result) => {
        magicInfo = result;
        //console.log('Got magic data', result.length);
    });

    var magicList = await generateAllowedMagicList(playerinfo, magicInfo);
    magicList.forEach(m => {
        console.log("PlayerId: " + m.playerid + " Magic Id: " + m.magicid + " Magic Name: " + m.magicName);
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

    for (var i = 0; i < mList.length; i++) {
        var allItemsFound = false;
        var magic = mList[i];
        var magicItem = {
            playerid: 0,
            magicid: 0,
            magicName: ''
        };

        if (playerInfo.experience < magic.experience_required) {
            continue;
        }

        var itemFound = false;
        for (var k = 0; k < magic.magic_items.length; k++) {
            var itemReqForMagic = magic.magic_items[k];
            
            for (var j = 0; j < playerInfo.items.length; j++) {
                var currentItemOfPlayer = playerInfo.items[j];
                itemFound = false;

                //magic.magic_items.forEach(itemReqForMagic => {
                if (currentItemOfPlayer.item_id == itemReqForMagic.item_id &&
                    currentItemOfPlayer.item_count >= itemReqForMagic.item_count) {
                    console.log('Data values:', currentItemOfPlayer, itemReqForMagic);
                    itemFound = true;

                    magicItem.playerid = playerInfo.playerid;
                    magicItem.magicid = magic.magicid;
                    magicItem.magicName = magic.magic_name;
                    break;
                } else {
                    itemFound = false;
                    console.log('item not found');
                }
                //});
            }
        });

            if (itemFound) {
                console.log('item is found');
                allItemsFound = true;
            } else {
                //console.log('item is not found');
                //allItemsFound = false;
            }
        }
        if (itemFound && allItemsFound) {
            console.log('all items are found');
            magicList.push(magicItem);
        }
    }
    return magicList;
}

module.exports = {
    canHave
};