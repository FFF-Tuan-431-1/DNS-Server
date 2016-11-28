const packet = require('dns-packet');
const dgram = require('dgram');
const path = require('path');
const query = require('./query');
const {init: initLocalQuery} = require('./query/localQuery');

const socket = dgram.createSocket('udp4');

let recordFilePath = process.argv[2];
if (!path.isAbsolute(recordFilePath)) {
  recordFilePath = path.join(__dirname, recordFilePath)
}
initLocalQuery(recordFilePath);


socket.on('message', (msg, {port, address}) => {
    const queryPacket = packet.decode(msg);
    const question = queryPacket.questions[0];

    query(question.type, question.name)
      .then(record => {
        const buf = packet.encode({
          type: 'response',
          id: queryPacket.id,
          flags: packet.AUTHENTIC_DATA,
          answers: record
        });
        socket.send(buf, 0, buf.length, port, address);
      }).catch(console.error)
});

socket.bind(53, 'localhost');
