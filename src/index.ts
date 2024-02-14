// import {
//   createNewProject,
//   getMostRecentProject,
//   triggerBuild,
//   updateProjectParameters,
// } from "./index.helpers";
// import { Parameter, Project, UpdateParameters } from "./model";
import { Config, getConfig } from "./config";

export const config: Config = getConfig();
export const run = async (): Promise<void> => {
  const newTag = process.env.GITHUB_REF_NAME;
  if (newTag === undefined) {
    console.error("Couldn't determine what the new tag is");
    return;
  }

  console.log(
    `Creating tagged build for ${config.TeamCityProject} using tag ${newTag}`,
  );
  // const newProjectName: string = newTag;
  // const newProjectParentProjectId: string = config.TeamCityProject;
  // const mostRecentProject = await getMostRecentProject(
  //   newProjectParentProjectId,
  // );
  // console.log(
  //   `Copying ${mostRecentProject?.name} to create the new project ${newProjectName}.`,
  // );
  //
  // const createResult: Project | undefined = await createNewProject(
  //   newProjectName,
  //   newProjectParentProjectId,
  //   mostRecentProject!.id,
  // );
  //
  // if (!createResult) {
  //   console.error(` - Project ${newProjectName} was NOT created`);
  //   return;
  // }
  //
  // console.log(` - New Project ${createResult.name} created.\n`);
  //
  // // figure out which parameters for the new project need to be updated.
  // const paramsToUpdate: Array<Parameter> = [];
  // paramsToUpdate.push({ name: "env.version", value: newTag });
  //
  // createResult.parameters.property.forEach((p) => {
  //   if (p.name.includes("system.GitDefaultBranch-"))
  //     paramsToUpdate.push({ name: p.name, value: `tags/${newTag}` });
  // });
  //
  // const paramUpdates: UpdateParameters = {
  //   parameters: [],
  // };
  //
  // for (const param of paramsToUpdate) {
  //   paramUpdates.parameters.push(param);
  // }
  //
  // console.log("Updating new projects parameters.");
  // await updateProjectParameters(createResult.id, paramUpdates);
  //
  // // trigger the builds
  // console.log(`\nTriggering builds for new project ${createResult.name}`);
  // const validBuildTypeNames = ["Public CI", "Admin CI", "Preview CI", "CI"];
  // for (const buildType of createResult.buildTypes.buildType) {
  //   if (validBuildTypeNames.includes(buildType.name)) {
  //     console.log(` - Triggering build for ${buildType.name}`);
  //     await triggerBuild(buildType.id);
  //   }
  // }
  //
  return;
};

run();
