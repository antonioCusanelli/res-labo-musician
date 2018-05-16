const uuid = require('uuid/v1');
var dgram = require('dgram');
var socket = dgram.createSocket('udp4');
var moment = require('moment');

const PROTOCOL = {
	PORT: 1313,
	ADDRESS: "239.255.22.5"
};

var infosFromMusician = {
	uuid: null,
	sound: null,
	timeStamp: null
};

infosFromMusician.uuid = uuid();
var instrument;
instrument = process.argv.slice(2).toString();

switch (instrument) {
	case "piano":
		infosFromMusician.sound = "ti-ta-ti";
		break;
	case "trumpet":
		infosFromMusician.sound = "pouet";
		break;
	case "flute":
		infosFromMusician.sound = "trulu";
		break;
	case "violin":
		infosFromMusician.sound = "gzi-gzi";
		break;
	case "drum":
		infosFromMusician.sound = "boum-boum";
		break;
	default :
		throw "wrong instrument, please select one of these : [ piano, trumpet, flute, violin, drum]";
}

setInterval(function () {
	infosFromMusician.timeStamp = moment();
	var payload = JSON.stringify(infosFromMusician);
	var message = new Buffer(payload);

	socket.send(message, 0, message.length, PROTOCOL.PORT , PROTOCOL.ADDRESS,
	function(err, bytes) {
		if(err){
			socket.close();
			throw err;
		}
		console.log("Sending via port : " + socket.address().port + ", ip : " + socket.address().address);
		console.log("Sending payload: " + message);
	});
}, 1000);


