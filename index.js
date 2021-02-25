/*
Feature ideas:

- Being able to mute yourself for specific amount of time.
- Setting goals with timed reminders.
- Not muting but restricting messages (muting if you are too active).
- Adding an accountability partner that will additionally be reminded to keep an eye on you.
- (Not sure if this one is possible), keeping an eye on status (offline, online, etc).
- Monitor across servers.
- Help command
- Will probably use emoji reactions for management.

*/

const fs = require('fs');
const Discord = require('discord.js');


// Loading commands
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
commandFiles.forEach(file => {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
});


// Initiating cooldowns collection
const cooldowns = new Discord.Collection();


// Load environment variables
require('dotenv').config();
const TOKEN = process.env.TOKEN;
const PREFIX = process.env.PREFIX;
const env_variables = [TOKEN, PREFIX];
env_variables.forEach(variable => { 
    if (!variable) {
        console.log('The .env file has not been configured properly.');
        process.exit();
    }    
});


client.once('ready', () => {
    console.log('Ready!');
    
});


client.on('message', msg => {
    if (!msg.content.startsWith(PREFIX) || msg.author.bot) return;

    // Making sure command is valid
	const args = msg.content.slice(PREFIX.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
    if (msg.channel.type === 'dm' && commandName !== 'help') return msg.reply('I am a server-only bot! The only commands that works in DMs is the help command.');
    if (!client.commands.has(commandName)) return msg.reply('Command not found.');

    const command = client.commands.get(commandName);
    if (command.args && !args.length) {
        return msg.reply(`the ${command.name} command requires arguments. Expected usage: ${command.usage}.`);
    } 


    // Handling cooldowns
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = 3000;

    if (timestamps.has(msg.author.id)) {
        const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return msg.reply(`you must wait ${timeLeft} seconds before you can use that command again.`);
        }
    }
    timestamps.set(msg.author.id, now);
    setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);


    // Executing command
    try {
	    command.execute(msg, args);
    } catch (error) {
	    console.error(error);
	    msg.reply('there was an error trying to execute that command!');
    }


});


client.login(TOKEN);
