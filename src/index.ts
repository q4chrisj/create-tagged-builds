import { CreateTaggedBuildController } from "./controller/createTaggedBuild";
import { GithubService } from "./services/github.service";

export const run = async (): Promise<void> => {
  const newTag = process.env.GITHUB_REF_NAME;
  if (newTag === undefined) {
    console.error(
      "Couldn't determine what the new tag is. This action should only be triggered when a new tag is pushed to the repository.",
    );
    return;
  }

  // const githubService = new GithubService();
  // const latestGoTagName =
  //   await githubService.getLatestTagName("Q4Web-Q4Orion-Go");
  //
  // console.log(latestGoTagName);

  const controller: CreateTaggedBuildController =
    new CreateTaggedBuildController();

  return await controller.createTaggedBuild(newTag);
};

run();
