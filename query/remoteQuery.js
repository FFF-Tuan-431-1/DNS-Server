const dns = require('dns');
var packet = require('dns-packet');
var dgram = require('dgram');
var {learn: learnFromResult} = require('./localQuery')

var socket = dgram.createSocket('udp4');

function query(type, name) {
  return new Promise((resolve, reject) => {
    var buf = packet.encode({
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
      console.log(resolvedPacket)
      resolve(resolvedPacket.answers.map(v => ({
        type: v.type, 
        name: v.name,
        data: v.data
      })))
    })
    socket.send(buf, 0, buf.length, 53, '8.8.8.8');
  })
}

if (require.main === module) {
  query('A', 'lcj.me').then(console.log)
}

module.exports = {
  query
};