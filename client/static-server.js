// modules =================================================
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/build'));
// routes ==================================================
app.get('*', function (req, res) {
    res.sendfile('./build/index.html');
});
// start app ===============================================
app.listen(port);
console.log('Magic happens on port ' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app