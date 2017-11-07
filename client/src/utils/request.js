import reqwest from 'reqwest';

const API_URL = 'https://agromotivapp.herokuapp.com';
// const API_URL = 'http://localhost:5000';

const getTokenHeader = (token = null) => {
    if ( !token ) {
        return {};
    }

    return {
        authorization: `Bearer ${token}`
    };
};

const request = (request, options) => {
    const token = localStorage.token;
    const { contentType: content_type, ...otherRequestOptions } = request;
    const headers = otherRequestOptions.headers || {};
    const isJSON = !options.isFormData;
    const hasFileUpload = options.fileUpload;
    const contentType = content_type || (
        isJSON ? 'application/json' : 'multipart/form-data'
    );
    const data = isJSON && !hasFileUpload ? JSON.stringify(otherRequestOptions.data) : otherRequestOptions.data;

    let extendOptions = {
        ...otherRequestOptions,
        headers: {
            ...headers,
            ...getTokenHeader(token),
        },
        data,
    };

    if ( !hasFileUpload ) {
        extendOptions = {
            ...extendOptions,
            contentType,
        };
    } else {
        extendOptions = {
            ...extendOptions,
            processData: false,
        };
    }

    return reqwest(extendOptions);
};

const httpVerbRequest = (
    url,
    data,
    method = 'get',
    options
) => request({
    url,
    data,
    method: method.toUpperCase(),
}, options);

export const apiRoute = (url = '', apiVersion = '1') => {
    return `${API_URL}/v${apiVersion}/${url}`;
};

export const post = (url = '', data = {}, options = { isFormData: false }) => {
    return httpVerbRequest(url, data, 'post', options);
};

export const get = (url = '', data = {}, options = { isFormData: true }) => {
    return httpVerbRequest(url, data, 'get', options);
};

export const put = (url = '', data = {}, options = { isFormData: false }) => {
    return httpVerbRequest(url, data, 'put', options);
};

export const destroy = (url = '', data = {}, options = { isFormData: true }) => {
    return httpVerbRequest(url, data, 'delete', options);
};

export const getHeaders = request => name => {
  if ( name ) {
    return request.getResponseHeader(name);
  }

  return request.getAllResponseHeaders();
};

export default request;
