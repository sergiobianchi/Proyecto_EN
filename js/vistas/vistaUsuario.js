/*
 * Vista usuario
 */
var VistaUsuario = function(modelo, controlador, elementos) {
  this.modelo = modelo;
  this.controlador = controlador;
  this.elementos = elementos;
  const contexto = this;

  //suscripcion a eventos del modelo
  this.modelo.preguntaAgregada.suscribir(function() {
    contexto.reconstruirLista();
  });

  this.modelo.preguntaEliminada.suscribir(function() {
    contexto.reconstruirLista();
  });

  this.modelo.preguntasEliminadas.suscribir(function() {
    contexto.reconstruirLista();
  });

  this.modelo.preguntaEditada.suscribir(function() {
    contexto.reconstruirLista();
  });

  this.modelo.preguntaVotada.suscribir(function() {
    contexto.reconstruirGrafico();
  });

};

VistaUsuario.prototype = {
  //muestra la lista por pantalla y agrega el manejo del boton agregar
  inicializar: function() {
    this.reconstruirLista();
    const elementos = this.elementos;
    const contexto = this;

    elementos.botonAgregar.click(function() {
      contexto.agregarVotos();
    });

    this.reconstruirGrafico();
  },

  //reconstruccion de los graficos de torta
  reconstruirGrafico: function(){
    const contexto = this;
    //obtiene las preguntas del local storage
    const preguntas = this.modelo.preguntas;
    preguntas.forEach(function(clave){
      var listaParaGrafico = [[clave.textoPregunta, 'Cantidad']];
      var respuestas = clave.cantidadPorRespuesta;
      respuestas.forEach (function(elemento) {
        listaParaGrafico.push([elemento.textoRespuesta,elemento.cantidad]);
      });
      contexto.dibujarGrafico(clave.textoPregunta, listaParaGrafico);
    })
  },

  reconstruirLista: function() {
    const listaPreguntas = this.elementos.listaPreguntas;
    listaPreguntas.html('');
    const contexto = this;
    const preguntas = this.modelo.preguntas;
    preguntas.forEach(function(clave){
      //completar
      //agregar a listaPreguntas un elemento div con valor "clave.textoPregunta", texto "clave.textoPregunta", id "clave.id"
      const nuevoItem = $('<div>', {
        'value' : clave.textoPregunta,
        'text' : clave.textoPregunta,
        'id' : clave.id
      });
      listaPreguntas.append(nuevoItem);
      const respuestas = clave.cantidadPorRespuesta;
      contexto.mostrarRespuestas(listaPreguntas,respuestas, clave);
    })
  },

  //muestra respuestas
  mostrarRespuestas:function(listaPreguntas,respuestas, clave){
    respuestas.forEach (function(elemento) {
      listaPreguntas.append($('<input>', {
        type: 'radio',
        value: elemento.textoRespuesta,
        name: clave.id,
      }));
      listaPreguntas.append($("<label>", {
        for: elemento.textoRespuesta,
        text: elemento.textoRespuesta
      }));
    });
  },

  agregarVotos: function(){
    const contexto = this;
    $('#preguntas').find('div').each(function(){
        const nombrePregunta = $(this).attr('value')
        const id = $(this).attr('id')
        const pregunta = contexto.modelo.obtenerPregunta(nombrePregunta);
        const respuestaSeleccionada = $('input[name=' + id + ']:checked').val();

        if (respuestaSeleccionada !== undefined){
          $('input[name=' + id + ']').prop('checked',false);
          contexto.controlador.agregarVoto(pregunta,respuestaSeleccionada);}
      });
  },

  dibujarGrafico: function(nombre, respuestas){
    let seVotoAlgunaVez = false;
    for(var i=1;i<respuestas.length;++i){
      if(respuestas[i][1]>0){
        seVotoAlgunaVez = true;
      }
    }
    const contexto = this;
    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
      const data = google.visualization.arrayToDataTable(respuestas);

      const options = {
        title: nombre,
        is3D: true,
      };
      const ubicacionGraficos = contexto.elementos.graficosDeTorta;
      const id = (nombre.replace(/\W/g, '')).split(' ').join('')+'_grafico';
      if($('#'+id).length){$('#'+id).remove()}
      const div = document.createElement('div');
      ubicacionGraficos.append(div);
      div.id = id;
      div.style.width = '400';
      div.style.height = '300px';
      const chart = new google.visualization.PieChart(div);
      if(seVotoAlgunaVez){
        chart.draw(data, options);
      }
    }
  },
};
