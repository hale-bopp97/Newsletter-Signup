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
                }
            }
        ]
    };

    var jsonData = JSON.stringify(data);

    const url = `https://us8.api.mailchimp.com/3.0/lists/${process.env.LIST_ID}/members/`
    console.log(`url ${url}`)
    
    const authKey = `matt1:${process.env.API_KEY}`
    console.log(`authKey: ${authKey}`)

    const options = {
        method: "POST",
        auth: authKey
    } 

    console.log(`options: ${options.method} ${options.auth}`)
    
    const request = https.request(url, options, function(responce) {

        console.log(`request: ${request.url} ${request.options}`)
        console.log(`status: ${responce.statusCode}`)

        responce.on("data", function(data) {
        
            console.log(JSON.parse(data));
        
        })

        if (responce.statusCode === 200) {
            res.sendFile(__dirname + `/success.html`)
        } else {
            res.sendFile(__dirname + `/failure.html`)
        }
    
    })

    request.write(jsonData)

})

app.post('/failure', function(req, res) {

    res.redirect('/')
    
})

app.listen(port, function() {
  
    console.log(`server listening on port ${port}`)
    // console.log(api key: ${process.env.API_KEY} list id: ${process.env.LIST_ID})

})