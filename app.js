const packet = require('./dns-packet');
const dgram = require('dgram');
const path = require('path');
const query = require('./query');
const {init: initLocalQuery} = require('./query/localQuery');
const argv = require('yargs')
  .default('data', './query/data.xlsx')
  .default('dns', '223.5.5.5')
  .argv;
global.assignedDNS = argv.assignedDNS;

const socket = dgram.createSocket('udp4');

if (!path.isAbsolute(argv.data)) {
  argv.data = path.join(__dirname, argv.data)
}

initLocalQuery(argv.data);


socket.on('message', (msg, {port, address}) => {
    const queryPacket = packet.decode(msg);
    const question = queryPacket.questions[0];

    query(question.type, question.name)
      .then(record => {
        let ipBlocked = record.map(v => v.data).includes('0.0.0.0');
        const buf = packet.encode({
          type: 'response',
          id: queryPacket.id,
          type: ipBlocked ? 'error' : 'response',
          answers: ipBlocked ? [] : record
        });

        socket.send(buf, 0, buf.length, port, address);
      }).catch(console.error)
});

socket.bind(53, 'localhost');
