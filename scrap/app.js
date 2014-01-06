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
  , fs = require('fs')
  , sizeof = require('image-size');

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
var size = new String(process.argv[3]);

var opewidth = size.substring(0, 3);
var posx = size.search('x');
var width = size.substring(3, posx);
var opeheight = size.substring(posx+1, posx+4);
var height = size.substring(posx+4, size.length);

var url = [];

if (link)
{
    request(link, function(err, res, body){
	if (!err && res.statusCode == 200) {
	    var $ = cheerio.load(body);
	    $('img').each(function(){
		var img = this.attr('src');
		if (img.match('data:')) {
		    return;
		}
		else if ((!img.match('.png')) || (!img.match('.jpg')) || (!img.match('.jpeg')))
		    url.push(img); 
	    });
	    /*	    console.log(url);
		    for (var i = 0; i < url.length; i++) {
		    request(url[i]).pipe(fs.createWriteStream('myimg/' + i));
		    }*/
	}
    });
    var file = fs.readdirSync('myimg');
    for(var i = 0; file[i]; i++) {
	var way = 'myimg/' + file[i]; 
	sizeof(way, function(err, doc) {
	    console.log(doc.width, doc.height);
	});
    };
} else {
    console.log("Usage : node app.js (link)");
    process.exit();
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
