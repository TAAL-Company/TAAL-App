import clientConfig from "./client-config";
const azureConfig = {
  siteUrl: clientConfig.baseUrl,
  getUsers: `${clientConfig.baseUrl}/students`,
  loginUser: `${clientConfig.baseUrl}/students/login`,
  getRoutes: `${clientConfig.baseUrl}/routes`,
  getTasks: `${clientConfig.baseUrl}/tasks`,
  getPlaces: `${clientConfig.baseUrl}/sites`,//sites not places
  getTaskPerformance: `${clientConfig.baseUrl}/task-performance`,
  getPacks: `${clientConfig.baseUrl}/packs`,
  // getUser: `${clientConfig.siteUrl}wp-json/wp/v2/users/me`,
  // getUsers: `${clientConfig.siteUrl}wp-json/wp/v2/users`,
};

export default azureConfig;
