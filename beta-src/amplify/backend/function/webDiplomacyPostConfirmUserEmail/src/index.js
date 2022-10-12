const axios = require("axios");

const {
  uniqueNamesGenerator,
  colors,
  animals,
  names,
  NumberDictionary
} = require('unique-names-generator');

const { v4: uuid } = require('uuid');


const generateUsername = () => {
  const numberDictionary = NumberDictionary.generate({ min: 0, max: 124 });

  return uniqueNamesGenerator({
    dictionaries: [colors, animals, numberDictionary],
    style: 'capital',
    separator: ''
  });
};

const DEV_PATH = "http://localhost:80/api.php?route=";

const apiPath = DEV_PATH;


async function createUser(event) {

  console.log(`EVENT: ${JSON.stringify(event)}`);

  // TODO this needs to probably come from AWS secrets
  const key = process.env.WEB_DIPLOMACY_SYSTEM_API_KEY;

  console.log("key", key);

  // for api to consume, secret system-level token added with SU to app DB
  const headers = {
    "Authorization": `Bearer ${key}`
  };

  // Generate the username for the players to use
  const username=generateUsername();
  // We'll never recall or know this password
  const password=uuid();

  const url = `${apiPath}player/create&username=${username}&password=${password}`;

  console.log("url", url);

  try {
    const result = await axios.get(url, {
      headers
    });

    const { response } = result;

    console.log("Data", result.data);
    console.log("Status", result.status);

    return {
      statusCode: 200,
      //  Uncomment below to enable CORS requests
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
      },
      body: JSON.stringify('Done!'),
    };

  } catch(e) {
    console.log("Axios call failed");

    console.log(e?.request?.method);
    console.log(e?.request?._header);
    console.log(e?.response);

    return {
      statusCode: 400,
      //  Uncomment below to enable CORS requests
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
      },
      body: JSON.stringify('Failed!'),
    };
  }

};


/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = createUser;


function test_main() {
  const mockEvent = {};

  createUser(mockEvent)

    .then(respose => {
      // console.log("Got response", response);
    });
}

test_main();
