const modelo = new Modelo();

const vistaAdmin = new VistaAdministrador(modelo, new Controlador(modelo), {
  'lista': $('#lista'),
  'botonEditarPregunta': $('#editarPregunta'),
  'botonBorrarPregunta': $('#borrarPregunta'),
  'borrarTodo': $('#borrarTodo'),
  'pregunta': $('#pregunta'),
  'respuesta': $('#respuesta'),
  'botonAgregarPregunta': $('#agregarPregunta'),
  'muestraDeRespuestas': $('.panel-body'),
  'formularioModal': $('#localStorageFormModal'),
  'containerModal': $('.container-modal')[0],
  'preguntaModal': $('#preguntaModal'),
  'respuestaModal': $('#respuestaModal'),
  'botonModificarPregunta': $('#modificarPregunta'),
  'botonCancelarModificacion': $('#cancelarModificacion'),
});

vistaAdmin.inicializar();

const vistaUsuario = new VistaUsuario(modelo, new Controlador(modelo), {
  'listaPreguntas': $('#preguntas'),
  'botonAgregar': $('#agregarBoton'),
  'nombreUsuario' : $('#nombreUsuario'),
  'graficosDeTorta' : $('#graficosDeTorta')
});

vistaUsuario.inicializar();