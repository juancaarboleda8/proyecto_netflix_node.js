var fs = require('fs');
var http = require('http');


var servidor = http.createServer(principal);

function principal(request,response) {
	if (request.url == '/index.html') {
		cargarPagina(request,response);
	}else if (request.url=='/Users/JuanCamiloArboleda/Desktop/videoNetflix/video/amante.mp4') {
        cargarVideo(request,response);
	}else if (request.url == '/crearCarpeta') {
        crearCarpeta(request,response);
	}else{
		response.end('algo salio mal');
	}
}

function cargarPagina(request,response) {
	fs.readFile('/Users/JuanCamiloArboleda/Desktop/videoNetflix'+request.url,cargar);
	function cargar(error,data) {
		if (error) {
			console.log('algo salio mal');
			response.end(error.toString());
		}else{
			response.write(data);
			response.end();
		}
	}
}

function cargarVideo(request,response) {
	fs.stat(request.url,invocar);
	function invocar(error,stats) {
		if (error) {
			console.log(error);
			response.end('algo salio mal');
		}else{
			console.log(request.headers);
			var {rango} = request.headers;
			console.log(stats);
			var {size} = stats;
			var start = Number((rango || '').replace(/bytes=/, '').split('-')[0]);
			console.log('el comienzo es: '+start);
			var end = size - 1;
			console.log('el final es: '+end);
			var chucksize = (end - start) + 1;
			console.log('el tamaño es: '+chucksize);

			var stream = fs.createReadStream(request.url,{start,end});
			stream.on('open',function() {
				stream.pipe(response);
			})

			stream.on('error',function(funError) {
				response.end(funError);
			})
		}


	}
}


function crearCarpeta(request,response) {
	var nombreCarpeta;
	request.on('data',control);
	function control(data) {
		var datos = JSON.parse(data.toString())
		console.log(datos.nombre);
		nombreCarpeta = datos.nombre;
	}

	console.log("crear la carpeta");
	fs.mkdir('/Users/JuanCamiloArboleda/Desktop/videoNetflix/'+nombreCarpeta,wrong);
	function wrong(error) {
		if (error) {
			console.log('ocurrio un error');
		}else{
			console.log('creo la carpeta correcta');
		}
	}
     
}

console.log('servidor creado');
servidor.listen(8080);