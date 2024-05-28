import { config } from "../config";
import { Parameter, Project, UpdateParameters } from "../model";
import { TeamCityService } from "../services/teamcity.service";
import { GithubService } from "../services/github.service";
import { DependantRepos } from "./taggedbuild.controller.definition";

export class CreateTaggedBuildController {
  private _teamCityService: TeamCityService = new TeamCityService();
  private _githubService: GithubService = new GithubService();

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
    const paramsToUpdate: Array<Parameter> = await this.getParamsToUpdate(
      newProject,
      newTag,
    );

    const paramUpdates: UpdateParameters = {
      parameters: paramsToUpdate,
    };

    console.log("Updating new projects parameters.");
    await this._teamCityService.updateProjectParameters(
      newProject.id,
      paramUpdates,
    );
  };

  private getParamsToUpdate = async (
    newProject: Project,
    newTag: string,
  ): Promise<Array<Parameter>> => {
    const paramsToUpdate: Array<Parameter> = [];
    paramsToUpdate.push({ name: "env.version", value: newTag.substring(1) });

    newProject.parameters.property.forEach(async (p) => {
      if (p.name.includes("system.GitDefaultBranch-")) {
        const dependantRepoKey: string = p.name.replace(
          "system.GitDefaultBranch-",
          "",
        );
        if (DependantRepos.has(dependantRepoKey)) {
          const dependantRepo = DependantRepos.get(dependantRepoKey);
          const dependantRepoLatestTag =
            await this._githubService.getLatestTagName(dependantRepo!);
          newTag = dependantRepoLatestTag;
        }

        paramsToUpdate.push({ name: p.name, value: `tags/${newTag}` });
      }
    });

    return paramsToUpdate;
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
