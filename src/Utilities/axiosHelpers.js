import axios from 'axios';

export const apiHelpers = {
  getHeadersObject: (token) => {
    return {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
  },

  get: (url) => {
    return axios
      .get(url)
      .then((res) => res)
      .catch((error) => error);
  },

  post: (url, data) => {
    return axios
      .post(url, data)
      .then((res) => res)
      .catch((error) => error);
  },

  postWithAuth: (url, data, token) => {
    const headersObject = this.getHeadersObject(token);
    return axios
      .post(url, data, headersObject)
      .then((res) => res)
      .catch((error) => error);
  },

  getWithAuth: (url, token) => {
    const headersObject = this.getHeadersObject(token);
    return axios
      .get(url, headersObject)
      .then((res) => res)
      .catch((error) => error);
  },

  putWithAuth: (url, data, token) => {
    const headersObject = this.getHeadersObject(token);
    return axios
      .put(url, data, headersObject)
      .then((res) => res)
      .catch((error) => error);
  },

  postWithHeaders: (url, data, headersObject) => {
    return axios.post(url, data, headersObject)
    .then((res) => res)
    .catch((error) => error)
  }
}

export default apiHelpers;