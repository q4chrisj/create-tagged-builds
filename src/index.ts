import {
  createNewProject,
  getMostRecentProject,
  updateProjectParameters,
} from "./index.helpers";
import { Project, UpdateParameters } from "./model";

export const run = async (): Promise<void> => {
  // newProjectName and newProjectParentProjectId should be passed in
  const newProjectName: string = "v5.120.0";
  const newProjectParentProjectId: string = "Q4Web";
  const latestFoundationTag: string = "v2.115.0"; // this would normally come from a github api call
  const latestGoServicetag: string = "v2.67.0"; // this would normally come from a github api call
  const mostRecentProject = await getMostRecentProject("Q4Web");
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

  return;
};

run();
