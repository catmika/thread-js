const { REACT_APP_SOCKET_SERVER, REACT_APP_API_PATH } = process.env;

const ENV = {
  SOCKET_URL: REACT_APP_SOCKET_SERVER,
  API_PATH: REACT_APP_API_PATH
};

export { ENV };
