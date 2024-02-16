import { CreateTaggedBuildController } from "./controller/taggedbuild.controller";

export const run = async (): Promise<void> => {
  const newTag = process.env.GITHUB_REF_NAME;
  if (newTag === undefined) {
    console.error(
      "Couldn't determine what the new tag is. This action should only be triggered when a new tag is pushed to the repository.",
    );
    return;
  }

  const controller: CreateTaggedBuildController =
    new CreateTaggedBuildController();

  return await controller.createTaggedBuild(newTag);
};

run();
