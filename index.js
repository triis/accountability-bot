const fs = require('fs');
const Discord = require('discord.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
commandFiles.forEach(file => {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
});


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

    if (!client.commands.has(command)) return msg.channel.send('Command not found.');

    try {
	    client.commands.get(command).execute(msg, args);
    } catch (error) {
	    console.error(error);
	    msg.reply('there was an error trying to execute that command!');
    }


});


client.login(TOKEN);
