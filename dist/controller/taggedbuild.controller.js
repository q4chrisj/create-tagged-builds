"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTaggedBuildController = void 0;
const config_1 = require("../config");
const teamcity_service_1 = require("../services/teamcity.service");
const github_service_1 = require("../services/github.service");
const taggedbuild_controller_definition_1 = require("./taggedbuild.controller.definition");
class CreateTaggedBuildController {
    constructor() {
        this._teamCityService = new teamcity_service_1.TeamCityService();
        this._githubService = new github_service_1.GithubService();
        this.createTaggedBuild = async (newTag) => {
            console.log(`\nCreating tagged build for ${config_1.config.TeamCityProject} using tag ${newTag}\n`);
            const newProjectName = newTag;
            const newProjectParentProjectId = config_1.config.TeamCityProject;
            const mostRecentProject = await this._teamCityService.getMostRecentProject(newProjectParentProjectId);
            if (mostRecentProject === undefined) {
                console.error(`Couldn't find a tagged build under ${newProjectParentProjectId}`);
                return;
            }
            const newProject = await this.createProject(newProjectName, newProjectParentProjectId, mostRecentProject);
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
        this.createProject = async (newProjectName, newProjectParentProjectId, mostRecentProject) => {
            console.log(`Copying ${mostRecentProject?.name} to create the new project ${newProjectName}.`);
            const newProject = await this._teamCityService.createNewProject(newProjectName, newProjectParentProjectId, mostRecentProject.id);
            return newProject;
        };
        this.updateProjectParameters = async (newTag, newProject) => {
            const paramsToUpdate = await this.getParamsToUpdate(newProject, newTag);
            const paramUpdates = {
                parameters: paramsToUpdate,
            };
            console.log("Updating new projects parameters.");
            await this._teamCityService.updateProjectParameters(newProject.id, paramUpdates);
        };
        this.getParamsToUpdate = async (newProject, newTag) => {
            const paramsToUpdate = [];
            paramsToUpdate.push({ name: "env.version", value: newTag });
            newProject.parameters.property.forEach(async (p) => {
                if (p.name.includes("system.GitDefaultBranch-")) {
                    const dependantRepoKey = p.name.replace("system.GitDefaultBranch-", "");
                    if (taggedbuild_controller_definition_1.DependantRepos.has(dependantRepoKey)) {
                        const dependantRepo = taggedbuild_controller_definition_1.DependantRepos.get(dependantRepoKey);
                        const dependantRepoLatestTag = await this._githubService.getLatestTagName(dependantRepo);
                        newTag = dependantRepoLatestTag;
                    }
                    paramsToUpdate.push({ name: p.name, value: `tags/${newTag}` });
                }
            });
            return paramsToUpdate;
        };
        this.triggerNewProjectBuild = async (newProject) => {
            const validBuildTypeNames = ["Public CI", "Admin CI", "Preview CI", "CI"];
            for (const buildType of newProject.buildTypes.buildType) {
                if (validBuildTypeNames.includes(buildType.name)) {
                    console.log(` - Triggering build for ${buildType.name}`);
                    await this._teamCityService.triggerBuild(buildType.id);
                }
            }
        };
    }
}
exports.CreateTaggedBuildController = CreateTaggedBuildController;
