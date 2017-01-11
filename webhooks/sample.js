module.exports = (webserver) => {
  webserver.get('/sample',(req,res) => {
    controller.log("sample...");
    const Exec = require('child_process').exec;
    Exec('ls -al', (err,stdout,stderr) => {
      controller.log(`'ls -al' \n STDERR: ${err} \n STDOUT: ${stdout}`);

      if ( err ) {
        res.send(err);
      }
      else {
        res.send(stdout);
      }
    });
  });
}

