// server.js
var fs = require("fs");
var express = require("express");
var logfmt = require("logfmt");
var app = express();
var pg = require('pg');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
app.use(logfmt.requestLogger());
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));
app.use(app.router);

var User = (function () {
	var usersById = {};
	var usersByName = {};
	var User = function(obj) {
		this.id = obj.id;
		this.validPassword = function(password) {
			return obj.password == password;
		}
		usersById[obj.id] = this;
		usersByName[obj.username] = this;
	};
	User.findById = function(id, callback) {
		callback(null, usersById[id]);
	};
	User.findOne = function(obj, callback) {
		callback(null, usersByName[obj.username]);
	};
	return User;
})();

new User({id: '1', username: 'admin', password: 'abc123'});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);

app.get('/', function(req, res) {
    fs.readFile(__dirname + '/public/index.html', 'utf8', function(err, text){
        res.send(text);
    });
});

app.get('/umaUri', function(req, res) {
	if (req.user) {
		res.send('Vc esta logado');
	} else {
		res.send("vc nao esta logado");
	}
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on " + port);
});
