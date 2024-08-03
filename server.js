import express from 'express';
import { credentials, details } from './userdata.js';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { log } from 'console';
const app = express();
const port = 3000;

// Define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// use static assets
app.use(express.static('./public'))

// Parse form data
app.use(express.urlencoded({ extended: false }))

app.get('/login', (req, res) => {
    res.status(200).sendFile(path.resolve(__dirname, 'public/login.html'));
})

app.get('/api/usercredentials', (req, res) => {
    res.status(200).json(credentials);
})

app.get('/api/userdata', (req, res) => {
    res.status(200).json(details);
})

app.get('/signup', (req, res) => {
    res.status(200).sendFile(path.resolve(__dirname, 'public/signup.html'));
})

app.post('/submit-login/', (req, res) => {
    const { name, password } = req.body;
    let nameMatch = false;
    let passwordMatch = false;
    let userIndex = 0;

    credentials.forEach((element, index) => {
        if (credentials[0]) {
            if (element.username == name.toLowerCase()) {
                nameMatch = true;
                if (element.password == password) {
                    passwordMatch = true;
                    userIndex = index;
                }
            }
        }
    });

    if (nameMatch) {
        if (passwordMatch) {
            if (name) {
                res.redirect(`/user?name=${name.toLowerCase()}`);
            }
            else
                res.status(401).send("Please provide a valid username")
        }
        else
            res.status(401).send("Incorrect username or password");
    }
    else {
        res.status(401).send("User not registered")
    }
})

app.get('/user', (req, res) => {
    res.sendFile(__dirname + '/public/userPage.html');
});

app.post('/account_created', (req, res) => {
    const { name, password } = req.body;
    let user_exists = false;

    if (credentials[0]) {
        credentials.forEach(element => {
            if (element.username == name.toLowerCase()) {
                user_exists = true;
            }
        })
    }

    if (!user_exists) {
        if (name) {
            res.status(200).send(`You are successfuly signed up ${name}`);
            credentials.push(
                { username: name, password: password }
            )
        }
        else
            res.status(401).send("Please provide a valid username")
    }
    else
        res.status(409).send("User already exists! Use a different username")
})

app.get('/change_user_password', (req, res) => {
    res.sendFile(__dirname + '/public/changePass.html');
})

app.post('/password_changed', async (req, res) => {
    const { user } = req.query;
    const { new_password } = req.body;
    try {
        const response = await axios.put(`http://localhost:3000/api/update_userdata/${user}/${new_password}`);

        if (response.status === 200) {
            res.send(`Changed password for ${user} to ${new_password}`);
        } else {
            res.status(response.status).send('Failed to update password');
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }

})

app.put('/api/update_userdata/:person_name/:person_pass', (req, res) => {
    const { person_name, person_pass } = req.params;

    let user_exists = false;

    if (credentials[0]) {
        credentials.forEach(element => {
            if (element.username == person_name.toLowerCase()) {
                user_exists = true;
                element.password = person_pass;
                res.status(200).send("Password updated successfully");
            }
        })
    }

    if (!user_exists) {
        res.status(401).send("Please provide a valid username")
    }
})


app.listen(port);