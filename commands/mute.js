module.exports = {
    name: 'mute',
    description: 'Mutes the user.',
    execute(msg, args) {
        if (args.length > 0) {
            return msg.reply('The mute command does not take arguments.');
        }
        let mutedRole = msg.guild.roles.cache.find(r => r.name === 'Muted');
        msg.member.roles.add(mutedRole.id);
        msg.reply('You are now muted.');        
    },
};
