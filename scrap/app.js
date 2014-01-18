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
 , sizeof = require('image-size')
 , io = require('socket.io');


var EventEmitter = require('events').EventEmitter;
var fire = new EventEmitter();
var exec = require('child_process').exec;
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
app.use(express.static(path.join(__dirname, 'html')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var html = './html/'
var link = process.argv[2];
var widthsize = new String(process.argv[3]);
var heightsize = new String(process.argv[4]);
var arg = process.argv.length - 1;
var opewidth = 0;
var width = 0;
var opeheight = 0;
var height = 0;
var count = 0;

var url = [];
var file = [];

function	extract(size)
{
    for (var i = 0; i < size.length; i++)
    {
	if (size[i] >= 'a' && size[i] <= 'z')
	    continue;
	else
	    return i;
    }
}

function	init_size()
{
    if (arg == 3 || arg == 4) {
	var pos = extract(widthsize);
	if (pos == 3) {
	    opewidth = widthsize.substring(0, 3);
	    width = widthsize.substring(3, widthsize.length);
	} else if (pos == 6) {
	    opewidth = widthsize.substring(0, 6);
	    width = widthsize.substring(6, widthsize.length);
	}
	if (opewidth == "inf" || opewidth == "equ" || opewidth == "sup" || opewidth == "infequ" || opewidth == "supequ")
	    ;
	else {
	    console.log("incorrect width");
	    process.exit();
	}
    }
    if (arg == 4) {
	var pos = extract(heightsize);
	if (pos == 3) {
	    opeheight = heightsize.substring(0, 3);
	    height = heightsize.substring(3, heightsize.length);
	} else if (pos == 6) {
	    opeheight = heightsize.substring(0, 6);
	    height = heightsize.substring(6, heightsize.length);
	}
	if (opeheight == "inf" || opeheight == "equ" || opeheight == "sup" || opeheight == "infequ" || opeheight == "supequ")
	    ;
	else {
	    console.log("incorrect height");
	    process.exit();
	}
    }
}

function	verif_width(docwidth, name)
{
    console.log('nom : ' +name);
    if (opewidth == "inf") {
	var inferior = (docwidth < width)? "save" :
	    fs.unlink(name, function(err) {
		if (err) {
		    console.log("le fichier n'a pu etre supprimer");
		}
	    });
	return;
    }else if (opewidth == "equ") {
	var equal = (docwidth == width)? "save" :
	    fs.unlink(name, function(err) {
		if (err) {
		    console.log("le fichier n'a pu etre supprimer");
		}
	    });
	return;
    } else if (opewidth == "sup") {
	var superior = (docwidth > width)? "save" :
	    fs.unlink(name, function(err) {
		if (err) {
		    console.log("le fichier n'a pu etre supprimer");
		}
	    });
	return;
    }  else if (opewidth == "infequ") {
	var superior = (docwidth >= width)? "save" :
	    fs.unlink(name, function(err) {
		if (err) {
		    console.log("le fichier n'a pu etre supprimer");
		}
	    });
	return;
    }  else if (opewidth == "supequ") {
	var superior = (docwidth >= width)? "save" :
	    fs.unlink(name, function(err) {
		if (err) {
		    console.log("le fichier n'a pu etre supprimer");
		}
	    });
	return;
    } else {
	console.log("argument incorrecte");
	process.exit();
    }
}

function	verif_height(docheight, name)
{
    console.log('nom : ' +name);
    if (opeheight == "inf") {
	var inferior = (docheight < height)? "save" :
	    fs.unlink(name, function(err) {
		if (err) {
		    console.log("le fichier n'a pu etre supprimer");
		}
	    });
	return;
    }else if (opeheight == "equ") {
	var equal = (docheight == height)? "save" :
	    fs.unlink(name, function(err) {
		if (err) {
		    console.log("le fichier n'a pu etre supprimer");
		}
	    });
	return;
    } else if (opeheight == "sup") {
	var superior = (docheight > height)? "save" :
	    fs.unlink(name, function(err) {
		if (err) {
		    console.log("le fichier n'a pu etre supprimer");
		}
	    });
	return;
    }  else if (opeheight == "infequ") {
	var superior = (docheight >= height)? "save" :
	    fs.unlink(name, function(err) {
		if (err) {
		    console.log("le fichier n'a pu etre supprimer");
		}
	    });
	return;
    }  else if (opeheight == "supequ") {
	var superior = (docheight >= height)? "save" :
	    fs.unlink(name, function(err) {
		if (err) {
		    console.log("le fichier n'a pu etre supprimer");
		}
	    });
	return;
    } else {
	console.log("argument incorrecte");
	process.exit();
    }
}

function	check_file()
{
    if (arg == 3 || arg == 4) {
	var files = fs.readdirSync('html/myimg');
	for(var i = 0; files[i]; i++) {
	    var way = 'html/myimg/' + files[i];
	    console.log(way);
	    var dim = sizeof(way);
	    verif_width(dim.width, way);
	    if (arg == 4)
		verif_height(dim.height, way);
	}
    }
    fire.emit('launch');
}

if (link && (arg == 2 || arg == 3 || arg == 4))
{
    if (arg == 3 || arg == 4)
	init_size();
    request(link, function(err, res, body){
	if (!err && res.statusCode == 200) {
	    var $ = cheerio.load(body);
	    $('img').each(function(){
		var img = this.attr('src');
		if (img.match('data:')) {
		    return;
		}
		else if ((img.match('.png')) || (img.match('.jpg')) ||
			 (img.match('.jpeg')))
		    url.push(img);
	    });
	    console.log(url);
	    for (var j = 0; j < url.length; j++) {
		if (url[j].match('.jpg')) {
		    var namejpg = j + '.jpg';    
		    file.push(namejpg)
		} else if (url[j].match('.png')) {
		    var namepng = j + '.png';    
		    file.push(namepng)
		} else if (url[j].match('.jpeg')) {
		    var namejpeg = j + '.jpeg';    
		    file.push(namejpeg)
		}
	    }
//	    console.log(url.length);
	    for (var i = 0; i < url.length; i++) {
		var opt = {'url': url[i], 'encoding': null};
		var name =""
		if (url[i].match('.jpg')) {
		    var name = 'html/myimg/'+i+'.jpg';
		} else if (url[i].match('.png')) {
		    var name = 'html/myimg/'+i+'.png';
		} else if (url[i].match('.jpeg')) {
		    var name = 'html/myimg/'+i+'.jpeg';
		}
		var write = request(opt).pipe(fs.createWriteStream(name));
		write.on('finish', function(){
		    count +=1;
		    if (count == url.length)
			res.emit('end');
		});
	    };
	}
    }).on('end', function(){
	check_file();
	fire.on('launch', function(){
	    exec('/usr/bin/google-chrome localhost:3001/', function(err){
		if (err){
		    console.log('error');
		} else {
		    //console.log('success');
		}
	    });
	});
    });
} else {
    console.log("Usage : node app.js (link)");
    process.exit();
}

app.get('/', function(req, res){
    res.sendfile(html + 'index.html');
});

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

io = io.listen(server);


io.sockets.on('connection', function(socket) {
    var files = fs.readdirSync('html/myimg');	
    var i = 0;
    for (i = 0; i<files.length; i++){
	socket.emit('affiche', {link: files[i]});
    }
});

