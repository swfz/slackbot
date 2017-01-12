module.exports = (webserver) => {
  const Exec = require('child_process').exec;
  webserver.get('/resque_stop',(req,res) => {
    const ip = req.query["ip"]

    if ( !ip ) {
      res.status(400).send("error. not found query params 'ip'");
      return;
    }
    if ( !ip.match( /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/ ) ) {
      res.status(400).send("invalid parameter 'ip'");
      return;
    }

    //const command = `cd /var/www/app && bundle exec cap --hosts=${ip} production resque:stop`
    command = `id && echo ${ip}`
    Exec(command, (err,stdout,stderr) => {
      controller.log(`'resque_stop' \n STDERR: ${err} \n STDOUT: ${stdout}`);
      if ( err ) {
        console.log(err)
        res.status(500).send(err)
      }
      else {
        res.status(200).send(stdout)
      }
    });
  });
}
