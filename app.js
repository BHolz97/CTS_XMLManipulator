//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const formidable = require('formidable');

//TODO
//Check out "multiple"

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.post('/', (req, res, next) => {
    // const form = formidable({ multiples: true });
   
    // form.parse(req, (err, fields, files) => {
    //   if (err) {
    //     next(err);
    //     return;
    //   }
    //   console.log(files.fileto);
    //   res.json({ fields, files });
    // });

    const form = formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function (name, file){
        file.path = __dirname + '/uploads/' + file.name;
    });

    form.on('file', function(name, file){
        console.log('uploaded' + file.name);
    });

    res.sendFile(__dirname + '/index.html');
});

app.post('/download', (req, res) => {
    res.download(__dirname + '/uploads/HelloWorld.txt', 'HelloWorld.txt', function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfull doanload");
        }
      });
});










app.listen(3000, function(){
    console.log("Server running on port 3000");
});