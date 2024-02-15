"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamCityService = void 0;
const httpService_1 = require("./httpService");
class TeamCityService {
    constructor() {
        this.getMostRecentProject = async (projectId) => {
            const result = await this.getProject(projectId);
            const mostRecentProject = result.projects.project
                .filter((p) => {
                return p.name.startsWith("v") && !p.name.includes("-");
            })
                .pop(); // the last item in this array is _usually_ the most recent one.
            return mostRecentProject;
        };
        this.getProject = async (projectId) => {
            return await (0, httpService_1.get)(`/projects/id:${projectId}`);
        };
        this.createNewProject = async (projectName, projectParentId, projectSourceId) => {
            const newProjectId = projectParentId
                .concat("_")
                .concat(projectName.split(".").join(""));
            const newProject = {
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
            const createResult = await (0, httpService_1.post)("/projects", JSON.stringify(newProject)).then((result) => {
                if (result) {
                    return result;
                }
                return undefined;
            });
            return createResult;
        };
        this.updateProjectParameters = async (projectId, paramsToUpdate) => {
            for (const param of paramsToUpdate.parameters) {
                const updatePath = `/projects/id:${projectId}/parameters/${param.name}`;
                console.log(` - Updating ${param.name} to ${param.value}`);
                await (0, httpService_1.put)(updatePath, `${param.value}`, "text/plain");
            }
        };
        this.triggerBuild = async (buildTypeId) => {
            const data = {
                buildType: {
                    id: buildTypeId,
                },
            };
            await (0, httpService_1.post)("/buildQueue", JSON.stringify(data));
        };
    }
}
exports.TeamCityService = TeamCityService;
