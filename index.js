/*
Feature ideas:

- Being able to mute yourself for specific amount of time.
- Setting goals with timed reminders.
- Not muting but restricting messages (muting if you are too active).
- Adding an accountability partner that will additionally be reminded to keep an eye on you.
- (Not sure if this one is possible), keeping an eye on status (offline, online, etc).
- Help command
- Will probably use emoji reactions for management.

*/

const fs = require('fs');
const Discord = require('discord.js');
const { Sequelize } = require('sequelize');


// Loading commands
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
commandFiles.forEach(file => {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
});


// Initiating cooldowns collection
const commandCooldowns = new Discord.Collection();


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


// Initialising database
const sequelize = new Sequelize('database', 'username', 'password', { // ask about this
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});
const Timeouts = sequelize.define('timeouts', { 
    user: {
        type: Sequelize.INTEGER, // User ID
    },
    cooldown: {
        type: Sequelize.INTEGER,
    },
    comment: {
        type: Sequelize.TEXT,
    },
    buddy: {
        type: Sequelize.INTEGER, // User ID
    },
    messageLimit: {
        type: Sequelize.INTEGER,
    },
    server: {
        type: Sequelize.TEXT,
    }
});
const Servers = sequelize.define('servers', {
    server: {
        type: Sequelize.TEXT, // Server ID
        unique: true,
    },
    prefix: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: PREFIX,
    },
    mutedRole: {
        type: Sequelize.TEXT, // Role ID
    }
});

// Clearing timeouts
function clearTimout() {
    // Code for checking and clearing relevant timeouts
}
const clearingInterval = 10 * 60 * 1000; // 10 minutes
setInterval(clearTimout, clearingInterval);

// Initial function calls
client.once('ready', () => {
    Servers.sync();
    Timeouts.sync();
    clearTimout();
    console.log('Ready!');    
});


client.on('message', async msg => {
    if (!msg.content.startsWith(PREFIX) || msg.author.bot) return;

    // Making sure command is valid
	const args = msg.content.slice(PREFIX.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
    if (msg.channel.type === 'dm' && commandName !== 'help') return msg.reply('I am a server-only bot! The only command that works in DMs is the help command.');
    if (!client.commands.has(commandName)) return msg.reply('Command not found.');

    const command = client.commands.get(commandName);
    if (command.args && !args.length) {
        return msg.reply(`the ${command.name} command requires arguments. Expected usage: ${command.usage}.`);
    } 


    // Handling cooldowns
    if (!commandCooldowns.has(command.name)) {
        commandCooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = commandCooldowns.get(command.name);
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

    // Checking permissions
    if (command.perms) {
        const member = msg.guild.members.cache.find(mem => mem.id === msg.author.id);
        if (!member.hasPermission(command.perms)) {
            return msg.reply('you do not have sufficient permissions to execute this command.');
        }
    }


    // Executing command
    try {
	    command.execute(msg, args, Servers, Timeouts);
    } catch (error) {
	    console.error(error);
	    msg.reply('there was an error trying to execute that command! Did you make sure you used the command correctly? Check with the help command.');
    }


});

client.login(TOKEN);
