var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;

var User = require("../models/user-model");
require("dotenv").config({ path: __dirname + "../.env" });

module.exports = function (passport) {
  var opts = {};
  opts.secretOrKey = process.env.SECRETKEY;
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");

  passport.use(
    new JwtStrategy(opts, function (jwt_payload, done) {
      User.findOne({ id: jwt_payload.id }, function (err, user) {
        if (err) {
          return done(err, false);
        }
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      });
    })
  );
};
