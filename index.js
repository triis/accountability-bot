const dotenv = require('dotenv');
const Discord = require('discord.js');
const client = new Discord.Client();

dotenv.config();
const TOKEN = process.env.TOKEN;
const PREFIX = process.env.PREFIX;

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', msg => {
    console.log(`${msg.content} in ${msg.channel}`);
    if (msg.content === PREFIX+'ping') {
        msg.channel.send('Pong!');
    }
});


client.login(TOKEN);
