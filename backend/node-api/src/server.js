const http = require('http');
const app = require('./app');
const { init } = require('./sockets/socket');
const { port } = require('./config/env');
const logger = require('./utils/logger');
require('./workers/analysis.worker'); // register in-process job handler

const server = http.createServer(app);
init(server);

server.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
