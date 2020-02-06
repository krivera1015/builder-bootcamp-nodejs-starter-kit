import { DynamoDB } from 'aws-sdk'
const magics = require('./magics');

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */

export const handler = async (event: any = {}): Promise<any> => {
  let response;
  try {
      const results = magics.canHave(event.pathParameters.data);
      if (!results) {
          response = {
              headers: { 'Access-Control-Allow-Origin': '*' },
              statusCode: 400,
          }
      } else {
          response = {
              headers: { 'Access-Control-Allow-Origin': '*' },
              statusCode: 200,
              body: JSON.stringify(results),
          }
      }
  } catch (err) {
      console.log(err)
      response = {
          headers: { 'Access-Control-Allow-Origin': '*' },
          statusCode: 500,
      }
  }
  return response
}