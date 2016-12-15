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

      controller.storage.users.get(userId, (err,target) => {
        if (err) {
          controller.log(err)
          bot.reply(message,'Error! Undefined User. Please Input UserId. "usermod U0XXXXXXX role"');
        }
        else {
          controller.storage.users.save({id: userId, name: target.name, role: role }, (err)=>{controller.log(err)});
          bot.reply(message,`modified. ${target.name} is ${role}. user_id: ${data.id}`);
        }
      })
    }
  });
});
