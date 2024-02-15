import { NewProject, Project, TriggerBuild, UpdateParameters } from "../model";
import { get, post, put } from "./http.service";

export class TeamCityService {
  getMostRecentProject = async (
    projectId: string,
  ): Promise<Project | undefined> => {
    const result: Project | undefined = await this.getProject(projectId);
    const mostRecentProject: Project | undefined = result!.projects.project
      .filter((p) => {
        return p.name.startsWith("v") && !p.name.includes("-");
      })
      .pop(); // the last item in this array is _usually_ the most recent one.

    return mostRecentProject;
  };

  getProject = async (projectId: string): Promise<Project | undefined> => {
    return await get<Project>(`/projects/id:${projectId}`);
  };

  createNewProject = async (
    projectName: string,
    projectParentId: string,
    projectSourceId: string,
  ): Promise<Project | undefined> => {
    const newProjectId: string = projectParentId
      .concat("_")
      .concat(projectName.split(".").join(""));

    const newProject: NewProject = {
      id: newProjectId,
      parentProject: {
        locator: projectParentId,
      },
      sourceProject: {
        locator: projectSourceId,
      },
      name: projectName,
      copyAllAssociatedSettings: "true",
    };

    const createResult: Project | undefined = await post<Project>(
      "/projects",
      JSON.stringify(newProject),
    ).then((result) => {
      if (result) {
        return result;
      }
      return undefined;
    });

    return createResult;
  };

  updateProjectParameters = async (
    projectId: string,
    paramsToUpdate: UpdateParameters,
  ) => {
    for (const param of paramsToUpdate.parameters) {
      const updatePath = `/projects/id:${projectId}/parameters/${param.name}`;
      console.log(` - Updating ${param.name} to ${param.value}`);

      await put(updatePath, `${param.value}`, "text/plain");
    }
  };

  triggerBuild = async (buildTypeId: string) => {
    const data: TriggerBuild = {
      buildType: {
        id: buildTypeId,
      },
    };
    await post("/buildQueue", JSON.stringify(data));
  };
}
