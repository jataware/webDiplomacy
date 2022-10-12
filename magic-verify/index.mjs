

import { CognitoJwtVerifier } from "aws-jwt-verify";
import { program } from "commander";

console.log('process.version', process.version);

// ========= CLI ARGS PARSER

program
  .version('0.1.0', '-v, --version')
  .usage('[OPTIONS]...')
  .option('-t, --token <value>', 'jwt token to parse and return e-mail from.', '');

program.parse(); // process.argv

const options = program.opts();

const idToken = options.token;

if (!idToken) {
  console.error("Please provide a valid string jwt token with -t or --token", idToken);
  process.exit(-1);
}


// ========= JWT PARSER

// Verifier that expects valid access/id tokens
// TODO dev pool/client values hardcoded. Need to change for prod.
const verifier = CognitoJwtVerifier.create({
  userPoolId: "us-east-1_eYqVwyTwi",
  tokenUse: "id",
  clientId: "4eok31qvrn3a9p7sadlqhis6cl",
});

async function verify() {
  try {
    const payload = await verifier.verify(idToken);
    const {email, email_verified} = payload;

    return {
      email,
      verified: email_verified,
      id: payload.sub,
      irb: payload['custom:accepted-terms-at']
    };

  } catch (e) {
    console.error("Token not valid!");
  }
};

verify()
  .then((userInfo) => {
    if(userInfo) {
      console.log(userInfo);
    }
    process.exit(0);
  });
