import { NewProject, Project } from "./model";
import { get, post } from "./service";

export const run = async (): Promise<void> => {
  const result: Project = await get<Project>("/projects/id:Q4Web");
  const mostRecentProject = result.projects.project
    .filter((p) => {
      return p.name.startsWith("v") && !p.name.includes("-");
    })
    .pop(); // the last item in this array is _usually_ the most recent one.

  // newProjectName and newProjectParentProjectId should be passed in
  const newProjectName: string = "v5.115.0";
  const newProjectParentProjectId: string = "Q4Web";
  const newProjectId: string = newProjectParentProjectId
    .concat("_")
    .concat(newProjectName.split(".").join(""));

  console.log(
    `Copying ${mostRecentProject?.name} to create the new project ${newProjectName}.`,
  );

  const newProject: NewProject = {
    id: newProjectId,
    parentProject: {
      locator: newProjectParentProjectId,
    },
    name: newProjectName,
    copyAllAssociatedSettings: true,
  };

  await post<Project>("/projects", JSON.stringify(newProject)).then(
    (result) => {
      console.log(`New Project ${result.name} created.`);
    },
  );

  // console.log(createResult);
  return;
};

run();
