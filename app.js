const Botkit = require('botkit');
const Fs = require('fs');
const Path = require('path');

if (!process.env.SLACK_TOKEN) {
  console.log('Error: Specify SLACK_TOKEN in environment');
  process.exit(1);
}

controller = Botkit.slackbot({
    debug: false,
    json_file_store: './storage'
});

controller.spawn({
    token: process.env.SLACK_TOKEN
}).startRTM(function(err){
    if (err) {
        throw new Error(err);
    }
});

//server start
const port = process.env.botkit_port || '3300'
controller.setupWebserver(port, (err,webserver) => {
  webserver.get('/ping',(req,res) => {
    controller.log("ping...");
    res.send('pong!');
  });
  controller.createWebhookEndpoints(webserver);
});

// users {"id":"xxxxxx","name":"username","role":"admin"}
// users {"id":"xxxxxx","name":"username","role":"staff"}
// usage
controller.hears('help', ['direct_message','direct_mention','mention'],(bot,message) => {
  const usage = `
\`\`\`
Usage: @bot <command> [args]
    require mention

Common commands:
    help                           help
    my name is [username]          create user data
    cmd        [command]           execute shell command(admin)
    usermod    [userid] [role]     user role modification(admin)
\`\`\`
`
  bot.reply(message,usage);
});

// load commands in scripts/*
const load = (path, file) => {
  const ext  = Path.extname(file);
  const full = Path.join(path, Path.basename(file, ext));

  try {
    const script = require(full);
    if (typeof script === 'function') {
      script(this);
    }
  } catch(error) {
    console.log(error);
    process.exit(1);
  }
};

const path = Path.resolve('.', 'scripts')

loadFiles = Fs.readdirSync(path).filter((file)=>{return !file.match(/\..*.swp/)})
loadFiles.sort().forEach((file) =>{
  load(path, file);
});

