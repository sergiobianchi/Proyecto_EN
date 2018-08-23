/*
 * Controlador
 */
const Controlador = function(modelo) {
  this.modelo = modelo;
};

Controlador.prototype = {
  agregarPregunta: function() {
    const value = $('#pregunta').val();
    const respuestas = this.agregarRespuestas('#localStorageForm');

    let error = this.validarPregunta( value, -1 );
    let resultado = '';

    if (error){
      resultado = this.modelo.obtenerMensajeDeError(error);
      return resultado;
    };

    error = this.validarRespuesta(respuestas);

    if (error){
      resultado = this.modelo.obtenerMensajeDeError(error);
      return resultado;
    };

    this.modelo.agregarPregunta(value, respuestas);

    return resultado;    
  },

  eliminarPregunta: function(idPregunta) {
    if (idPregunta >= 0) {
      this.modelo.eliminarPregunta(idPregunta);
    }
  },

  eliminarTodasPreguntas: function() {
    this.modelo.eliminarTodasPreguntas();
  },

  editarPregunta: function(idPregunta) {
    const value = $('#preguntaModal').val();
    const respuestas = this.agregarRespuestas('#localStorageFormModal');

    let error = this.validarPregunta( value, -1 );
    let resultado = '';

    if (error){
      resultado = this.modelo.obtenerMensajeDeError(error);
      return resultado;
    };

    error = this.validarRespuesta(respuestas);

    if (error){
      resultado = this.modelo.obtenerMensajeDeError(error);
      return resultado;
    };

    this.modelo.editarPregunta(idPregunta, value, respuestas);

    return resultado;        
  },

  validarPregunta: function(pregunta, idPregunta) {
    // Hace las validaciones de los datos devolviendo un objeto con numero de error y descripcion del mismo
    let error = 0;

    if (pregunta.length === 0){
      error = 1;
    } else {
      for (let i = 0; i < this.modelo.preguntas.length; i++){
        if (pregunta === this.modelo.preguntas[i].textoPregunta && idPregunta !== this.modelo.preguntas[i].id){
          error = 2;
        }
      };  
    };

    return error;
  },

  validarRespuesta: function(respuestas) {
    // Hace las validaciones de los datos devolviendo un objeto con numero de error y descripcion del mismo
    let error = 0;

    if (respuestas.length === 0){
      error = 3;
    };

    return error;
  },

  agregarVoto: function() {
    const contexto = this;
    $('#preguntas').find('div').each(function(){
      const nombrePregunta = $(this).attr('value')
      const id = $(this).attr('id')
      const pregunta = contexto.modelo.obtenerPregunta(nombrePregunta);
      const respuestaSeleccionada = $('input[name=' + id + ']:checked').val();
      $('input[name=' + id + ']').prop('checked',false);

      if (respuestaSeleccionada){
        contexto.modelo.agregarVoto(pregunta,respuestaSeleccionada);
      };
    });
  },

  agregarRespuestas: function(idFormulario){
    const respuestas = [];

    $(idFormulario).find('[name="option[]"]').each(function() {
      if (this.value !== ""){
        const respuesta = {'textoRespuesta': this.value, cantidad: 0};
        respuestas.push(respuesta);
      };
    })

    return respuestas;
  },
};
