require('dotenv').config();
const PREFIX = process.env.PREFIX;

module.exports = {
    name: 'help',
    description: 'Lists all commands, or displays information about a specific one',
    args: false,
    usage: '[command]',
    execute(msg, args, Servers, Timeouts) {
        const data = [];
        const { commands } = msg.client;

        if (!args.length) {
            data.push('Here\'s a list of all my commands:');
            data.push(commands.map(command => `- **${command.name}**`).join('\n'));
            data.push(`\nYou can send \`${PREFIX}help [command name]\` to get info on a specific command!`);
            data.push('All commands have a 3 second cooldown.');

            return msg.author.send(data, { split: true })
	        .then(() => {
		        if (msg.channel.type === 'dm') return;
		        msg.reply('I\'ve sent you a DM with all my commands!');
	        })
	        .catch(error => {
		        console.error(`Could not send help DM to ${msg.author.tag}.\n`, error);
		        msg.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
	        });
        }
        
        const name = args[0].toLowerCase();
        const command = commands.get(name);

        if (!command) {
            return msg.reply('that\'s not a valid command.');
        }
        
        data.push(`**Name:** ${command.name}`);
        data.push(`**Description**: ${command.description}`);
        if (command.usage) data.push(`**Usage**: ${command.usage}`);

        msg.channel.send(data, { split: true });


    },
};