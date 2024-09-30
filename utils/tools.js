const { randomUUID } = require("node:crypto");

const uuid = () => randomUUID();

module.exports = {
  uuid,
};
