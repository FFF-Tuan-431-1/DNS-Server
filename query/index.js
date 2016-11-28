/*
 * the main query method
 * - first query for localStorage
 * - if not found, use remoteQuery
 */

const {query: localQuery} = require('./localQuery');
const {query: remoteQuery} = require('./remoteQuery');

module.exports = function query(type, domain) {
  return new Promise((resolve, reject) => {
    let record = localQuery(type, domain);
    if (record.length) {
      resolve(record);
    }

    remoteQuery(type, domain).then(resolve, reject);
  })
};
