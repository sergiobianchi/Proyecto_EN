/*
 * Vista administrador
 */
const VistaAdministrador = function(modelo, controlador, elementos) {
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

  this.modelo.preguntasEliminadas.suscribir(function() {
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

      if (value === ""){
        swal("Crear", "No completaste el contenido de la pregunta!", "error");

        return false;
      };

      $('[name="option[]"]').each(function() {
        if (this.value !== '' ) {
          respuestas.push(this.value);
        }
      })

      if (respuestas.length === 0){
        swal("Crear", "No completaste al menos una posible respuesta!", "error");

        return false;
      };

      contexto.limpiarFormulario();
      contexto.controlador.agregarPregunta(value, respuestas);
    });

    e.botonBorrarPregunta.click(function() {
      const preguntaActiva = e.lista.find(".active");

      if (preguntaActiva.length === 0){
        swal("Eliminar", "No seleccionaste ninguna pregunta!", "error");

        return false;
      };

      const id = parseInt(e.lista.find(".active")[0].id);
      const pregunta = e.lista.find(".active").find("h5")[0].innerText;

      swal("Esta seguro?", "Se va a eliminar la pregunta! (" + pregunta + ")", "warning", {
        buttons: {
          cancelar: {
              text: "Cancelar",
              value: false
          },
          ok: {
            text: "Eliminar",
            value: true
          },
        },
      })
      .then((willDelete) => {
        if (willDelete) {
          contexto.limpiarFormulario();
          contexto.controlador.eliminarPregunta(id);
        }
      });
    });

    e.borrarTodo.click(function() {
      swal("Esta seguro?", "Se van a eliminar TODAS las preguntas!", "warning", {
        buttons: {
          Cancelar: {
              text: "Cancelar",
              value: false
          },
          Ok: {
              text: "Eliminar",
              value: true
          },
        },
      })
      .then((willDelete) => {
        if (willDelete) {
          contexto.limpiarFormulario();
          contexto.controlador.eliminarTodasPreguntas();
        }
      });
    });

    e.botonEditarPregunta.click(function() {
      const preguntaActiva = e.lista.find(".active");

      if (preguntaActiva.length === 0){
        swal("Modificar", "No seleccionaste ninguna pregunta!", "error");

        return false;
      };

      const id = parseInt(e.lista.find(".active")[0].id);

      debugger;

      // Llamar Form modal con los datos de la pregunta selecciona
      // Si todo esta ok, reemplazar los datos modificados

      //contexto.controlador.editarPregunta(id);
    });
  },

  limpiarFormulario: function(){
    $('.form-group.answer.has-feedback.has-success').remove();
  },
};
