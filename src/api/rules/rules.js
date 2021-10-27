import axios from "axios";

function getRules() {
  return axios.get("/rules/basic");
}

function otherCoolRules() {}

export { getRules, otherCoolRules };
