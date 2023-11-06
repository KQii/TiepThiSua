const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { getUserByPhonenumber } = require('./app/models/Account');

async function initialize(passport, getUserByPhonenumber) {
    const authenticateUsers = async (phonenumber, password, done) => {
        try {
            const user = await getUserByPhonenumber(phonenumber);
            if (!user) {
                return done(null, false, { message: "No user found with that phonenumber" });
            }
            const isPasswordValid = await bcrypt.compare(password, user.MATKHAU);
            if (isPasswordValid) {
                return done(null, user);
            } else {
                return done(null, false, { message: "Password incorrect" });
            }
        } catch (error) {
            console.log(error);
            return done(error);
        }
    };

    passport.use(new LocalStrategy({ usernameField: 'phonenumber' }, authenticateUsers));
    passport.serializeUser((user, done) => done(null, user.TENTK));
    passport.deserializeUser(async (phonenumber, done) => {
        try {
            const user = await getUserByPhonenumber(phonenumber);
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    });
}

module.exports = initialize;
