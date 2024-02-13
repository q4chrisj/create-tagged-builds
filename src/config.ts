import * as dotenv from "dotenv";
dotenv.config();

export type Config = {
  TeamCityToken: string;
  TeamCityUri: string;
  TeamCityProject: string;
};

export const config: Config = {
  TeamCityToken: process.env.TC_TOKEN || "",
  TeamCityUri: process.env.TC_URL || "",
  TeamCityProject: "",
};

export const getConfig = (
  teamCityUri: string,
  teamCityToken: string,
  teamCityProject: string,
): Config => {
  const config: Config = {
    TeamCityUri: teamCityUri,
    TeamCityToken: teamCityToken,
    TeamCityProject: teamCityProject,
  };
  return config;
};
