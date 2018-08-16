/*
 * Modelo
 */
const Modelo = function() {
  this.preguntas = [];
  this.ultimoId = 0;
  this.errores = [{numero: 1, mensaje: 'No completaste el contenido de la pregunta!'},
                  {numero: 2, mensaje: 'Ya hay otra pregunta igual!'},
                  {numero: 3, mensaje: 'No completaste al menos una posible respuesta!'},
                ];

  this.recuperar();

  //inicializacion de eventos
  this.preguntaAgregada = new Evento(this);
  this.preguntaEliminada = new Evento(this);
  this.preguntasEliminadas = new Evento(this);
  this.preguntaEditada = new Evento(this);
  this.preguntaVotada = new Evento(this);
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
        break;
        }
      };
    },

  //se eliminan todas las preguntas
  eliminarTodasPreguntas: function() {
    this.preguntas = [];
    this.ultimoId = 0;
    this.guardar();
    this.preguntasEliminadas.notificar();
  },

  //se agrega una pregunta dado un nombre y sus respuestas
  editarPregunta: function(idPregunta, pregunta, respuestas) {
    for (let i = 0; i < this.preguntas.length; i++){
      if (this.preguntas[i].id === idPregunta){
        this.preguntas[i].textoPregunta = pregunta;
        this.preguntas[i].cantidadPorRespuesta = respuestas;
        break;
      };
    };

    this.guardar();
    this.preguntaEditada.notificar();
  },

  //se obtienen  pregunta desde su nombre
  obtenerPregunta: function(nombrePregunta) {
    for (let i = 0; i < this.preguntas.length; i++){
      if (this.preguntas[i].textoPregunta === nombrePregunta) {
        return i;
        }
      };

      return -1;
    },

  //se agrega un voto a la respuesta seleccionada
  agregarVoto: function(pregunta, respuesta) {
    for (let i = 0; i < this.preguntas[pregunta].cantidadPorRespuesta.length; i++){
      if (this.preguntas[pregunta].cantidadPorRespuesta[i].textoRespuesta === respuesta) {
        this.preguntas[pregunta].cantidadPorRespuesta[i].cantidad++;
        break;
      }
    };

    this.guardar();
    this.preguntaVotada.notificar();
  },

  //se guardan las preguntas
  guardar: function(){
    localStorage.setItem("preguntas", JSON.stringify(this.preguntas));
    localStorage.setItem("ultimoId", JSON.stringify(this.ultimoId));
  },

  //se recuperan las preguntas
  recuperar: function(){
    const ultimoId = JSON.parse(localStorage.getItem("ultimoId"));

    if (ultimoId >= 1){
      this.ultimoId = ultimoId;
      this.preguntas = JSON.parse(localStorage.getItem("preguntas"));
    }
  },

  obtenerMensajeDeError: function(idError) {
    let mensajeError = '';

    for (let i = 0; i < this.errores.length; i++){
      if (this.errores[i].numero === idError) {
        mensajeError = this.errores[i].mensaje;
        break;
        };
      };

      return mensajeError;
    },

};
