require('dotenv').config()

const express    = require('express')
const app        = express()
const bodyParser = require('body-parser')
const request    = require('request')
const https      = require('https')

const port = process.env.PORT || 3000

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function(req, res) {

    res.sendFile(__dirname + '/signup.html')

})

app.post('/', function(req, res) {

    const firstName = req.body.fName;
    const lastName  = req.body.lName;
    const email     = req.body.email;

    console.log(`${firstName} ${lastName} ${email}`)

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                },
            },
        ],
    };

    const jsonData = JSON.stringify(data);

    const url = `https://us8.api.mailchimp.com/3.0/lists/${process.env.LIST_ID}`
    
    const options = {
        method: "POST",
        auth: `matt1:${process.env.API_KEY}`
    } 
    
    const request = https.request(url, options, function(responce) {
        responce.on("data", function(data) {
            console.log(JSON.parse(JSON.stringify(data)));
        })
    })

    request.write(jsonData)

})

app.listen(port, function() {
    console.log(`server listening on port ${port}`)
    // console.log(api key: ${process.env.API_KEY} list id: ${process.env.LIST_ID})

})