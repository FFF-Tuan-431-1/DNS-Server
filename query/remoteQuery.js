const dns = require('dns');

function query(type, name) {
  return new Promise((resolve, reject) => {
    dns.resolve(name, type, (err, result) => {
      if (err) {
        return reject(err)
      }
      console.info(`Found query ${type}:${name} at remote`);
      resolve(result.map(v => ({type, name, data: v})))
    })
  })
}

if (require.main === module) {
  query('A', 'lcj.me').then(console.log)
}

module.exports = {
  query
};
