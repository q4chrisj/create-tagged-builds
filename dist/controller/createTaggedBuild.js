"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTaggedBuildController = void 0;
const github = __importStar(require("@actions/github"));
const config_1 = require("../config");
const teamCityService_1 = require("../services/teamCityService");
class CreateTaggedBuildController {
    constructor() {
        this._teamCityService = new teamCityService_1.TeamCityService();
        this._octokit = github.getOctokit(config_1.config.GithubAccessToken);
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
            // figure out which parameters for the new project need to be updated.
            const paramsToUpdate = [];
            paramsToUpdate.push({ name: "env.version", value: newTag });
            newProject.parameters.property.forEach((p) => {
                if (p.name.includes("system.GitDefaultBranch-")) {
                    // we'll need to check if p.name includes Foundation, Go and then make a
                    // call to github to get the latest tag for each and update
                    paramsToUpdate.push({ name: p.name, value: `tags/${newTag}` });
                }
            });
            const paramUpdates = {
                parameters: [],
            };
            for (const param of paramsToUpdate) {
                paramUpdates.parameters.push(param);
            }
            console.log("Updating new projects parameters.");
            await this._teamCityService.updateProjectParameters(newProject.id, paramUpdates);
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
