//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const formidable = require('formidable');
const fs = require('fs');
parseString = require("xml2js").parseString;
xml2js = require("xml2js");

const app = express();

let fileName = null;
let manipulateSuccess = false;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.post('/', (req, res, next) => {

    const form = formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function (name, file){
        file.path = __dirname + '/uploads/' + 'uploaded_file.xml';
        fileName = name;
    });

    if(fileName === null){
        res.send("No file selected");
        return;
    }

    form.on('file', function(name, file){
        console.log('Uploaded ' + file.name);
        manipulateSuccess = Manipulate();
    });

    if(manipulateSuccess){
        res.sendFile(__dirname + '/download.html');
    } else {
        res.send("Conversion failed - please try again");
    }

});

app.post('/download', (req, res) => {
    res.download(__dirname + "/for_download/file_for_download.xml", 'new.xml', function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successful download");
        }
      });
});

function Manipulate(){  
    fs.readFile(__dirname + "/uploads/uploaded_file.xml", "utf-8", function(err, data) {
        if (err) {
            console.log(err);
            return false;
        }

        parseString(data, function(err, result) {
          if (err) {
            console.log(err);
            return false;
          } 

          delete result.record.services[0].dms_customer_key;
          delete result.record.services[1].dms_customer_key;

          var builder = new xml2js.Builder();
          var xml = builder.buildObject(result);

          fs.writeFile(__dirname + "/for_download/file_for_download.xml", xml, function(err, data) {
          if (err) {
              console.log(err);
              return false;
          }

          console.log("successfully written our update xml to file");
            });
        });
    });
    return true;
}










app.listen(3000, function(){
    console.log("Server running on port 3000");
});