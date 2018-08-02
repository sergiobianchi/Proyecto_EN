/*
 * Modelo
 */
var Modelo = function() {
  this.preguntas = [];
  this.ultimoId = 0;

  //inicializacion de eventos
  this.preguntaAgregada = new Evento(this);
  this.preguntaEliminada = new Evento(this);
};

Modelo.prototype = {
  //se obtiene el id más grande asignado a una pregunta
  obtenerUltimoId: function() {
    return this.ultimoId;
  },

  //se agrega una pregunta dado un nombre y sus respuestas
  agregarPregunta: function(nombre, respuestas) {
    this.ultimoId = this.obtenerUltimoId() + 1;
    const nuevaPregunta = {'textoPregunta': nombre, 'id': this.ultimoId, 'cantidadPorRespuesta': respuestas};
    this.preguntas.push(nuevaPregunta);
    this.guardar();
    this.preguntaAgregada.notificar();
  },

  //se elimina una pregunta dado un id
  eliminarPregunta: function(idPregunta) {
    for (let i = 0; i < this.preguntas.length; i++){
      if (this.preguntas[i].id === idPregunta) {
        this.preguntas.splice( i, 1);
        this.guardar();
        this.preguntaEliminada.notificar();
        i = this.preguntas.lenght();
        }
      };
    },
  
  //se guardan las preguntas
  guardar: function(){
  },
};
