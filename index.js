const Buffer = require('buffer').Buffer;
const dgram = require('dgram');
const {decode, encode} = require('./dns/protocol');

host = 'localhost';
port = 53;

const server = dgram.createSocket('udp4');
    
server.on('message', function (msg, rinfo) {
    const query = decode(msg, 'queryMessage').val;
    const res = {
        header: {
            id: query.header.id,
            flags: query.header.flags,
            qdCount: 0,
            anCount: 1,
            nsCount: 0,
            srCount: 0
        },
        question: query.question,
        answers: [
            {
                name: 'test.com',
                rtype: 0x01,
                rclass: 1,
                rttl: 5,
                rdata: { target: '181.181.181.181', _type: 'A' },
            }
        ]
    }

    const buf = encode(res, 'answerMessage')
    server.send(buf, 0, buf.length, rinfo.port, rinfo.address, function (err, sent) {
        if (!err) {
            console.info('Sent success')
        }
    });
});


server.bind(port, host);
console.log('Started server on ' + host + ':' + port);