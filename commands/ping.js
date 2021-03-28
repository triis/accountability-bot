module.exports = {
	name: 'ping',
	description: 'Ping!',
	args: false,
	execute(msg, args, Servers, Timeouts) {
		msg.channel.send('Pong.');
	},
};