const { EventEmitter } = require('events');
const logger = require('../utils/logger');

// Lightweight in-process job queue — drop-in replacement for BullMQ.
// Compatible with any Redis version (pub/sub only, no streams).
class SimpleQueue extends EventEmitter {
  constructor(name) {
    super();
    this.name = name;
    this._counter = 0;
  }

  async add(type, data) {
    const id = String(++this._counter);
    // Run asynchronously so the HTTP response returns 202 immediately
    setImmediate(() => this.emit('job', { id, type, data }));
    return { id };
  }
}

const analysisQueue = new SimpleQueue('analysis');

module.exports = { analysisQueue };
