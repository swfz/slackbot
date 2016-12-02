const Botkit = require('botkit');
const Exec = require('child_process').exec;

if (!process.env.token) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

const controller = Botkit.slackbot({
    debug: false,
    json_file_store: './storage'
});

controller.spawn({
    token: process.env.token
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
Usage: @bot <command> [args]
    require mention

Common commands:
    help                           help
    my name is [username]          create user data
    cmd        [command]           execute shell command(admin)
    usermod    [userid] [role]     user role modification(admin)
`
  bot.reply(message,usage);
});

// useradd
controller.hears('my name is (.*)',['direct_message','direct_mention','mention'], (bot,message) => {
  controller.storage.users.get(message.user, (err,data) => {
    if (err) {controller.log(err)}
    else {
      if ( data ) {
        controller.storage.users.save({id: message.user, name: message.match[1], role: data.role }, (err)=>{controller.log(err)});
        bot.reply(message,`hi! ${message.match[1]}. user_id: ${data.id}`);
      }
      else {
        controller.storage.users.save({id: message.user, name: message.match[1], role: 'staff' }, (err)=>{controller.log(err)});
        bot.reply(message,`hi! ${message.match[1]}. user_id: ${message.user}`);
      }
    }
  });
});

// usermod
controller.hears('usermod (.*) (.*)',['direct_message','direct_mention','mention'], (bot,message) => {
  controller.storage.users.get(message.user, (err,data) => {
    if (err) {controller.log(err)}
    else {
      if ( data.role != 'admin' ) {
        bot.reply(message,'Error! Not Permitted. your role is not damin.');
      }

      let userId = message.match[1];
      let role   = message.match[2];
      if ( !userId && !role ) {
        bot.reply(message,'Error! Not Enough Params. try `usermod ${user_id} ${role}`');
      }

      controller.storage.users.save({id: userId, name: data.name, role: role }, (err)=>{controller.log(err)});
      bot.reply(message,`modified. ${data.name}. user_id: ${data.id}`);
    }
  });
});

// exec command
controller.hears('cmd (.*)',['direct_message','direct_mention','mention'],(bot,message) => {
  controller.storage.users.get(message.user,(err,data) => {
    if (err){console.log(err);return}
    else if ( !data.role || data.role != 'admin' ) {
      bot.reply(message,'permission denied.');
      return;
    }
    Exec(message.match[1], (err,stdout,stderr) => {
      controller.log(`${message.user} : ${message.match[1]} \n STDERR: ${err} \n STDOUT: ${stdout}`);

      if ( err ) {
        bot.reply(message,`Error!!!\n${err}`);
      }
      else {
        bot.reply(message,stdout);
      }
    });
  });
});

