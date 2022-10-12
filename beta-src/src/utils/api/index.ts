import axios, { AxiosResponse } from "axios";
import { Auth } from "aws-amplify";
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

const api = axios.create({
  // headers: {
  //   "Content-Type": "multipart/form-data",
  // },
});

async function getToken() {
  const user = await Auth.currentAuthenticatedUser();

  console.log("user", user);

  const token = user.signInUserSession.idToken.jwtToken;

  console.log("temp log Token:", token);

  return token;
}

export const getGameApiRequest = (
  route: ApiRoute,
  queryParams: QueryParams,
  timeout?: number,
): Promise<AxiosResponse> => {
  async function getRequest() {

    const token = await getToken();

    return api.get(`../api.php?route=${route}&${buildQueryString(queryParams)}`, {
      timeout,
      headers: {
        "IdToken": token
      }
    });
  }

  return getRequest();
}

export const postGameApiRequest = (
  route: ApiRoute,
  json: QueryParams,
  timeout?: number,
): Promise<AxiosResponse> =>
  {
  async function postRequest() {

    const token = await getToken();

    return api.post(`../api.php?route=${route}`, json, {
      timeout,
      headers: {
        "IdToken": token
      }
    });
  }

  return postRequest();
}

const orderSubmission = axios.create({
  // headers: {
  //   "Content-Type": "application/x-www-form-urlencoded",
  // },
});

export const submitOrders = (
  orders,
  queryParams: QueryParams = {},
): Promise<AxiosResponse> => {

  async function submitRequest() {
    const token = await getToken();

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "IdToken": token
      }
    };

    if (Object.keys(queryParams).length) {
      return orderSubmission.post(
        `../ajax.php?${buildQueryString(queryParams)}`,
        orders,
        config
      );
    }

    return orderSubmission.post(`../ajax.php`, orders, config);
  }

  return submitRequest();

};
