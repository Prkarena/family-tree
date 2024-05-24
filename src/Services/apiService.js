import axios from "axios";

import localStorageKeys from "../Utils/localStorageKeys";

export const BASE_URL = process.env.REACT_APP_API_URL;

const HTTP_VERB = {
  GET: "GET",
  POST: "POST",
  DELETE: "DELETE",
  PUT: "PUT",
  PATCH: "PATCH",
};

class Api {
  static async get(uri, params, apiUrl = BASE_URL, impersonateUser = null) {
    let requestParams = {};
    if (params && Object.keys(params).length > 0) {
      requestParams = { ...params };
      if (!requestParams.$scope) {
        requestParams.$scope = "withRelated";
      }
    }

    if (requestParams.noScope) {
      delete requestParams.$scope;
      delete requestParams.noScope;
    }
    const uriWithParams = `${uri}?${Object.keys(requestParams)
      .map((key) =>
        Array.isArray(requestParams[key])
          ? requestParams[key].map((item) => `${key}=${item}`).join(`&`)
          : key === "multiSearch"
          ? requestParams[key]
          : `${key}=${requestParams[key]}`
      )
      .join("&")}`;
    const requestData = await Api.buildRequest(
      HTTP_VERB.GET,
      null,
      impersonateUser
    );
    return Api.loadHeadersAndPerformRequest(uriWithParams, apiUrl, requestData);
  }

  static async post(uri, body, apiUrl = BASE_URL) {
    const requestData = await Api.buildRequest(HTTP_VERB.POST, body, apiUrl);
    return Api.loadHeadersAndPerformRequest(uri, apiUrl, requestData);
  }

  static async uploadFormData(uri, body, uploadCallback, apiUrl = BASE_URL) {
    const requestData = await Api.buildUploadRequest(
      HTTP_VERB.POST,
      body,
      uploadCallback,
      apiUrl
    );
    return Api.loadHeadersAndPerformRequest(uri, apiUrl, requestData);
  }

  static async uploadVideo(signedUrl, video, callback) {
    const response = await Api.performVideoUploadRequest(
      signedUrl,
      HTTP_VERB.PUT,
      video,
      callback
    );
    return response;
  }

  static async delete(uri, body, apiUrl = BASE_URL) {
    const requestData = await Api.buildRequest(HTTP_VERB.DELETE, body);
    return Api.loadHeadersAndPerformRequest(uri, apiUrl, requestData);
  }

  static async put(uri, body, apiUrl = BASE_URL) {
    const requestData = await Api.buildRequest(HTTP_VERB.PUT, body);
    return Api.loadHeadersAndPerformRequest(uri, apiUrl, requestData);
  }

  static async patch(uri, body, apiUrl = BASE_URL, impersonatedUser = null) {
    const requestData = await Api.buildRequest(
      HTTP_VERB.PATCH,
      body,
      impersonatedUser
    );
    return Api.loadHeadersAndPerformRequest(uri, apiUrl, requestData);
  }

  static async buildRequest(httpVerb, body, impersonateUser) {
    let accessToken = localStorage.getItem(localStorageKeys.ACCESS_TOKEN);

    return {
      method: httpVerb,
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : null,
        "content-type": "application/json",
        ...(impersonateUser && { "x-impersonated-user": impersonateUser }),
      },
      ...(body && { data: JSON.stringify(body) }),
    };
  }

  static async buildUploadRequest(httpVerb, body, uploadCallback) {
    let accessToken = localStorage.getItem(localStorageKeys.ACCESS_TOKEN);

    return {
      method: httpVerb,
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken}` : null,
        "content-type": "multipart/form-data",
      },
      onUploadProgress: (progress) => {
        uploadCallback(progress);
      },

      ...(body && { data: body }),
    };
  }

  static async loadHeadersAndPerformRequest(uri, apiUrl, data) {
    try {
      return Api.performRequest(uri, apiUrl, data);
    } catch (err) {
      return Api.performRequest(uri, apiUrl, data);
    }
  }

  static async performRequest(uri, apiUrl, requestData = {}) {
    const url = `${apiUrl}${uri}`;

    try {
      const response = await axios(url, {
        ...requestData,
      });

      return { body: response.data, status: response.status };
    } catch (error) {
      return {
        body: null,
        error:
          error?.response?.data?.errors?.length > 0
            ? error?.response?.data?.errors[0].message
            : error?.response?.data?.message || error || "Something Went Wrong",
        status: error?.response?.status || 500,
      };
    }
  }
}

export default Api;
