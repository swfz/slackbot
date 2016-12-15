// useradd
controller.hears('my name is (.*)',['direct_message','direct_mention','mention'], (bot,message) => {
  controller.storage.users.get(message.user, (err,data) => {
    if (err) {
        controller.storage.users.save({id: message.user, name: message.match[1], role: 'staff' }, (err)=>{controller.log(err)});
        bot.reply(message,`hi! ${message.match[1]}. user_id: ${message.user}`);
    }
    else {
      if ( data ) {
        controller.storage.users.save({id: message.user, name: message.match[1], role: data.role }, (err)=>{controller.log(err)});
        bot.reply(message,`hi! ${message.match[1]}. user_id: ${data.id}`);
      }
    }
  });
});


