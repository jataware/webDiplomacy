import axios, { AxiosResponse } from "axios";
// import { API, Auth } from "aws-amplify";
import ApiRoute from "../../enums/ApiRoute";

export type QueryParams = {
  [key: string]: string;
};

const buildQueryString = (params: QueryParams): string =>
  Object.entries(params)
    .filter(([key, value]) => typeof value !== "undefined")
    .reduce((keyValuePairs: string[], [key, value]) => {
      if (value) {
        keyValuePairs.push(`${encodeURI(key)}=${encodeURI(value)}`);
      }
      return keyValuePairs;
    }, [])
    .join("&");


// TODO We'll actually change this to a promise at runtime using API/Auth, but for now need o figure this out...
// Should work once user authenticated, but not when starting from logged out state
// we'll actually probably use the jwt token as api key... as thats not permanent like user id
const lastUserId = localStorage.getItem("CognitoIdentityServiceProvider.4eok31qvrn3a9p7sadlqhis6cl.LastAuthUser");

// TODO add Authorization header using bearer from AWS or so in order to
// compare to API key in database to make requests, once authenticated
const api = axios.create({
  // why do we need multipart form-data?
  headers: {
    Authorization: `Bearer ${lastUserId}`
    // "Content-Type": "multipart/form-data",
  },
});

// async function getAuthAPIHeaders() {
//   const user = await Auth.currentAuthenticatedUser();

//   // TODO we really only need the API key, not the jwt token
//   const token = user.signInUserSession.idToken.jwtToken;

//   // TODO hardcoded for now
//   const API_KEY = "";

//   const requestInfo = {
//     headers: {
//       Authorization: `Bearer ${API_KEY}`
//     }
//   };

//   return requestInfo;

// }


export const getGameApiRequest = (
  route: ApiRoute,
  queryParams: QueryParams,
  timeout?: number,
): Promise<AxiosResponse> =>
  api.get(`../api.php?route=${route}&${buildQueryString(queryParams)}`, {
    timeout,
    // ...getAuthAPIHeaders() // TODO this returns a promise right now can piggyback on axios promise returned
  });

export const postGameApiRequest = (
  route: ApiRoute,
  json: QueryParams,
  timeout?: number,
): Promise<AxiosResponse> =>
  api.post(`../api.php?route=${route}`, json, {
    timeout,
    // ...getAuthAPIHeaders() // TODO this returns promise.. check
  });

const orderSubmission = axios.create({
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: `Bearer ${lastUserId}`
  },
});

export const submitOrders = (
  orders,
  queryParams: QueryParams = {},
): Promise<AxiosResponse> => {
  // console.log({ submittedOrders: orders });
  if (Object.keys(queryParams).length) {
    return orderSubmission.post(
      `../ajax.php?${buildQueryString(queryParams)}`,
      orders,
      // getAuthAPIHeaders()
    );
  }
  return orderSubmission.post(`../ajax.php`, orders, // getAuthAPIHeaders()
                             );
};
