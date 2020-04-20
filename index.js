const discord = require("discord.js")
const client = new discord.Client()

client.commands = new discord.Collection();

const {token} = require("./config.json");
const fs = require('fs');

fs.readdir('./cmd', (err, files) => {
    if (err) console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if (jsfile.length <= 0) {
        console.log("[sys-cmd]: Befehle konnten nicht gefunden werden");
        return;
    }

    jsfile.forEach((f) => {
        let props = require(`./cmd/${f}`);
        console.log(`[sys-cmd]: ${f} [loaded]`);
        client.commands.set(props.help.name, props);
    });
});

client.on("ready",() => {
	console.log("Bot ready!\n at " + Date())
})

client.on("message",async (msg) => {
    let sImport = fs.readFileSync('./settings.json');
    let settings = JSON.parse(sImport);
    let cmd_prefix = settings.prefix;
    // Antwortet und reagiert auf nachricht
    if(msg.content.toLowerCase() === "hallo"){
        await msg.react("👋");
        await msg.reply("Hallo ^^");
    }
    if (msg.author.bot) {return}
	if (!msg.member) {return}

	if (!msg.content.startsWith(cmd_prefix)) {return}

	await msg.delete().catch(console.error);

    // custom handler:
    // Lädt die Custom Commands Datei
    let custom = fs.readFileSync("./custom.json");
    let translated = JSON.parse(custom);

    // Schaut ob ein command mit dem namen existiert
    translated.forEach(c => {
        if(msg.content === cmd_prefix + c.name){
            if(msg.channel.id != settings.spam)return msg.channel.send(`Custom Commands gehen nur in <#${settings.spam}>`);
            msg.channel.send(c.nachricht);
        }
    })

    // Command Handler
	let messageArray = msg.content.split(" ");
	let cmd = messageArray[0];
	let args = messageArray.slice(1);
    let commandfile = client.commands.get(cmd.slice(cmd_prefix.length));
    
	// Führt die Command file(Befehl) aus und gibt ihm alle gegebenen werte die der bot handled und mit gibt
	if (commandfile) commandfile.run(client, msg, settings, args);

})

client.login(token);
