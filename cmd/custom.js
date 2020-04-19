const {RichEmbed} = require('discord.js');
const fs = require('fs');
module.exports.run = async (client, msg, args) => {
    /*[{ "name":"nachricht" }].foreach()*/
    // !custom create name nachricht
    // !custom arg[0] arg[1] arg[2]
    if(!msg.member.hasPermission('MANAGE_EMOJIS')) return msg.reply("Du kannst das nicht!!!!");
    if(!args[0]) return msg.channel.send("Was soll ich tun?");

    // Lädt die Custom Commands Datei
    let custom = fs.readFileSync("./custom.json");
    let translated = JSON.parse(custom);


    let message = args.join(" ").slice(1 + args[0].length +1+ args[1].length);

    // Entscheidet er was er tun soll
    if(args[0] === "create"){
        // Prüft ob die Werte angeben sind
        if(!args[1]) return msg.channel.send("Wie soll das bitte heißen?");
        if(!args[2]) return msg.channel.send("Was soll das bitte tun?");
        let can_write = true;

        translated.forEach(c => {
            if(args[1] === c.name){
                can_write = false;
                msg.channel.send("Diesen Command gibt es schon").then(m => {
                m.delete({timeout:5000}).catch(console.error);
            });
            }
        });

            if(!can_write) return;
            // erstellt ein Object für den Command
            let command = {
                name:args[1],
                nachricht:message
            }

            translated.push(command);

            // Legt in in der Command Datei ab
            try{
                fs.writeFileSync("./custom.json", JSON.stringify(translated), 'utf-8', (err) => {
                    if(err) console.error(err);
                });
            }catch(e){
                console.log(e);
            }
    }else if(args[0] === "modify"){
        // Sucht den Command in der Datei
        if(translated.indexOf(args[1])){

            // Sucht stellt die item id zum löschen bereit
            for(let i = 0; i < translated.length; i++){
                if(translated[i].name == args[1]){

                    // Läscht das Item
                    console.log("hit: " + i + " " + translated[i].name);
                    translated[i].nachricht = message;

                    // Schreibt die Änderung in die Datei
                    try{
                        fs.writeFileSync("./custom.json", JSON.stringify(translated), 'utf-8', (err) => {
                            if(err) console.error(err);
                        });
                    }catch(e){
                        console.log(e);
                    }
                }
            }
        }else{
            return msg.channel.send('Den Command kenne ich nicht sorry :/')
        }
    }else if(args[0] === "remove"){
        // Sucht den Command in der Datei
        if(translated.indexOf(args[1])){

            // Sucht stellt die item id zum löschen bereit
            for(let i = 0; i < translated.length; i++){
                if(translated[i].name == args[1]){

                    // Läscht das Item
                    console.log("hit: " + i + " " + translated[i].name);
                    delete translated[i];

                    // Schreibt die Änderung in die Datei
                    try{
                        fs.writeFileSync("./custom.json", JSON.stringify(translated), 'utf-8', (err) => {
                            if(err) console.error(err);
                        });
                    }catch(e){
                        console.log(e);
                    }
                }
            }
        }else{
            return msg.channel.send('Den Command kenne ich nicht sorry :/')
        }
    }
}

module.exports.help = {
    name: "custom"
}