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

  validarPregunta: function(pregunta, idPregunta) {
    // Hace las validaciones de los datos devolviendo un objeto con numero de error y descripcion del mismo
    const error =  {
      errorMensaje: '',
      errorNumero: 0
    };

    if (pregunta === ""){
      error.errorNumero = 1;
      error.errorMensaje = this.modelo.obtenerMensajeDeError(error.errorNumero);

      return error;
    };

    for (let i = 0; i < this.modelo.preguntas.length; i++){
      if (pregunta === this.modelo.preguntas[i].textoPregunta && idPregunta !== this.modelo.preguntas[i].id){
        error.errorNumero = 2;
        error.errorMensaje = this.modelo.obtenerMensajeDeError(error.errorNumero);

        return error;
      }
    };

    return error;
  },

  validarRespuesta: function(respuestas) {
    // Hace las validaciones de los datos devolviendo un objeto con numero de error y descripcion del mismo
    const error =  {
      errorMensaje: '',
      errorNumero: 0
    };

    if (respuestas.length === 0){
      error.errorNumero = 3;
      error.errorMensaje = this.modelo.obtenerMensajeDeError(error.errorNumero);

      return error;
    };

    return error;
  },

  agregarVoto: function(pregunta, respuestaSeleccionada) {
    this.modelo.agregarVoto(pregunta, respuestaSeleccionada);
  },
};
