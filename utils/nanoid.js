const { nanoid } = require('nanoid');

const enrollmentId = () => nanoid(8);

module.exports = enrollmentId;