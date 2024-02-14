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
exports.getConfig = void 0;
const core = __importStar(require("@actions/core"));
const getConfig = () => {
    const TEAM_CITY_URI = core.getInput("team_city_uri");
    if (TEAM_CITY_URI === "") {
        console.error("The team_city_uri must be passed into the action.");
    }
    const TEAM_CITY_TOKEN = core.getInput("team_city_token");
    if (TEAM_CITY_TOKEN === "") {
        console.error("The TEAM_CITY_TOKEN must be passed into the action.");
    }
    const TEAM_CITY_PROJECT = core.getInput("team_city_project");
    if (TEAM_CITY_PROJECT === "") {
        console.error("The TEAM_CITY_PROJECT must be passed into the action.");
    }
    const config = {
        TeamCityUri: TEAM_CITY_URI,
        TeamCityToken: TEAM_CITY_TOKEN,
        TeamCityProject: TEAM_CITY_PROJECT,
    };
    return config;
};
exports.getConfig = getConfig;
