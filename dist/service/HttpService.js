"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.put = exports.post = exports.get = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
const teamCityToken = config_1.config.TeamCityToken;
const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${teamCityToken}`,
};
const get = async (path) => {
    const requestUri = config_1.config.TeamCityUri.concat(path);
    const result = await axios_1.default
        .get(requestUri, {
        headers: headers,
    })
        .then((r) => {
        return r.data;
    });
    return result;
};
exports.get = get;
const post = async (path, body, contentType) => {
    if (contentType) {
        headers["Content-Type"] = contentType;
    }
    const requestUri = config_1.config.TeamCityUri.concat(path);
    const result = await axios_1.default
        .post(requestUri, body, {
        headers: headers,
    })
        .then((r) => {
        return r.data;
    })
        .catch((err) => {
        console.log("");
        console.log(err.response.data);
    });
    return result;
};
exports.post = post;
const put = async (path, body, contentType) => {
    let specialHeaders;
    if (contentType) {
        specialHeaders = {
            ...headers,
            "Content-Type": contentType,
            Accept: contentType,
        };
    }
    const requestUri = config_1.config.TeamCityUri.concat(path);
    const result = await axios_1.default
        .put(requestUri, body, {
        headers: specialHeaders || headers,
    })
        .then((r) => {
        return r.data;
    })
        .catch((err) => {
        console.log("");
        console.log(err.response.data);
    });
    return result;
};
exports.put = put;
