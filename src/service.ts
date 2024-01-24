import axios from "axios";
import { config } from "./config";

const teamCityToken: string = config.TeamCityToken;
const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: `Bearer ${teamCityToken}`,
};

export const get = async <T>(path: string): Promise<T> => {
  const requestUri = config.TeamCityUrl.concat(path);
  const result: T = await axios
    .get(requestUri, {
      headers: headers,
    })
    .then((r) => {
      return r.data;
    });

  return result;
};

export const post = async <T>(path: string, body: string): Promise<T> => {
  console.log(body);
  const requestUri = config.TeamCityUrl.concat(path);
  const result: T = await axios
    .post(requestUri, body, {
      headers: headers,
    })
    .then((r) => {
      return r.data;
    })
    .catch((err) => {
      console.log(`An error occured: ${err.message} - ${err.data}`);
    });

  return result;
};
