module.exports = {
    name: 'mute',
    description: 'Mutes the user.',
    args: true,
    usage: '<minutes (integer) comment (optional)>',
    async execute(msg, args, Servers, Timeouts) {
        const server = await Servers.findOne({ where: { server: msg.guild.id } });
        if (!server) {
            return msg.channel.send('This server does not have a Muted role. Please ask an admin to create one, using the setmute command.');
        }
        
        const mutedRoleID = server.mutedRole;
        const mutedRole = msg.guild.roles.cache.find(r => r.id === mutedRoleID);
        msg.member.roles.add(mutedRole);
        const muteTime = args[0];
        let comment = '';
        for (let i = 1; i < args.length; i++) {
            comment = comment + args[i] + ' '; // concatenating all arguments after time
        }
        comment = comment.trim();
        await Timeouts.create({
            user: msg.author.id,
            cooldown: muteTime,
            comment: comment,
            messageLimit: 0,
        });
        
        msg.author.send(comment)
        .catch(error => {
            console.error(`Could not send help DM to ${msg.author.tag}.\n`, error);
            msg.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
        });
        msg.reply(`you are now muted for ${muteTime} minutes. Your comment has been DM'ed to you, so that it's easily accessible if you get distracted by Discord anyway ;)`);
    },
};
