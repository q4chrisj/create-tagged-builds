import * as dotenv from "dotenv";
dotenv.config();

export type Config = {
  TeamCityToken: string;
  TeamCityUrl: string;
};

export const config: Config = {
  TeamCityToken: process.env.TC_TOKEN || "",
  TeamCityUrl: process.env.TC_URL || "",
};
