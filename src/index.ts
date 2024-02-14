import * as core from "@actions/core";
import {
  createNewProject,
  getMostRecentProject,
  triggerBuild,
  updateProjectParameters,
} from "./index.helpers";
import { Parameter, Project, UpdateParameters } from "./model";
import { Config, getConfig } from "./config";

export const run = async (): Promise<void> => {
  const newTag = process.env.GITHUB_REF_NAME;
  if (newTag === undefined) {
    console.error("Couldn't determine what the new tag is");
    return;
  }

  const TEAM_CITY_URI = core.getInput("team_city_uri");
  if (TEAM_CITY_URI === "") {
    console.error("The team_city_uri must be passed into the action.");
    return;
  }
  const TEAM_CITY_TOKEN = core.getInput("team_city_token");
  if (TEAM_CITY_TOKEN === "") {
    console.error("The TEAM_CITY_TOKEN must be passed into the action.");
    return;
  }

  const TEAM_CITY_PROJECT = core.getInput("team_city_project");
  if (TEAM_CITY_PROJECT === "") {
    console.error("The TEAM_CITY_PROJECT must be passed into the action.");
    return;
  }

  const config: Config = getConfig(
    TEAM_CITY_URI,
    TEAM_CITY_TOKEN,
    TEAM_CITY_PROJECT,
  );

  const newProjectName: string = newTag;
  const newProjectParentProjectId: string = config.TeamCityProject;
  const mostRecentProject = await getMostRecentProject(
    newProjectParentProjectId,
  );
  console.log(
    `Copying ${mostRecentProject?.name} to create the new project ${newProjectName}.`,
  );

  const createResult: Project | undefined = await createNewProject(
    newProjectName,
    newProjectParentProjectId,
    mostRecentProject!.id,
  );

  if (!createResult) {
    console.log(`Project ${newProjectName} was NOT created`);
    return;
  }

  console.log(`New Project ${createResult.name} created.\n`);

  // figure out which parameters for the new project need to be updated.
  const paramsToUpdate: Array<Parameter> = [];
  paramsToUpdate.push({ name: "env.version", value: newTag });

  createResult.parameters.property.forEach((p) => {
    if (p.name.includes("system.GitDefaultBranch-"))
      paramsToUpdate.push({ name: p.name, value: `tags/${newTag}` });
  });

  const paramUpdates: UpdateParameters = {
    parameters: [],
  };

  for (const param of paramsToUpdate) {
    paramUpdates.parameters.push(param);
  }

  console.log("Updating new projects parameters.");
  await updateProjectParameters(createResult.id, paramUpdates);

  // trigger the builds
  console.log(`\nTriggering builds for new project ${createResult.name}`);
  const validBuildTypeNames = ["Public CI", "Admin CI", "Preview CI", "CI"];
  for (const buildType of createResult.buildTypes.buildType) {
    if (validBuildTypeNames.includes(buildType.name)) {
      console.log(` - Triggering build for ${buildType.name}`);
      await triggerBuild(buildType.id);
    }
  }

  return;
};

run();
