var express = require('express');
var app = express();
var mongoose = require('mongoose');
var cors = require('cors');

mongoose.connect('mongodb://victordc7:2679970v@ds133152.mlab.com:33152/aplicacionlista');

var Lista = mongoose.model( 'Lista' , { 
    titulo : String,
    contenido : String,
    fecha : Date,
    modificado : Boolean
 } );

 app.configure( function(){
    app.use( express.static(__dirname + '/publico') );
    app.use( express.bodyParser() );
    app.use( express.methodOverride() );
 })

 app.use( cors() );
 app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });



 app.post('/api/lista' , function(peticion, respuesta){
     Lista.create({
         titulo : peticion.body.titulo,
         contenido : peticion.body.contenido,
         fecha : Date()
     } , function(err,lista){
            if(err){
                respuesta.send(err);
            }

            Lista.find( function(err, lista){
                if(err){
                    respuesta.send(err);
                }

                respuesta.json(lista);

            })
    })
 })

 app.get( '/api/lista' , function(peticion, respuesta){
    Lista.find( function(err,lista){
        if(err){
            respuesta.send(err);
        }

        respuesta.json(lista);
    })
 })

 app.get( '*', function( request, recursos){
    recursos.sendfile( './publico/index.html')
 })

 app.delete( '/api/lista/:item' , function(peticion, respuesta){
    Lista.remove( {
        _id : peticion.params.item
    } ,function(err,lista){
        if(err){
            respuesta.send(err);
        }

        Lista.find( function(err, lista){
            if(err){
                respuesta.send(err);
            }

            respuesta.json(lista);

        })
    })
 })

 app.put( '/api/lista/:item' , function(peticion, respuesta){
    Lista.findOneAndUpdate( 
        { _id : peticion.params.item },
        { modificado : true,
            titulo : peticion.body.titulo,
            contenido : peticion.body.contenido,
            fecha : Date() },
        function(err,lista){
            if(err){
                respuesta.send(err);
            }

            Lista.find( function(err, lista){
                if(err){
                    respuesta.send(err);
                }

                respuesta.json(lista);

            })
        })
 } )

app.listen(process.env.PORT || 8080, function(){
    console.log("el servidor funciona correctamente");
} )