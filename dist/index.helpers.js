"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerBuild = exports.updateProjectParameters = exports.createNewProject = exports.getProject = exports.getMostRecentProject = void 0;
const service_1 = require("./service");
const getMostRecentProject = async (projectId) => {
    const result = await (0, exports.getProject)(projectId);
    const mostRecentProject = result.projects.project
        .filter((p) => {
        return p.name.startsWith("v") && !p.name.includes("-");
    })
        .pop(); // the last item in this array is _usually_ the most recent one.
    return mostRecentProject;
};
exports.getMostRecentProject = getMostRecentProject;
const getProject = async (projectId) => {
    return await (0, service_1.get)(`/projects/id:${projectId}`);
};
exports.getProject = getProject;
const createNewProject = async (projectName, projectParentId, projectSourceId) => {
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
    const createResult = await (0, service_1.post)("/projects", JSON.stringify(newProject)).then((result) => {
        if (result) {
            return result;
        }
        return undefined;
    });
    return createResult;
};
exports.createNewProject = createNewProject;
const updateProjectParameters = async (projectId, paramsToUpdate) => {
    for (const param of paramsToUpdate.parameters) {
        const updatePath = `/projects/id:${projectId}/parameters/${param.name}`;
        console.log(` - Updating ${param.name} to ${param.value}`);
        await (0, service_1.put)(updatePath, `${param.value}`, "text/plain");
    }
};
exports.updateProjectParameters = updateProjectParameters;
const triggerBuild = async (buildTypeId) => {
    const data = {
        buildType: {
            id: buildTypeId,
        },
    };
    await (0, service_1.post)("/buildQueue", JSON.stringify(data));
};
exports.triggerBuild = triggerBuild;
