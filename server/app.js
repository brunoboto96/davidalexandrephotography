const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const details = require("./details.json");

const app = express();
app.use(cors({ origin: "*" }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('body-parser').json());

app.listen(3000, () => {
    console.log("The server started on port 3000 😃!!!!!!");
});

app.get("/", (req, res) => {
    res.send(
        "<h1 style='text-align: center'>Welcome to David backend <br><br>😃👻😃👻😃👻😃👻😃</h1>"
    );
});

app.post("/api/sendmail", (req, res) => {
    console.log("request came");
    let data = []
    req.on('data', chunk => {
        console.log(data.push(chunk))
        
        let payload = JSON.parse(data) 
        sendMail(payload, info => {
            console.log(`The mail has been sent 😃 and the id is ${info.messageId}`);
            res.send(info);
        })
    })
    
    /*
    let payload = req.body;
    /*
    sendMail(payload, info => {
        console.log(`The mail has been sent 😃 and the id is ${info.messageId}`);
        res.send(info);
    });*/
});

async function sendMail(payload, callback) {
    try {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: details.host,
            port: details.port,
            secure: details.secure, // true for 465, false for other ports
            auth: {
                user: details.email,
                pass: details.password
            }
        });

        let mailOptions = {
            from: '"'+payload.name+'"<'+details.email+'>', // sender address
            replyTo: payload.email,
            to: details.email, // list of receivers
            subject: 'ContactForm: ' + payload.subject, // Subject line
            /*html: `<h1>Hi ${payload.name}</h1><br>
    <h4>Thanks for joining us</h4>`*/
            html: payload.body
        };

        // send mail with defined transport object
        let info = await transporter.sendMail(mailOptions);

        callback(info);
    } catch (e) {
        console.log(e);
    }
}

// Created by Bruno Boto