import nodeMap from "../util/node-map.js";

export default function(src, tar, data) {
  const { name } = data;
  nodeMap[src.__id].setAttribute(name, tar.attributes[name]);
}
