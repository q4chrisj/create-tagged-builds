import { config } from "../config";
import { Parameter, Project, UpdateParameters } from "../model";
import { TeamCityService } from "../services/teamCityService";

export class CreateTaggedBuildController {
  private _teamCityService: TeamCityService = new TeamCityService();

  createTaggedBuild = async (newTag: string) => {
    console.log(
      `\nCreating tagged build for ${config.TeamCityProject} using tag ${newTag}\n`,
    );
    const newProjectName: string = newTag;
    const newProjectParentProjectId: string = config.TeamCityProject;
    const mostRecentProject = await this._teamCityService.getMostRecentProject(
      newProjectParentProjectId,
    );

    if (mostRecentProject === undefined) {
      console.error(
        `Couldn't find a tagged build under ${newProjectParentProjectId}`,
      );
      return;
    }

    const newProject = await this.createProject(
      newProjectName,
      newProjectParentProjectId,
      mostRecentProject,
    );

    if (!newProject) {
      console.error(` - Project ${newProjectName} was NOT created`);
      return;
    }

    console.log(` - New Project ${newProject.name} created.\n`);

    await this.updateProjectParameters(newTag, newProject);

    // trigger the builds
    console.log(`\nTriggering builds for new project ${newProject.name}`);

    await this.triggerNewProjectBuild(newProject);
  };

  private createProject = async (
    newProjectName: string,
    newProjectParentProjectId: string,
    mostRecentProject: Project,
  ) => {
    console.log(
      `Copying ${mostRecentProject?.name} to create the new project ${newProjectName}.`,
    );

    const newProject: Project | undefined =
      await this._teamCityService.createNewProject(
        newProjectName,
        newProjectParentProjectId,
        mostRecentProject!.id,
      );

    return newProject;
  };

  private updateProjectParameters = async (
    newTag: string,
    newProject: Project,
  ): Promise<void> => {
    // figure out which parameters for the new project need to be updated.
    const paramsToUpdate: Array<Parameter> = [];
    paramsToUpdate.push({ name: "env.version", value: newTag });

    newProject.parameters.property.forEach((p) => {
      if (p.name.includes("system.GitDefaultBranch-")) {
        // we'll need to check if p.name includes Foundation, Go and then make a
        // call to github to get the latest tag for each and update
        paramsToUpdate.push({ name: p.name, value: `tags/${newTag}` });
      }
    });

    const paramUpdates: UpdateParameters = {
      parameters: [],
    };

    for (const param of paramsToUpdate) {
      paramUpdates.parameters.push(param);
    }

    console.log("Updating new projects parameters.");
    await this._teamCityService.updateProjectParameters(
      newProject.id,
      paramUpdates,
    );
  };

  private triggerNewProjectBuild = async (
    newProject: Project,
  ): Promise<void> => {
    const validBuildTypeNames = ["Public CI", "Admin CI", "Preview CI", "CI"];
    for (const buildType of newProject.buildTypes.buildType) {
      if (validBuildTypeNames.includes(buildType.name)) {
        console.log(` - Triggering build for ${buildType.name}`);
        await this._teamCityService.triggerBuild(buildType.id);
      }
    }
  };
}
