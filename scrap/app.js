/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , request = require('request')
  , cheerio = require('cheerio')
  , fs = require('fs');

var app = express();

// all environments
app.set('port', process.env.PORT || 3001);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var link = process.argv[2];
var url = [];

if (link)
{
    request(link, function(err, res, body){
	if (!err && res.statusCode == 200) {
	    var $ = cheerio.load(body);
	    $('img').each(function(){
		var img = this.attr('src');
		if (img.match('data:')){
		    return;
		}
		else if ((!img.match('.png')) || (!img.match('.jpg')) )
		    url.push(img); 
	    });	
	    console.log(url);
	    for (var i = 0; i < url.length; i++) {
		request(url[i]).pipe(fs.createWriteStream('myimg/' + i));
	    }
	}
    });
} else {
    console.log("Usage : node app.js (link)");
    process.exit();
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
