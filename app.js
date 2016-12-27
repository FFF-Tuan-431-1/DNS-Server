const packet = require('dns-packet');
const dgram = require('dgram');
const path = require('path');
const query = require('./query');
const {init: initLocalQuery} = require('./query/localQuery');
let argv = require('yargs')
  .default('recordFilePath', './query/data.xlsx')
  .default('assignedDNS', '223.5.5.5')
  .argv;
global.assignedDNS = argv.assignedDNS;

const socket = dgram.createSocket('udp4');

// let recordFilePath = process.argv[2] || './query/data.xlsx';
// global.assignedDNS = process.argv[3] || '223.5.5.5';

if (!path.isAbsolute(argv.recordFilePath)) {
  argv.recordFilePath = path.join(__dirname, argv.recordFilePath)
}
initLocalQuery(argv.recordFilePath);


socket.on('message', (msg, {port, address}) => {
    const queryPacket = packet.decode(msg);
    const question = queryPacket.questions[0];

    query(question.type, question.name)
      .then(record => {
        let ipBlocked = record.map(v => v.data).includes('0.0.0.0');
        const buf = packet.encode({
          type: 'response',
          id: queryPacket.id,
          flags: ipBlocked ? packet.CHECKING_DISABLED : packet.AUTHENTIC_DATA,
          answers: ipBlocked ? [] : record
        });

        socket.send(buf, 0, buf.length, port, address);
      }).catch(console.error)
});

socket.bind(53, 'localhost');
