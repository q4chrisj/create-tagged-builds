import axios from "axios";
import { Config, getConfig } from "./config";

const config: Config = getConfig();

console.log(config);

const teamCityToken: string = config.TeamCityToken;
const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: `Bearer ${teamCityToken}`,
};

export const get = async <T>(path: string): Promise<T> => {
  const requestUri = config.TeamCityUri.concat(path);
  const result: T = await axios
    .get(requestUri, {
      headers: headers,
    })
    .then((r) => {
      return r.data;
    });

  return result;
};

export const post = async <T>(
  path: string,
  body: string,
  contentType?: string,
): Promise<T> => {
  if (contentType) {
    headers["Content-Type"] = contentType;
  }
  const requestUri = config.TeamCityUri.concat(path);
  const result: T = await axios
    .post(requestUri, body, {
      headers: headers,
    })
    .then((r) => {
      return r.data;
    })
    .catch((err) => {
      console.log("");
      console.log(err.response.data);
    });

  return result;
};
export const put = async <T>(
  path: string,
  body: string,
  contentType?: string,
): Promise<T> => {
  let specialHeaders;
  if (contentType) {
    specialHeaders = {
      ...headers,
      "Content-Type": contentType,
      Accept: contentType,
    };
  }
  const requestUri = config.TeamCityUri.concat(path);
  const result: T = await axios
    .put(requestUri, body, {
      headers: specialHeaders || headers,
    })
    .then((r) => {
      return r.data;
    })
    .catch((err) => {
      console.log("");
      console.log(err.response.data);
    });

  return result;
};
