import * as core from "@actions/core";

export type Config = {
  TeamCityToken: string;
  TeamCityUri: string;
  TeamCityProject: string;
  GithubAccessToken: string;
};

export const config: Config = {
  TeamCityUri:
    core.getInput("team_city_uri") ||
    "The TEAM_CITY_URI must be passed into the action",
  TeamCityToken:
    core.getInput("team_city_token") ||
    "The TEAM_CITY_TOKEN must be passed into the action",
  TeamCityProject:
    core.getInput("team_city_project") ||
    "The TEAM_CITY_PROJECT must be passed into the action",
  GithubAccessToken:
    core.getInput("gh_access_token") ||
    "The GITHUB_ACCEESS_TOKEN must be pass into the action",
};
