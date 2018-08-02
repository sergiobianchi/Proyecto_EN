/*
 * Vista administrador
 */
var VistaAdministrador = function(modelo, controlador, elementos) {
  this.modelo = modelo;
  this.controlador = controlador;
  this.elementos = elementos;
  const contexto = this;

  // suscripción de observadores
  this.modelo.preguntaAgregada.suscribir(function() {
    contexto.reconstruirLista();
  });

  this.modelo.preguntaEliminada.suscribir(function() {
    contexto.reconstruirLista();
  });

};


VistaAdministrador.prototype = {
  //lista
  inicializar: function() {
    //llamar a los metodos para reconstruir la lista, configurar botones y validar formularios
    this.reconstruirLista();
    this.configuracionDeBotones();
    validacionDeFormulario();
  },

  construirElementoPregunta: function(pregunta){
    const contexto = this;
    const nuevoItem = $('<li>', {
      'class' : 'list-group-item',
      'text' : pregunta.textoPregunta,
      'id' : pregunta.id
    });

    const interiorItem = $('.d-flex');
    const titulo = interiorItem.find('h5');

    titulo.text(pregunta.textoPregunta);

    interiorItem.find('small').text(pregunta.cantidadPorRespuesta.map(function(resp){
      return " " + resp;
    }));

    nuevoItem.html($('.d-flex').html());

    return nuevoItem;
  },

  reconstruirLista: function() {
    const lista = this.elementos.lista;
    lista.html('');
    const preguntas = this.modelo.preguntas;
    for (var i=0;i<preguntas.length;++i){
      lista.append(this.construirElementoPregunta(preguntas[i]));
    }
  },

  configuracionDeBotones: function(){
    const e = this.elementos;
    const contexto = this;

    //asociacion de eventos a boton
    e.botonAgregarPregunta.click(function() {
      const value = e.pregunta.val();
      const respuestas = [];

      $('[name="option[]"]').each(function() {
        if (this.value !== '' ) {
          respuestas.push(this.value);
        }
      })

      contexto.limpiarFormulario();
      contexto.controlador.agregarPregunta(value, respuestas);
    });

    e.botonBorrarPregunta.click(function() {
      const id = parseInt(e.lista.find(".active")[0].id);

      if (id !== 0 && !isNaN(id)) {
        contexto.limpiarFormulario();
        contexto.controlador.eliminarPregunta(id);
      }
    });

    e.botonEditarPregunta.click(function() {
      debugger;

      contexto.limpiarFormulario();
      // contexto.controlador.editarPregunta();
    });

    e.borrarTodo.click(function() {
      debugger;

      contexto.limpiarFormulario();
      // contexto.controlador.borrarTodo();
    });
  },

  limpiarFormulario: function(){
    $('.form-group.answer.has-feedback.has-success').remove();
  },
};
