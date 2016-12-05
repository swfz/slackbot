const Exec = require('child_process').exec;
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
        bot.reply(message,`\`\`\`${stdout}\`\`\``);
      }
    });
  });
});
