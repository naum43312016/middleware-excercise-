const express = require('express');
const fs = require('fs');
const app = express();
const port = 3001;

app.use(express.json());
app.use((req,res,next) => {
  let miliseconds = new Date().getTime();
  res.on('finish', () => {
     const data = {
      url: req.originalUrl,
      method: req.method,
      Duration: new Date().getTime()-miliseconds + " ms"
    }
    fs.writeFile('log.txt', JSON.stringify(data) + '\n',  {'flag':'a'},  (err) => {
      if (err) {
        console.log("Error log file not updated")
      }else{
        console.log("Log file updated")
      }
    });
  })
  next();
})
app.get('/', (req, res) => {
  fs.readFile('content.txt', 'utf8',(err,data) => {
    if(err){
      res.status(404).send("Error file not found")
    }else{
      res.send(data);
    }
  });
})

app.post('/add', (req,res) => {
  const body = req.body;
  fs.writeFile('content.txt', body.text + '\n',  {'flag':'a'},  (err) => {
    if (err) {
      res.send("Bad Request")
    }else{
      res.send("Text added")
    }
  });
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
})