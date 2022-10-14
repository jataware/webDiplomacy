const axios = require("axios");

const {
  uniqueNamesGenerator,
  colors,
  animals,
  NumberDictionary
} = require('unique-names-generator');

const aws = require('aws-sdk');

const { v4: uuid } = require('uuid');

/**
 *
 **/
async function getAPIKey() {
  const { Parameters } = await (new aws.SSM())
        .getParameters({
          Names: ["WebDiplomacy_DEV_API_KEY"].map(secretName => process.env[secretName]),
          WithDecryption: true,
        })
        .promise();

  return Parameters;
}

/**
 *
 **/
const generateUsername = () => {
  const numberDictionary = NumberDictionary.generate({ min: 0, max: 124 });

  return uniqueNamesGenerator({
    dictionaries: [colors, animals, numberDictionary],
    style: 'capital',
    separator: ''
  });
};

const DEV_PATH = "http://localhost/api.php?route="; // Use as apiPath during local dev
const apiPath = `https://${process.env.API_HOST}/api.php?route=`;

const isLocal = !!process.env.WEB_DIPLOMACY_DEV_SYSTEM_API_KEY;

/**
 *
 **/
async function createUser(event, context, callback) {

  console.log(`EVENT: ${JSON.stringify(event)}`);
  console.log("context:", context);

  console.log("Lambda updated to version Oct 14, 3:18pm");

  let key="";

  if (isLocal) {
    key=process.env.WEB_DIPLOMACY_DEV_SYSTEM_API_KEY;
  } else {
    // Stage|Prod:
    const parameters = await getAPIKey();
    key = parameters[0].Value;
  }

  const config = {
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${key}`,
    },
  };

  console.log('config', config);

  // Generate the username for the players to use
  const username=generateUsername();
  // We'll never recall or know this password
  const password=uuid();

  let email="";
  if (event?.request?.userAttributes?.email) {
    console.log("We have an email on request attribute.");
    email = event?.request?.userAttributes?.email;
  } else {
    throw new Error("Unauthorized. No email attribute found");
  }

  let url = `${apiPath}player/create&username=${username}&password=${password}&email=${email}`;

  // if (isLocal) {
  //   url = `${DEV_PATH}player/create&username=${username}&password=${password}&email=${email}`;
  // }

  console.log("url", url);

  try {
    const result = await axios.get(`${url}`, config);

    console.log("result", result);

    callback(null, event);

  } catch(e) {
    console.log("Axios call failed");
    console.log(e);

    throw new Error("WebDiplomacy API unavailable. Unable to complete sign up");
  }

};


/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = createUser;


/**
 * During local development: call this script with `node index.js` and run
 * this function. Mock anything else related to AWS.
 **/
function test_main() {
  const mockEvent = {
    "request": {
      "userAttributes": {
        "email": "lastdestmainemail@localnodedev.com",
        "email_verified": true
      }
    },
    "response": {}
  };

  createUser(mockEvent, {}, () => {console.log('Done calling axios');});
}

if (isLocal) {
  test_main();
}
