module.exports = {
    name: 'mute',
    description: 'Mutes the user.',
    args: true,
    usage: '<minutes (integer)>',
    async execute(msg, args, Servers, Timeouts) {
        const server = await Servers.findOne({ where: { server: msg.guild.id } });
        if (!server) {
            return msg.channel.send('This server does not have a Muted role. Please ask an admin to create one, using the setmute command.');
        }
        
        const mutedRoleID = server.mutedRole;
        const mutedRole = msg.guild.roles.cache.find(r => r.id === mutedRoleID);
        msg.member.roles.add(mutedRole);

        

        msg.reply('you are now muted.');
    },
};
