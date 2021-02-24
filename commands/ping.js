module.exports = {
	name: 'ping',
	description: 'Ping!',
	args: false,
	execute(msg, args) {
		msg.channel.send('Pong.');
	},
};