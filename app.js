//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const formidable = require('formidable');
const fs = require('fs');
parseString = require("xml2js").parseString;
xml2js = require("xml2js");

//TODO
//Check out "multiple"

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res){
    ///////////////////////////////////////////////////////
    // fs.readFile(__dirname + '/uploads/HelloWorld.txt', 'utf8', function (err,data) {
    //     if (err) {
    //       return console.log(err);
    //     }
    //     console.log(data);
    //   });
      /////////////////////////////////////////////////////
    res.sendFile(__dirname + "/index.html");
});

app.post('/', (req, res, next) => {

    const form = formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function (name, file){
        file.path = __dirname + '/uploads/' + 'uploaded_file.xml';
    });

    form.on('file', function(name, file){
        console.log('Uploaded ' + file.name);
        ParseXmlToJson();
    });

    res.sendFile(__dirname + '/index.html');
});

app.post('/download', (req, res) => {
    res.download(__dirname + "/for_download/file_for_download.xml", 'new.xml', function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfull doanload");
        }
      });
});

function ParseXmlToJson(){
    fs.readFile(__dirname + "/uploads/uploaded_file.xml", "utf-8", function(err, data) {
        if (err) console.log(err);

        //console.log("*****************DATA:");
        //console.log(data);

        parseString(data, function(err, result) {
          if (err) console.log(err);

        //   console.log("*****************RESULT:");
        //   console.log(typeof(result));
        //   console.log(JSON.stringify(result));

          //const jsonData = JSON.parse(result);
          //console.log(result.record.services[0].dms_customer_key[0]);

          delete result.record.services[0].dms_customer_key;
          delete result.record.services[1].dms_customer_key;

          //console.log(JSON.stringify(result));

          var builder = new xml2js.Builder();
          var xml = builder.buildObject(result);

          fs.writeFile(__dirname + "/for_download/file_for_download.xml", xml, function(err, data) {
          if (err) console.log(err);

          console.log("successfully written our update xml to file");
          });
        });
      });
}










app.listen(3000, function(){
    console.log("Server running on port 3000");
});