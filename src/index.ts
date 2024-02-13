import fs from "fs";
import * as core from "@actions/core";
import {
  createNewProject,
  getMostRecentProject,
  getProject,
  triggerBuild,
  updateProjectParameters,
} from "./index.helpers";
import { Project, UpdateParameters } from "./model";
import { Config, getConfig } from "./config";

export const run = async (): Promise<void> => {
  const newTag = process.env.GITHUB_REF_NAME;

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

  const newProjectName: string | undefined = newTag; // this would be based off the tag from github
  const newProjectParentProjectId: string = config.TeamCityProject; // this would have to be dynamic in some way
  const mostRecentProject = await getMostRecentProject(
    newProjectParentProjectId,
  );
  console.log(
    `Copying ${mostRecentProject?.name} to create the new project ${newProjectName}.`,
  );

  /*
  const latestFoundationTag: string = "v2.115.0"; // this would normally come from a github api call
  const latestGoServicetag: string = "v2.67.0"; // this would normally come from a github api call

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

  // update new project dependency parameters
  const paramUpdates: UpdateParameters = {
    parameters: [
      {
        name: "system.GitDefaultBranch-Q4Manhattan",
        value: `tags/${newProjectName}`,
      },
      {
        name: "system.GitDefaultBranch-Q4Orion-Go",
        value: `tags/${latestGoServicetag}`,
      },
      {
        name: "system.GitDefaultBranch-Q4Foundation",
        value: `tags/${latestFoundationTag}`,
      },
      {
        name: "env.version",
        value: `${newProjectName.substring(1)}`,
      },
    ],
  };

  await updateProjectParameters(createResult.id, paramUpdates);
  //
  // here we can loop through the new projects builds and trigger them
  // if we decide to go this route we can also reset the build counter for each project
  console.log(`\nTriggering builds for new project ${createResult.name}\n`);

  const validBuildTypeNames = ["Public CI", "Admin CI", "Preview CI"];
  // const projectId = "Q4Web_Develop";
  const projectId = createResult.id;
  const newProject: Project | undefined = await getProject(projectId);
  for (const buildType of newProject!.buildTypes.buildType) {
    if (validBuildTypeNames.includes(buildType.name)) {
      console.log(`Triggering build for ${buildType.name}`);
      await triggerBuild(buildType.id);
    }
  }

  return;
  */
};

run();
