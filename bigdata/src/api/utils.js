import axios from 'axios';
const baseUrl = "data"
function loadFile(fileName) {
  // console.log("loadFile called...");
  return axios.get(`${baseUrl}/${fileName}`)
}
export {
  loadFile,
}