///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////
define(['dojo/_base/declare', 'jimu/BaseWidget',
"esri/tasks/RouteTask", "esri/symbols/SimpleMarkerSymbol",
"esri/symbols/SimpleLineSymbol", "esri/Color", "dojo/dom", "dojo/on",
"dojo/_base/lang", "esri/graphic", "esri/geometry/Point", "esri/tasks/RouteParameters",
"esri/tasks/FeatureSet", "esri/tasks/RouteResult", "dojo/_base/connect", "esri/toolbars/draw",
"esri/geometry/Polyline", 


],
  function(declare, BaseWidget, RouteTask, SimpleMarkerSymbol,
    SimpleLineSymbol, Color, dom, on, lang, Graphic, Point, RouteParameters,
    FeatureSet, RouteResult, connect, Draw, Polyline, 
    
        
    ) {
    //To create a widget, you need to derive from BaseWidget.
    return declare([BaseWidget], {
      // Custom widget code goes here

      baseClass: 'jimu-widget-customwidget',

      //this property is set by the framework when widget is loaded.
      //name: 'CustomWidget',


      //methods to communication with app container:

      // postCreate: function() {
      //   this.inherited(arguments);
      //   console.log('postCreate');
      // },

      // startup: function() {
      // //  this.inherited(arguments);
      // //  this.mapIdNode.innerHTML = 'map id:' + this.map.id;
      // //  console.log('startup');
      // },

      simbolo1: null,
      simboloRuta: null,
      toolbar: null,

      onOpen: function () {
        this.map.graphics.clear();

        this.simbolo1 = new SimpleMarkerSymbol({
          "color": [255,255,255,64],
          "size": 12,
          "angle": -30,
          "xoffset": 0,
          "yoffset": 0,
          "type": "esriSMS",
          "style": "esriSMSCircle",
          "outline": {
            "color": [0,0,0,255],
            "width": 1,
            "type": "esriSLS",
            "style": "esriSLSSolid"
          }
        });

        this.simboloRuta = new SimpleLineSymbol(
          SimpleLineSymbol.STYLE_SOLID,
          new Color([89,95,35]),
          4.0
        );
      },

      puntosRuta: function () {
        this.map.disableMapNavigation();
        this.toolbar = new Draw(this.map);
        this.toolbar.activate(Draw.POINT);       

        this.map.on('click', lang.hitch(this, function (evento) {
          // En todos los ejemplos viene evento.geometry en lugar de evento.mapPoint.
          // En mi código funciona al revés y no tengo ni idea de por qué.
          var punto = new Point(evento.mapPoint);
          var grafico = new Graphic(punto, this.simbolo1);
          this.map.graphics.add(grafico);
          // Estas tres líneas de código se ejecutan ignorando por completo la toolbar

          // this.toolbar.on("draw-complete", console.log(this.map.graphics.graphics)); //Esta línea ignora por completo el evento y ejecuta directamente a la otra función
          // toolbar.deactivate();
          // console.log(this.map.graphics.graphics);
        }));
      },

      dibujaLinea: function(evento) {
        this.map.disableMapNavigation();
        this.toolbar = new Draw(this.map);
        this.toolbar.activate(Draw.FREEHAND_POLYLINE);
        // No sé cómo conectar las líneas de arriba con las de abajo en esta función
        var polilinea = new Polyline(evento.geometry);
        var grafico = new Graphic(polilinea, this.simboloRuta);
        this.map.graphics.add(grafico);
      },

      borrarRuta: function(){
        this.toolbar.deactivate();
        this.map.graphics.clear();
        this.map.enableMapNavigation();
      },



      calculaRuta: function () {
        var servicioRutasAGOL = "http://sampleserver6.arcgisonline.com/arcgis/rest/services/NetworkAnalysis/SanDiego/NAServer/Route";
        var routeTask = new RouteTask(servicioRutasAGOL);
        var routeParams = new RouteParameters();
        routeParams.stops = new FeatureSet();
        this.map.graphics.remove(this.map.graphics.graphics[0])
        routeParams.stops.features = this.map.graphics.graphics;
        routeParams.returnRoutes = true;
        routeParams.returnDirections = true;
        // Las barreras (zonas restringidas) tienen que ser otro feature set

        // console.log("url del servicio de rutas: ",servicioRutasAGOL);
        // console.log("RouteTask: ", routeTask);
        // console.log("Parámetros de ruta: ",routeParams);
        // console.log("Paradas: ",routeParams.stops.features);


        // routeTask.on("error", errorHandler());
        
        routeTask.solve(routeParams); //Estoy casi seguro de que el método solve() no se ejecuta
        routeTask.on("solve-complete", muestraRuta()); //Esta línea llama a la función ignorando el evento "solve-complete"
        // connect.connect(routeTask, "onSolveComplete", this.funcionPrueba());
        
        

        function muestraRuta(evento) {
          //El evento de entrada debería ser el objeto RouteResult creado con el método solve(), pero lo que llega a esta función es "undefined"
          console.log("Función muestraRuta ejecutándose");
          // clearRoutes();

          console.log(evento);
          // console.log(evento.result);

          // var solveResult = evento.result;
          // console.log(solveResult);
          // var routeResults = solveResult.routeResults;
          // console.log(routeResults);
          // // var barriers = solveResult.barriers;
          // // var polygonBarriers = solveResult.polygonBarriers;
          // // var polylineBarriers = solveResult.polylineBarriers;
          // // var messages = solveResult.messages;

          // this.map.graphics.add(routeResults);
        };

        // function errorHandler(err) {
        //   console.log(err);
        //   // console.log("An error occured\n" + err.message + "\n" + err.details.join("\n"));
        // };
      },

      

      // onClose: function(){
      //   console.log('onClose');
      // },

      // onMinimize: function(){
      //   console.log('onMinimize');
      // },

      // onMaximize: function(){
      //   console.log('onMaximize');
      // },

      // onSignIn: function(credential){
      //   /* jshint unused:false*/
      //   console.log('onSignIn');
      // },

      // onSignOut: function(){
      //   console.log('onSignOut');
      // }

      // onPositionChange: function(){
      //   console.log('onPositionChange');
      // },

      // resize: function(){
      //   console.log('resize');
      // }

      //methods to communication between widgets:

    });
  });