/*
 * the main query method
 * - first query for localStorage
 * - if not found, use remoteQuery
 */

const {query: localQuery} = require('./localQuery');
const {query: remoteQuery} = require('./remoteQuery');

module.exports = function query(type, domain) {
  let record = localQuery(type, domain);
  if (record.length) {
    console.info(`Found query ${type}:${domain} at local`);
    return Promise.resolve(record);
  }

  return remoteQuery(type, domain);
};
