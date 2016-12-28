const packet = require('dns-packet');
const dgram = require('dgram');
const {learnFromResult} = require('./localQuery')
const dns = require("yargs").dns;

const socket = dgram.createSocket('udp4');

function query(type, name) {
  return new Promise((resolve, reject) => {
    const buf = packet.encode({
      type: 'query',
      id: 1300,
      flags: packet.RECURSION_DESIRED,
      questions: [{
        type: type,
        name: name
      }]
    })

    socket.once('message', (msg) => {
      const resolvedPacket = packet.decode(msg)
      console.info(`Found query ${type}:${name} at remote`);
      resolvedPacket.answers.forEach(learnFromResult);
      resolve(resolvedPacket.answers.map(v => ({
        type: v.type, 
        name: v.name,
        data: v.data
      })))
    })
    socket.send(buf, 0, buf.length, 53, dns);
  })
}

if (require.main === module) {
  query('A', 'lcj.me').then(console.log)
}

module.exports = {
  query
};