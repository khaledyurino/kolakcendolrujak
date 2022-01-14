const { User } = require('../models')
const crypt = require('../helpers/cyrpt')
const jwt = require('../helpers/jwt')

class Controller {

    static userRegister(req, res) {
        let newUser = req.body
        User.findOrCreate({
            where: {
                username: newUser.username,
                email: newUser.email,
            },
            defaults: {
                password: newUser.password,
                phonenumber: newUser.phonenumber
            }
        })
            .then(response => {
                if (response[1]) {
                    res.status(400).json({ "Status": "Created", "Message": "New User Registered" })
                } else {
                    res.status(400).json({ "Status": "Failed", "Message": "Username or Email Has Been taken" })
                }
            })
            .then((user, created) => {
                res.json(created);
            })
            .catch(err => {
                console.log(err);

            })


    }

    static userLogin(req, res) {
        let userLogin = req.body
        const { username, password } = userLogin
        User.findOne({
            where: {
                username: userLogin.username
            }
        })
            .then(data => {
                if (crypt.checkPassword(password, data.password)) {
                    let signUser = {
                        username: data.username,
                        email: data.email,
                        phonenumber: data.phonenumber,
                        cendolCount: 0,
                        kolakCount: 0,
                        rujakCount: 0,
                    };
                    let token = jwt.sign(signUser);
                    res.status(200).json({
                        "token":token,
                    })
                }
            })
            .catch(err => res.send(err))
    }
}

module.exports = Controller