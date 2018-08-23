/*
 * Vista administrador
 */
const VistaAdministrador = function(modelo, controlador, elementos) {
  this.modelo = modelo;
  this.controlador = controlador;
  this.elementos = elementos;
  const contexto = this;
  let idEdicion;

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

  this.modelo.preguntaEditada.suscribir(function() {
    contexto.reconstruirLista();
  });

};


VistaAdministrador.prototype = {
  //lista
  inicializar: function() {
    //llamar a los metodos para reconstruir la lista, configurar botones y validar formularios
    this.reconstruirLista();
    this.configuracionDeBotones();
    validacionDeFormulario('#localStorageForm','#optionTemplate');
    validacionDeFormulario('#localStorageFormModal','#optionTemplateModal');
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
      return " " + resp.textoRespuesta;
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
      const resultado = contexto.controlador.agregarPregunta();

      if (resultado.length !== 0 ){
        swal("Agregar Pregunta", resultado, "error");
      } else {
        contexto.limpiarFormulario();
      };
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
        };
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
        };
      });
    });

    e.botonEditarPregunta.click(function() {
      const preguntaActiva = e.lista.find(".active");

      if (preguntaActiva.length === 0){
        swal("Modificar", "No seleccionaste ninguna pregunta!", "error");

        return false;
      };

      contexto.idEdicion = parseInt(e.lista.find(".active")[0].id);

      contexto.limpiarFormularioModal();

      contexto.completarModal(contexto.idEdicion);

      contexto.mostrarModal();
    });

    e.botonModificarPregunta.click(function() {
      const resultado = contexto.controlador.editarPregunta(contexto.idEdicion);

      if (resultado.length !== 0 ){
        swal("Modificar Pregunta", resultado, "error");
      };
      
      contexto.ocultarModal();      
    });

    e.botonCancelarModificacion.click(function() {
      contexto.ocultarModal();
    });
  },

  completarModal: function(idPregunta){
    // Recargar campos
    for (let i = 0;i < this.modelo.preguntas.length; i++){
      if (this.modelo.preguntas[i].id === idPregunta){

        $('#preguntaModal').val( this.modelo.preguntas[i].textoPregunta );

        for (let j = 0; j < this.modelo.preguntas[i].cantidadPorRespuesta.length - 1; j++){
            const $template = $('#optionTemplateModal'),
            idRespuesta = j + 2,
            $clone = $template
            .clone()
            .removeClass('hide')
            .addClass('eliminar')
            .attr('id', "respuesta" + idRespuesta)
            .insertBefore($template),
            $option = $clone.find('[name="option[]"]');

            // agregado de nuevo campo al formulario
            $('#localStorageFormModal').formValidation('addField', $option);
        };

        for (let j = 0; j < this.modelo.preguntas[i].cantidadPorRespuesta.length; j++){
          $('#localStorageFormModal').find('[name="option[]"]')[j].value = this.modelo.preguntas[i].cantidadPorRespuesta[j].textoRespuesta;
        }

        break;
      };
    };
  },

  mostrarModal: function(){
    this.elementos.containerModal.style.display = "block";
  },

  ocultarModal: function(){
    this.elementos.containerModal.style.display = "none";
  },

  limpiarFormulario: function(){
    $('.form-group.answer.has-feedback.has-success').remove();
  },

  limpiarFormularioModal: function(){
    $('.eliminar').remove();
  },
};
