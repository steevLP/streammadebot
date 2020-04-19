const {MessageEmbed} = require('discord.js');
const {cmd_prefix} = require('../config.json');
const fs = require("fs");

module.exports.run = async (client, msg, args) => {
    // Lädt die Custom Commands Datei
    let custom = fs.readFileSync("./custom.json");
    let translated = JSON.parse(custom);

    let help = new MessageEmbed()
    .setColor("#6665d2")
    .addField(cmd_prefix + "custom <create | remove | modify> <name> <nachricht>","Hiermit kannst du eigene Befehle erstellen")
    translated.forEach(c => {
        help.addField(cmd_prefix + c.name, "Custom Command")
    });

    msg.channel.send(help).then(msg => {
        msg.delete({timeout:5000});
    });

}

module.exports.help = {
    name: "help"
}