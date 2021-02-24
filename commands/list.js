module.exports = {
    name: 'list',
    description: 'Lists all tagged users',
    args: true,
    usage: '<user1> <user2> etc',
    execute(msg, args) {
        const taggedUsers = msg.mentions.users;
        if (taggedUsers.size > 0) {
            taggedUsers.forEach(user => msg.channel.send(`Hey there, ${user.username}!`));
            return;
        }
        msg.reply('list command requires tagged users.');
    },
};