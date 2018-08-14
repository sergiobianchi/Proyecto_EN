/*
 * Controlador
 */
const Controlador = function(modelo) {
  this.modelo = modelo;
};

Controlador.prototype = {
  agregarPregunta: function(pregunta, respuestas) {
      this.modelo.agregarPregunta(pregunta, respuestas);
  },

  eliminarPregunta: function(idPregunta) {
    this.modelo.eliminarPregunta(idPregunta);
  },

  eliminarTodasPreguntas: function() {
    this.modelo.eliminarTodasPreguntas();
  },

  editarPregunta: function(idPregunta, pregunta, respuestas) {
    this.modelo.editarPregunta(idPregunta, pregunta, respuestas);
  },

  agregarVoto: function(pregunta, respuestaSeleccionada) {
    this.modelo.agregarVoto(pregunta, respuestaSeleccionada);
  },
};
