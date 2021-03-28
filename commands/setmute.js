module.exports = {
    name: 'setmute',
    description: 'Sets the mute role for the server. If more than one argument are given, the first will be used',
    args: true,
    usage: '<role id>',
    perms: 'ADMINISTRATOR',
    async execute(msg, args, Servers, Timeouts) {      
        const newMutedRole = args[0];
        const mutedRole = msg.guild.roles.cache.find(r => r.id === newMutedRole);
        if (!mutedRole) {
            return msg.reply('that role cannot be found. Make sure you input the exact ID');
        }

        const server = await Servers.findOne({ where: { server: msg.guild.id } });
        
        if (!server) {
            await Servers.create({ 
                server: msg.guild.id,
                mutedRole: newMutedRole,
            });
        } else {
            await server.update({ mutedRole: newMutedRole });
        }

        msg.reply(`muted role set to ${mutedRole.name}`);

    },
};