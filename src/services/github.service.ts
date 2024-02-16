import * as github from "@actions/github";
import { config } from "../config";
import { GITHUB_ORGANIZATION } from "./github.service.definition";

export class GithubService {
  private _octokit = github.getOctokit(config.GithubAccessToken);

  getLatestTagName = async (repoName: string): Promise<string> => {
    const tags = await this._octokit.rest.repos.listTags({
      owner: GITHUB_ORGANIZATION,
      repo: repoName,
    });

    return tags.data[0].name;
  };
}
