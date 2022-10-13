const axios = require("axios");

const {
  uniqueNamesGenerator,
  colors,
  animals,
  names,
  NumberDictionary
} = require('unique-names-generator');

// Load the AWS SDK
const AWS = require('aws-sdk');

const { v4: uuid } = require('uuid');

const region = "us-east-1",
      secretName = "WebDiplomacy-DEV-API-KEY";

const client = new AWS.SecretsManager({
  region: region
});

function getSecret() {
  return new Promise((resolve, reject) => {

    client.getSecretValue({SecretId: secretName}, function(err, data) {
      if (err) {
        reject(err);
        /*
          if (err.code === 'DecryptionFailureException')
          // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
          // Deal with the exception here, and/or rethrow at your discretion.
          throw err;
          else if (err.code === 'InternalServiceErrorException')
          // An error occurred on the server side.
          // Deal with the exception here, and/or rethrow at your discretion.
          throw err;
          else if (err.code === 'InvalidParameterException')
          // You provided an invalid value for a parameter.
          // Deal with the exception here, and/or rethrow at your discretion.
          throw err;
          else if (err.code === 'InvalidRequestException')
          // You provided a parameter value that is not valid for the current state of the resource.
          // Deal with the exception here, and/or rethrow at your discretion.
          throw err;
          else if (err.code === 'ResourceNotFoundException')
          // We can't find the resource that you asked for.
          // Deal with the exception here, and/or rethrow at your discretion.
          throw err;
        */
      }
      else {
        // Decrypts secret using the associated KMS key.
        // Depending on whether the secret is a string or binary, one of these fields will be populated.
        let secret;
        if ('SecretString' in data) {
          secret = data.SecretString;
        } else {
          let buff = new Buffer(data.SecretBinary, 'base64');
          secret = buff.toString('ascii');
        }

        console.log("this is the secret received:", secret);
        console.log("this is the type of the secret received:", typeof secret);

        resolve(secret);
      }
    });

  });
}


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


async function createUser(event, context, callback) {

  console.log(`EVENT: ${JSON.stringify(event)}`);

  // Stage|Prod:
  const key = await getSecret();
  // Local DEV key:
  // process.env.WEB_DIPLOMACY_DEV_SYSTEM_API_KEY;

  console.log("key", key);

  // for api to consume, secret system-level token added with SU to app DB
  const headers = {
    "Authorization": `Bearer ${key}`
  };

  // Generate the username for the players to use
  const username=generateUsername();
  // We'll never recall or know this password
  const password=uuid();

  let email="";
  if (event?.request?.userAttributes?.email) {
    console.log("Have email on request attribute");
    email = event?.request?.userAttributes?.email;
  } else {
    return {
      statusCode: 401,
      //  Uncomment below to enable CORS requests
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
      },
      body: JSON.stringify({
        message: "Unauthorized. No email attribute found in event."
      }),
    };
  }

  const url = `${apiPath}player/create&username=${username}&password=${password}&email=${email}`;

  console.log("url", url);

  try {
    const result = await axios.get(url, {
      headers
    });

    console.log("Axios result:", result);

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
      body: JSON.stringify({
        message: "Success"
      }),
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
      body: JSON.stringify({
        message: "Failed to update user. Create User App DB failed."
      }),
    };
  }

};


/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = createUser;


function test_main() {
  const mockEvent = {"mocked": true};

  createUser(mockEvent)

    .then(respose => {
      // console.log("Got response", response);
    });
}

// test_main();

