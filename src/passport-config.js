const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const Account = require('../app/models/Account');

async function getUserByPhonenumber(phonenumber) {

}

function initialize(passport, getUserByphonenumber) {
    // Function to authenticate users
    const authenticateUsers = async (phonenumber, password, done) => {
        // Get users by phonenumber
        const user = await Account.getUserByPhonenumber(phonenumber);
        if (user == null) {
            return done(null, false, { message: "No user found with that phonenumber" });
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, { message: "Password Incorrect" });
            }
        } catch (e) {
            console.log(e);
            return done(e);
        }
    };

    passport.use(new LocalStrategy({ usernameField: 'phonenumber' }, authenticateUsers));
    passport.serializeUser((user, done) => done(null, user.phonenumber));
    passport.deserializeUser(async (phonenumber, done) => {
        const user = await getUserByphonenumber(phonenumber);
        return done(null, user);
    });
}

module.exports = initialize;
