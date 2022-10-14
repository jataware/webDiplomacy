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

const DEV_PATH = "http://dev.diplomacy.jata.lol/api.php?route=";
// TODO modify for dev/prod.
const apiPath = DEV_PATH;

/**
 *
 **/
async function createUser(event, context, callback) {

  console.log(`EVENT: ${JSON.stringify(event)}`);
  console.log("context:", context);

  // Stage|Prod:
  const parameters = await getAPIKey();
  const key = parameters[0].Value;
  // Local DEV key:
  // process.env.WEB_DIPLOMACY_DEV_SYSTEM_API_KEY;

  const headers = {
    "Authorization": `Bearer ${key}`
  };

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

  const url = `${apiPath}player/create&username=${username}&password=${password}&email=${email}`;
  console.log("url", url);

  try {
    const result = await axios.get(url, {
      headers
    });

    const { response } = result;
    console.log("Data", result.data);
    console.log("Status", result.status);

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
        "email": "testmainemail@localnodedev.com",
        "email_verified": true
      }
    },
    "response": {}
  };

  createUser(mockEvent)

    .then(respose => {
      console.log("Got response", response);
    });
}

// test_main();
