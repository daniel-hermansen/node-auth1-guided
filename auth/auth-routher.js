const router = require('express').Router();
const Users = require('../users/users-model.js');
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;

    try {
        const saved = await Users.add(user);
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json(error);
    }
});

router.post('/login', async (req, res) => {
    let { username, password } = req.body

    try{
        const user = await Users.findBy({ username }).first();
        req.session.user = user;
        res.status(200).json({ message: `Welcome ${user.username}!`, });
        if(user && bcrypt.compareSync(password, user.password)){
            req.session.user = user;
            res.status(201).json({ message: `welcome ${username}` });
        } else {
            res.status(401).json({ errorMessage: 'invalid credentials '});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.delete('/logout', (req, res) => {
    if (req.session) {
        // check out the documentation for this method at
        // https://www.npmjs.com/package/express-session, under
        // Session.destroy().
        req.session.destroy((err) => {
            if (err) {
                res.status(400).json({ message: 'error logging out:', error: err });
            } else {
                res.json({ message: 'logged out' });
            }
        });
    } else {
        res.end();
    }
});

module.exports = router;