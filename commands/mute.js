module.exports = {
    name: 'mute',
    description: 'Mutes the user.',
    args: false,
    execute(msg, args) {
        let mutedRole = msg.guild.roles.cache.find(r => r.name === 'Muted');
        msg.member.roles.add(mutedRole.id);
        msg.reply('you are now muted.');        
    },
};
