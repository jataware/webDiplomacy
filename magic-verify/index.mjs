

import { CognitoJwtVerifier } from "aws-jwt-verify";
import { program } from "commander";

// console.log('process.version', process.version);

// ========= CLI ARGS PARSER

program
  .version('0.1.0', '-v, --version')
  .usage('[OPTIONS]...')
  .option('-t, --token <value>', 'jwt token to parse and return e-mail from.', '')
  .option('-a, --access', 'Opt-in toggle to validate an access token instead of default id one.');

program.parse(); // handles process.argv

const options = program.opts();

const tokenTarget = options.token;

if (!tokenTarget) {
  console.error("Please provide a valid string jwt token with -t or --token", tokenTarget);
  process.exit(-1);
}


// ========= JWT PARSER

// Verifier that expects valid access/id tokens
// TODO dev pool/client values hardcoded. Need to change for prod.
const verifier = CognitoJwtVerifier.create({
  // TODO These two need to come from environment/secrets both for staging and production
  //      or event token
  userPoolId: "us-east-1_eYqVwyTwi",
  tokenUse: options.access ? "access" : "id",
  clientId: "4eok31qvrn3a9p7sadlqhis6cl",
});

async function verify() {
  try {
    const payload = await verifier.verify(tokenTarget);

    // TODO access untested but we'll need it, try it out soon
    if (options.access) {
      return {
        result: "valid"
      };
    } else {
      const {email, email_verified} = payload;

      return {
        email,
        verified: email_verified,
        id: payload.sub,
        irb: payload['custom:accepted-terms-at']
      };
    }

  } catch (e) {
    console.error("Token not valid!");
  }
};

verify()
  .then((userInfo) => {
    if(userInfo) {
      console.log(JSON.stringify(userInfo));
    }
    process.exit(0);
  });
