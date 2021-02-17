const Discord = require('discord.js');
const client = new Discord.Client();

// Load environment variables
require('dotenv').config();
const TOKEN = process.env.TOKEN;
const PREFIX = process.env.PREFIX;

client.once('ready', () => {
    console.log('Ready!');
    
});

client.on('message', msg => {
    if (!msg.content.startsWith(PREFIX) || msg.author.bot) return;
    const args = msg.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();


    if (command === 'ping') {
        msg.channel.send('Pong!');
    } else if (command === 'mute') {
        let mutedRole = msg.guild.roles.cache.find(r => r.name === 'Muted');
        msg.member.roles.add(mutedRole.id);
        msg.channel.send('You are now muted.');
    } else if (command === 'unmute') {
        let mutedRole = msg.member.roles.cache.find(r => r.name === 'Muted');
        if (mutedRole) {
            msg.member.roles.remove(mutedRole.id);
        } else {
            msg.channel.send('You are not muted');
        }
    } else if (command === 'list') {
        const taggedUsers = msg.mentions.users;
        taggedUsers.forEach(user => msg.channel.send(`Hey there, ${user.username}!`));
    }
});


client.login(TOKEN);
