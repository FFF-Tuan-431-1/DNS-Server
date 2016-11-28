const packet = require('dns-packet');
const dgram = require('dgram');
const query = require('./query');

const socket = dgram.createSocket('udp4');

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
