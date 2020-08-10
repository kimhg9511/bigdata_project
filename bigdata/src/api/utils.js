import axios from 'axios';

function loadJson(fileName) {
  return axios.get(fileName);
}
export {
  loadJson,
}