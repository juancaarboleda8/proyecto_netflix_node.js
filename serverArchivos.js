var http = require('http');
var fs = require('fs');
var formidable=require('formidable');

var mime = {
   'html' : 'text/html',
   'css'  : 'text/css',
   'jpg'  : 'image/jpg',
   'ico'  : 'image/x-icon',
   'mp3'  : 'audio/mpeg3',
   'mp4'  : 'video/mp4'
};


var servidor = http.createServer(cargarPagina);

function cargarPagina(request,response) {
	if (request.url == "/paginaArchivos.html") {
		mostrarPagina(request,response);
	}else if (request.url=='/subir') {
        subirFoto(request,response);
	}else{
		response.end('algo salio mal');
	}
}

function mostrarPagina(request,response) {
	fs.readFile('/Users/JuanCamiloArboleda/Desktop/videoNetflix'+request.url,mostrar);
	function mostrar(error,data) {
		if (error) {
			console.log('el error es: '+error.toString());
		}else{
			response.write(data);
			response.end();
		}
	}
}

function subirFoto(request,response){
    var entrada = new formidable.IncomingForm();
    entrada.uploadDir='/Users/JuanCamiloArboleda/Desktop/videoNetflix';
    entrada.parse(request);
    entrada.on('open', function(field, file){
        file.path = "/Users/JuanCamiloArboleda/Desktop/videoNetflix"+file.name;
    }); 
    entrada.on('end', function(){
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write('<!doctype html><html><head></head><body>'+
                        'Archivo subido<br><a href="index.html">Retornar</a></body></html>');        
        response.end();
    }); 
}

console.log('servidor creado perfectamente');
servidor.listen(8080);