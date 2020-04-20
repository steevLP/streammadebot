const {MessageEmbed} = require('discord.js');
const {cmd_prefix} = require('../config.json');
const fs = require("fs");

module.exports.run = async (client, msg, settings, args) => {

    // Permission Check
    if(!msg.member.hasPermission('ADMINISTRATOR')) return msg.channel.send('Du glaubst ja wohl nicht wirklich, ich lasse dich das machen oder?');

    // !settings opt1 value
    // !settings arg0 args1

    // Prüft ob die eine option angeben ist
    if(!args[0]) return msg.channel.send('ALTER!!!! Was soll ich umstellen?!');

    let write = (settings) => {
        try{
            fs.writeFileSync("./settings.json", JSON.stringify(settings), 'utf-8', (err) => {
                if(err) console.error(err);
            });
        }catch(e){
            console.log(e);
        }    
    }

    switch(args[0]){
        case 'prefix':
            // Prüft ob der wert angegeben ist
            if(!args[1]) return msg.channel.send("man.. Du hattest es doch fast.. Zu was willst du die Prefix ändern..");

            // Alles ist angegeben also kann ich schreiben
            settings.prefix = args[1];
            write(settings);
        break;
        case 'spam':
            if(!args[1]) return msg.channel.send("man.. Du hattest es doch fast.. Wie wo soll der Spam denn sein..?");

            // Alle channel mentions die ich in der Nachricht angebe
            let ch = msg.mentions.channels;            

            // habe ich eine channel mention gemacht?
            if(typeof(ch) == undefined) return msg.channel.send('Der Spamchannel muss eine Mention sein als #channel');

            // Nimm die Id des ersten Channels den ich Mention
            settings.spam = ch.first().id;
            write(settings);
        break;
    }
}

module.exports.help = {
    name: "settings"
}