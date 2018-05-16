var dgram = require('dgram');
var socket = dgram.createSocket('udp4');
var net = require('net');
var moment = require('moment');

const PROTOCOL = {
	PORT: 1313,
	ADDRESS: "239.255.22.5"
};

var musician = {
	uuid: null,
	instrument: null,
	activeSince: null
};

var musicians = [];


socket.bind(PROTOCOL.PORT, function (err) {
	if(err){
		socket.close();
		throw err;
	}
	console.log("join Multicast");
	socket.addMembership(PROTOCOL.ADDRESS);
});

socket.on('message', function(msg, source) {
	console.log("Data has arrived: " + msg + ". Source port: " + source.port);

	var sound = JSON.parse(msg);

	for(var i = 0; i < musicians.length; i++){
		if(sound.uuid == musicians[i].uuid){
			musicians[i].activeSince = sound.timeStamp;
			return;
		}
	}
	var instrument;
	switch (sound.sound) {
		case "ti-ta-ti":
			instrument = "piano";
			break;
		case "pouet":
			instrument = "trumpet";
			break;
		case "trulu":
			instrument = "flute";
			break;
		case "gzi-gzi":
			instrument = "violin";
			break;
		case "boum-boum":
			instrument = "drum";
			break;
	}

	musicians.push({
		"uuid": sound.uuid,
		"instrument": instrument,
		"activeSince": sound.timeStamp
	});

	console.log(musicians);
});

//tcp server
var tcp = net.createServer();
tcp.listen(2205);

tcp.on('connection', function (socket) {
	checkInactiveMusicians();
	console.log("sending : " + JSON.stringify(musicians));
	socket.write(JSON.stringify(musicians));
	socket.destroy();
});

function checkInactiveMusicians() {
	for(var i = 0; i < musicians.length; i++){
		if(moment().diff(musicians[i].activeSince, "s") > 5){
			console.log("Musician removed from list : " + JSON.stringify(musicians[i]));
			musicians.splice(i, 1);
		}
	}
}



