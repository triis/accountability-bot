const PREFIX = process.env.PREFIX;

module.exports = {
    name: 'help',
    description: 'Lists all commands, or displays information about a specific one',
    args: false,
    execute(msg, args) {
        const data = [];
        const { commands } = msg.client;

        if (!args.length) {
            msg.reply("it's working");
        }
    },
};