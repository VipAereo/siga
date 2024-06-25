let gridOptions;
let currentStep = 1;
let AEROPUERTOS = [];
let BROKERS = [];
let maxId = 0;

// Utilizando el Principio de Modularidad
$(function () {
    asignarEventos();
    inicializarPagina();
    configurarBotones();
});
function asignarEventos() {
    $(".contenedor-altas").hide();
    $("#costeo-relacion").hide();

    // Ocultar Listados
    $('.paxSearch').hide();

    $('.aeroSearch').hide();
    $('.emprSearch').hide();
    $('.cliSearch').hide();
    // Ida
    $('.origSearch1').hide();
    $('.destSearch1').hide();
    // Ida y Vuelta
    $('.origSearchIda').hide();
    $('.destSearchIda').hide();
    $('.origSearchVue').hide();
    $('.destSearchVue').hide();
    // Multidestino
    $('.origSchMul1').hide();
    $('.destSrchMul1').hide();

    // Inputs
    $('#inpEmpresa').hide();

    aplicarMascaraCantidad('subtotal', 'ivaNac', 'ivaInt', 'total', 'cant_pernocta', 'tot_pernocta', 'cant_hrs', 'tot_hrs');

    // Esc Cerrar
    document.addEventListener("keydown", e => {
        if (e.key === 'Escape') {
            // Limpiar Ruta
            resetForm();
        }
    });

    // Lista Aeronaves
    document.getElementById("aeronave_id").addEventListener("mousedown", async function (event) {
        event.preventDefault();
        $('.aeroSearch').show();
        $('.inAeroSrch').focus();
        let data = await obtenerAeronaves();
        const listSearch = await mostrarListaSearch(data, '.aeroSearch', 'aeronave_id', 'modelo');

        if (listSearch) {
            activarRutas();
            updateActiveClass();
        }

        // Establecer el Max a todos los PAX
        $('.pax').each(function () {
            $(this).attr('max', listSearch.asientos);
            $(this).attr('min', '0');
            $('.pax').prop('disabled', false);
        });
    });

    // Lista Pasajeros
    document.getElementById("pasajero_id").addEventListener("mousedown", async function (event) {
        event.preventDefault();
        $('.paxSearch').show();
        $('.inPaxSrch').focus();
        let data = await obtenerPasajeros();
        const listSearch = await mostrarListaSearch(data, '.paxSearch', 'pasajero_id', 'nombre', true);
        if (listSearch == 'nuevo') {
            $("#pasajero_id option").val();
            $("#pasajero_id option").text('');
            nuevoPax();
        } else {
            $("#pasajero_id option").val();
            $("#pasajero_id option").text('');
            setPaxId(listSearch);
        }

    });

    // Lista Brokers
    document.getElementById("broker_id").addEventListener("mousedown", async function (event) {
        event.preventDefault();
        $('.emprSearch').show();
        $('.inEmprSrch').focus()
        let data = await obtenerBroker();
        const listSearch = await mostrarListaSearch(data, '.emprSearch', 'broker_id', 'nombre');
        if (listSearch) {
            activarRutas();
            updateActiveClass();
        }
        $('#rt-responsable').val(listSearch.contacto_principal);
    });

    // Lista Clientes
    document.getElementById("cliente_id").addEventListener("mousedown", async function (event) {
        event.preventDefault();
        $('.cliSearch').show();
        $('.inCliSrch').focus();
        let data = await obtenerClientes();
        const listSearch = await mostrarListaSearch(data, '.cliSearch', 'cliente_id', 'nombre');
        if (listSearch) {
            activarRutas();
            updateActiveClass();
        }
    });
    document.getElementById("slctOpcion").addEventListener("change", async function (event) {
        const opcionSeleccionada = event.target.value;
        mostrarClienteBroker(opcionSeleccionada);
    });

    // Lista Aeropuertos
    // Ida 
    document.getElementById("rt-origen1").addEventListener("mousedown", async function (event) {
        event.preventDefault();
        if (AEROPUERTOS == '') { let data = await obtenerAeropuertos(); }
        $('.origSearch1').show();
        $('.inOrigSrch1').focus();
        const listSearch = await mostrarListaSearch(AEROPUERTOS, '.origSearch1', 'aeropuerto_id', 'municipio');
        if (listSearch) {
            let slcActivo = this.parentNode.parentNode.parentNode;
            existeRuta(slcActivo);
            activarRutas();
        }
    });
    document.getElementById("rt-destino1").addEventListener("mousedown", async function (event) {
        event.preventDefault();
        if (AEROPUERTOS == '') { let data = await obtenerAeropuertos(); }
        $('.destSearch1').show();
        $('.inDestgSrch1').focus();
        const listSearch = await mostrarListaSearch(AEROPUERTOS, '.destSearch1', 'aeropuerto_id', 'municipio');
        if (listSearch) {
            let slcActivo = this.parentNode.parentNode.parentNode;
            existeRuta(slcActivo);
            activarRutas();
        }
    });

    // Ida y Vuelta
    document.getElementById("rt-origIda1").addEventListener("mousedown", async function (event) {
        event.preventDefault();
        if (AEROPUERTOS == '') { let data = await obtenerAeropuertos(); }
        $('.origSearchIda').show();
        $('.inOrigSrchIda').focus();
        const listSearch = await mostrarListaSearch(AEROPUERTOS, '.origSearchIda', 'aeropuerto_id', 'municipio');
        if (listSearch) {
            let slcActivo = this.parentNode.parentNode.parentNode;
            existeRuta(slcActivo);
            activarRutas();
        }
    });
    document.getElementById("rt-destVue1").addEventListener("mousedown", async function (event) {
        event.preventDefault();
        if (AEROPUERTOS == '') { let data = await obtenerAeropuertos(); }
        $('.destSearchIda').show();
        $('.inDestSrchIda').focus();
        const listSearch = await mostrarListaSearch(AEROPUERTOS, '.destSearchIda', 'aeropuerto_id', 'municipio');
        if (listSearch) {
            let slcActivo = this.parentNode.parentNode.parentNode;
            existeRuta(slcActivo);
            activarRutas();
        }
    });
    document.getElementById("rt-origIda2").addEventListener("mousedown", async function (event) {
        event.preventDefault();
        if (AEROPUERTOS == '') { let data = await obtenerAeropuertos(); }
        $('.origSearchVue').show();
        $('.inOrigSrchVue').focus();
        const listSearch = await mostrarListaSearch(AEROPUERTOS, '.origSearchVue', 'aeropuerto_id', 'municipio');
        if (listSearch) {
            let slcActivo = this.parentNode.parentNode.parentNode;
            existeRuta(slcActivo);
            activarRutas();
        }
    });
    document.getElementById("rt-destVue2").addEventListener("mousedown", async function (event) {
        event.preventDefault();
        if (AEROPUERTOS == '') { let data = await obtenerAeropuertos(); }
        $('.destSearchVue').show();
        $('.inDestSrchVue').focus();
        const listSearch = await mostrarListaSearch(AEROPUERTOS, '.destSearchVue', 'aeropuerto_id', 'municipio');
        if (listSearch) {
            let slcActivo = this.parentNode.parentNode.parentNode;
            existeRuta(slcActivo);
            activarRutas();
        }
    });

    // Multidestino
    document.getElementById("rt-origMul1").addEventListener("mousedown", async function (event) {
        event.preventDefault();
        if (AEROPUERTOS == '') { let data = await obtenerAeropuertos(); }
        $('.origSchMul1').show();
        $('.inOrigSrchMul1').focus();
        const listSearch = await mostrarListaSearch(AEROPUERTOS, '.origSchMul1', 'aeropuerto_id', 'municipio');
        if (listSearch) {
            let slcActivo = this.parentNode.parentNode.parentNode;
            existeRuta(slcActivo);
            activarRutas();
        }
    });
    document.getElementById("rt-destinoMul1").addEventListener("mousedown", async function (event) {
        event.preventDefault();
        if (AEROPUERTOS == '') { let data = await obtenerAeropuertos(); }
        $('.destSrchMul1').show();
        $('.inDestgSrchMul1').focus();
        const listSearch = await mostrarListaSearch(AEROPUERTOS, '.destSrchMul1', 'aeropuerto_id', 'municipio');
        if (listSearch) {
            let slcActivo = this.parentNode.parentNode.parentNode;
            existeRuta(slcActivo);
            activarRutas();
        }
    });

    document.getElementById("btnAddVuelo").addEventListener("click", function () {
        nuevaRuta();
    });


    // toggle
    const title = document.querySelector(".toggle-pax");
    const content = document.querySelector(".toggle-pax-cont");

    title.addEventListener("click", function () {
        if (content.classList.contains("expanded")) {
            content.classList.remove("expanded");
            title.classList.remove("expanded");
            $("#formPasajeros").addClass("toggle-pax-cont");
        } else {
            content.classList.add("expanded");
            title.classList.add("expanded");
            $("#formPasajeros").removeClass("toggle-pax-cont");
        }
    });

    const titleRel = document.querySelector(".toggle-relRuta");
    const contentRel = document.querySelector(".toggle-relRuta-cont");
    titleRel.addEventListener("click", async function () {
        if (contentRel.classList.contains("expanded")) {
            contentRel.classList.remove("expanded");
            titleRel.classList.remove("expanded");
            $('#formRelRuta').empty();
        } else {
            contentRel.classList.add("expanded");
            titleRel.classList.add("expanded");
        }
    });

    const toggleRelRuta = document.querySelector('.toggle-relRuta');
    toggleRelRuta.addEventListener('mousedown', async function () {
        await relRutasPax(toggleRelRuta);
    });

    $('.pax').prop('disabled', true);
    $("select[name^='rt-orig'], select[name^='rt-dest']").prop('disabled', true);

    $('.pax').on('input', function () {
        const max = parseInt($(this).attr('max'));
        const value = parseInt($(this).val());
        if (value > max) $(this).val(max);
    });
}
function configurarBotones() {


    $("#crear-solCot").click(function () {
        mostrarContenedorAltas('PND');
    }
    );

    $(".nav-destinos button").click(function (e) {
        e.preventDefault(); // Prevenir el comportamiento predeterminado del botón  
        let destClicked = $(this).index() + 1; // Obtener el índice del botón clicado
        currentStep = destClicked; // Establecer el paso actual

        // Ocultar todos los destinos y mostrar solo el destino correspondiente al paso actual
        $("#dest1, #dest2, #dest3").hide();
        $("#dest" + destClicked).show();

        limpiarForm('#fdest' + destClicked); // Limpiar el formulario correspondiente al paso actual
        updateActiveClass(); // Actualizar la clase pasoActivo en los botones de destino
    });

    $("#btnGuardar").click(async e => {
        let validar = validateInputs($('#formAltas'));
        // if (validar) $('#cotizar_id').val() == '' ? crearCotizacion() : actualizarCotizacion();
        if (validar && $('#cotizar_id').val() == '') {
            await crearCotizacion();
        } else {
            await actualizarCotizacion();
            await actualizarRutaPax();
        };
    });

    $("#btnCancel").click(e => {
        resetForm();
    });

    $("#btnPasajero").click(e => {
        nuevoPax();
    });

    $("#genera_pdf").click(e => {
        if ($('#cotizar_id').val()) obtenerCotizacionPDF();
    });

    $("#btnServicio").click(e => {
        if ($('#cotizar_id').val()) generarServicio();
    });

    updateActiveClass();
}
function inicializarPagina() {
    setFechaActual('fecha-cot');

    let columnDefs = [
        {
            headerName: 'id',
            field: 'cotizar_id',
            width: 80
        },
        {
            headerName: 'Folio',
            field: 'folio_cotizar',
            width: 80
        },
        {
            headerName: 'Broker',
            field: 'nombreBrok',
            width: 110
        },
        {
            headerName: 'Cliente',
            field: 'nombreCli',
            width: 110
        },
        {
            headerName: 'Aeronave',
            field: 'modeloAeronave',
            width: 160
        },
        {
            headerName: 'Ruta',
            field: 'concepto',
            width: 180
        },
        {
            headerName: 'Fecha Salida',
            field: 'fecha_salida',
            width: 100
        },
        {
            headerName: 'Total',
            field: 'total',
            width: 120,
            cellStyle: { textAlign: 'right' }, // Alinea los datos a la derecha
            valueFormatter: function (params) {
                // Formatea el número con comas como separadores de miles y dos decimales
                return Number(params.value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        },
        {
            headerName: 'Estatus',
            field: 'estatus',
            width: 80
        },
        {
            headerName: 'Acción',
            cellRenderer: function (params) {
                const editButton = document.createElement('I');
                editButton.className = "fa-regular fa-pen-to-square btn btn-editar";
                editButton.title = 'Editar';

                // Datos a Editar
                editButton.addEventListener('click', async function () {

                    let estatus = params.data.estatus;
                    await mostrarContenedorAltas(estatus);

                    $('#cotizar_id').val(params.data.cotizar_id);
                    $('#folio').val(params.data.folio_cotizar);

                    $('#fecha-cot').val(formatearFechaCompleta(params.data.fecha_creacion));

                    $('#rt-comment').val(params.data.comentarios);
                    $('#cot-comment').val(params.data.comentarios);
                    $('#estatus').val(params.data.estatus);
                    $('#aeronave_id option').val(params.data.aeronave_id);
                    $('#aeronave_id option').text(params.data.modeloAeronave);
                    $('#tipo_cambio option').val(params.data.tipo_cambio_id);
                    $('#tipo_cambio option').text(Number(params.data.tipo_cambio).toFixed(2));

                    if (params.data.cliente_id) {
                        mostrarClienteBroker(1);
                        $("#slctOpcion").val(1);
                        $("#cliente_id option").val(params.data.cliente_id);
                        $("#cliente_id option").text(params.data.nombreCli);
                    } else if (params.data.broker_id) {
                        mostrarClienteBroker(2);
                        $("#slctOpcion").val(2);
                        $("#broker_id option").val(params.data.broker_id);
                        $("#broker_id option").text(params.data.nombreEmpr);
                        let aeropCot = await obtenerBroker();
                        const objetoEncontrado = aeropCot.find(objeto => objeto.broker_id == params.data.broker_id);
                        $('#broker_id option').val(objetoEncontrado.broker_id);
                        $('#broker_id option').text(objetoEncontrado.nombre);
                        $('#rt-responsable').val(objetoEncontrado.contacto_principal);
                    }
                    // inhabilitar nav-destinos 
                    $('.nav-destinos button').addClass('event-none');

                    // Indicar que Tipo de VUELO es
                    let tipoV = params.data.tipo_de_viaje;

                    document.querySelector('.nav-destinos .pasoActivo').classList.remove('pasoActivo');


                    let destClicked
                    if (tipoV == 1) {
                        destClicked = 1;
                        document.querySelector('.nav-destinos button:first-child').classList.add('pasoActivo');
                    } else if (tipoV == 2) {
                        destClicked = 2;
                        document.querySelector('.nav-destinos button:nth-child(2)').classList.add('pasoActivo');
                    } else if (tipoV == 3) {
                        destClicked = 3;
                        document.querySelector('.nav-destinos button:last-child').classList.add('pasoActivo');
                    }
                    currentStep = destClicked; // Establecer el paso actual
                    // Ocultar todos los destinos y mostrar solo el destino correspondiente al paso actual
                    $("#dest1, #dest2, #dest3").hide();
                    $("#dest" + destClicked).show();

                    if (params.data.estatus == 'PND') {

                        let detalleRutas = await obtnerVuelosId(params.data.cotizar_id);

                        if (destClicked == 2 || destClicked == 3) {

                            const idFormFechas = {
                                2: 'rt-fechaIda',
                                3: 'rt-fechaMul'
                            };

                            const idFormHoras = {
                                2: 'rt-horaIda',
                                3: 'rt-horaMul'
                            };

                            const idFormPasajeros = {
                                2: 'rt-paxIda',
                                3: 'rt-paxMul'
                            };

                            const idFromDets = {
                                2: 'cot-detIda',
                                3: 'cot-detMul'
                            };

                            const idFormOrigen = {
                                2: 'rt-origIda',
                                3: 'rt-origMul'
                            }

                            const idFormDest = {
                                2: 'rt-destVue',
                                3: 'rt-destinoMul'
                            }

                            const idFromDet = idFromDets[destClicked] || '';
                            const idFormFecha = idFormFechas[destClicked] || '';
                            const idFormHora = idFormHoras[destClicked] || '';
                            const idFormPasajero = idFormPasajeros[destClicked] || '';
                            const idFormOr = idFormOrigen[destClicked] || '';
                            const idFormDes = idFormDest[destClicked] || '';

                            for (let i = 1; i < detalleRutas.length; i++) {
                                nuevaRuta();
                            }

                            const formDestino = document.querySelectorAll(`#fdest${destClicked} .nuevaRuta`);

                            if (formDestino.length == detalleRutas.length) {
                                formDestino.forEach((ruta, indice) => {

                                    const idDetalle = detalleRutas[indice].cot_det_id;
                                    const fechaSalida = detalleRutas[indice].fecha_salida;
                                    const horaSalida = detalleRutas[indice].hora_salida;
                                    const pasajeros = detalleRutas[indice].pasajeros;

                                    const origenId = detalleRutas[indice].origenId;
                                    const origenNombre = detalleRutas[indice].origMun;

                                    const destinoId = detalleRutas[indice].destinoId;
                                    const destinoNombre = detalleRutas[indice].destMun;

                                    const inputDetalle = document.querySelector(`#${idFromDet}${indice + 1}`);
                                    const inputFecha = ruta.querySelector(`#${idFormFecha}${indice + 1}`);
                                    const inputHora = ruta.querySelector(`#${idFormHora}${indice + 1}`);
                                    const inputPasajeros = ruta.querySelector(`#${idFormPasajero}${indice + 1}`);
                                    const inputOrigen = ruta.querySelector(`#${idFormOr}${indice + 1} option`);
                                    const inputDestino = ruta.querySelector(`#${idFormDes}${indice + 1} option`);

                                    inputDetalle.value = idDetalle;
                                    inputFecha.value = fechaSalida;
                                    inputHora.value = horaSalida;
                                    inputPasajeros.value = pasajeros;
                                    inputOrigen.value = origenId;
                                    inputOrigen.text = origenNombre;
                                    inputDestino.value = destinoId;
                                    inputDestino.text = destinoNombre;
                                });
                            }
                        } else if (destClicked == 1) {
                            if (detalleRutas.length > 0) {
                                const idDetalle = detalleRutas[0].cot_det_id;
                                const fechaSalida = detalleRutas[0].fecha_salida;
                                const horaSalida = detalleRutas[0].hora_salida;
                                const pasajeros = detalleRutas[0].pasajeros;
                                const origenId = detalleRutas[0].origenId;
                                const origenNombre = detalleRutas[0].origMun;
                                const destinoId = detalleRutas[0].destinoId;
                                const destinoNombre = detalleRutas[0].destMun;

                                const inputDetalle = document.querySelector(`#cot-det1`);
                                const inputFecha = document.querySelector(`#rt-fecha1`);
                                const inputHora = document.querySelector(`#rt-hora1`);
                                const inputPasajeros = document.querySelector(`#rt-pax1`);
                                const inputOrigen = document.querySelector(`#rt-origen1 option`);
                                const inputDestino = document.querySelector(`#rt-destino1 option`);

                                inputDetalle.value = idDetalle;
                                inputFecha.value = fechaSalida;
                                inputHora.value = horaSalida;
                                inputPasajeros.value = pasajeros;
                                inputOrigen.value = origenId;
                                inputOrigen.text = origenNombre;
                                inputDestino.value = destinoId;
                                inputDestino.text = destinoNombre;
                            }
                        }

                    }


                    // CARGAR PASAJEROS
                    let datosPax = await obtenerPax(params.data.cotizar_id);
                    detallePax = datosPax.pasajeros;
                    let paxDoc = datosPax.paxDoc;

                    for (let i = 0; i < detallePax.length; i++) {
                        nuevoPax();
                    }

                    const formPax = document.querySelectorAll(`#formPasajeros .cont-pasajero`);
                    if (formPax.length == detallePax.length) {
                        formPax.forEach((ruta, indice) => {
                            const paxId = detallePax[indice].pasajero_id;
                            const paxName = detallePax[indice].nombre;

                            // const inputPaxId = ruta.querySelector(`#pasajero_id${indice + 1}`);
                            const inputPaxName = ruta.querySelector(`#paxName${indice + 1}`);

                            // inputPaxId.value = paxId;
                            inputPaxName.value = paxName;
                            inputPaxName.dataset.pax = paxId;

                            if (paxDoc) {

                                const documentos = obtenerDocumentosPorPaxId(paxId);
                                // Obtener el contenedor de documentos
                                const contenedorDocs = ruta.querySelector('.contenedor-docs');

                                // Crear enlaces y agregarlos al DOM
                                documentos.forEach(doc => {

                                    const enlace = document.createElement('a');
                                    enlace.classList.add('thumbnail');
                                    enlace.href = `/${doc.ruta}/${doc.hash_doc}.${doc.tipo_doc}`;
                                    enlace.setAttribute('target', '_blank'); // Abre el enlace en una nueva pestaña

                                    const divIcon = document.createElement('DIV');
                                    divIcon.classList.add('fileicon');

                                    const icon = document.createElement('I');
                                    icon.classList.add('fa-regular', 'fa-file');

                                    const divName = document.createElement('DIV');
                                    divName.classList.add('filename');

                                    const name = document.createElement('P');
                                    name.textContent = `${doc.nombre_doc}`;

                                    divIcon.appendChild(icon);
                                    divName.appendChild(name);
                                    enlace.appendChild(divIcon);
                                    enlace.appendChild(divName);
                                    contenedorDocs.appendChild(enlace);
                                });
                            }

                        });
                    }

                    // Función para contar documentos y crear enlaces por paxId
                    function obtenerDocumentosPorPaxId(paxId) {
                        if (paxDoc[paxId]) {
                            if (Array.isArray(paxDoc[paxId])) {
                                return paxDoc[paxId];
                            } else {
                                return [paxDoc[paxId]]; // Si no es un arreglo, convertirlo en un arreglo con un solo elemento
                            }
                        } else {
                            return []; // No hay documentos para el pasajero dado
                        }
                    }

                    activarRutas();
                    await activarSecciones();
                });

                const actionContainer = document.createElement('div');
                actionContainer.classList = "btn-cont centrado";
                actionContainer.appendChild(editButton);
                $('.pax').prop('disabled', false);

                return actionContainer;
            },
            width: 150,
            headerClass: 'txt-center',
            cellClass: 'custom-action-cell', // Agregar la clase CSS 'custom-action-cell' a todas las celdas en esta columna
            filter: false
        }

    ];
    let data = '';
    iniciarTabla(data, columnDefs, '#myGrid');
    obtenerCotizaciones();
    mostrarClienteBroker(1);
}

// FUNCIONES
async function resetForm() {
    resetearTabla('#myGrid2', '#searchInput1');
    cerrarVentana('.contenedor-altas', ['#formAltas']);
    $('.nav-destinos button').removeClass('event-none');
    $('#rt-comment').val('');
    $('#inpCliente').hide();
    $('#inpEmpresa').hide();
    $('#estatus').val('');
    setFechaActual('fecha-cot');
    currentStep = 1;
    maxId = 0;
    updateActiveClass();
    $(".ruta-origen").removeClass('disabled-element');
    $('#formRelRuta').empty();
    $("#dest1, #dest2, #dest3").hide();
    $("#dest" + currentStep).show();
    $("select[name^='rt-orig'], select[name^='rt-dest']").prop('disabled', true);
    // limpiar pax
    const pax = document.querySelectorAll(`#formPasajeros .cont-pasajero`);
    // Iterar sobre los elementos a partir del segundo elemento
    for (let i = 0; i < pax.length; i++) {
        pax[i].remove(); // Eliminar el elemento
    }
}
async function mostrarContenedorAltas(estatus) {

    mostrarClienteBroker(1);
    // PENDIENTE COMBINAR CON ACTIVAR SECCIONES
    if (estatus != 'PND') {
        $("#contenedor").addClass('contenedor--lg');
        $("#contenedor").removeClass('contenedor--md');
        $("#cont-comment").hide();
        $("#formTotales").show();
    } else {
        $("#contenedor").removeClass('contenedor--lg');
        $("#contenedor").addClass('contenedor--md');
        $("#cont-comment").show();
        $("#formTotales").hide();
    }

    $(".contenedor-altas").show();
    await activarSecciones();
}
function activarRutas() {

    // Obtener los valores de los campos
    let aeronaveValue = $('#aeronave_id').val();
    let clienteValue = $('#cliente_id').val();
    let brokerValue = $('#broker_id').val();

    // Verificar si aeronave_id tiene valor y al menos uno de cliente_id o broker_id tiene valor
    let aeronaveTieneValor = (aeronaveValue != '');
    let clienteOBrokerTieneValor = (clienteValue != '' || brokerValue != '');

    // Habilitar o deshabilitar los elementos 'rt-orig' y 'rt-dest' según la condición
    $("select[name^='rt-orig'], select[name^='rt-dest']").prop('disabled', !(aeronaveTieneValor && clienteOBrokerTieneValor));
}
async function activarSecciones() {

    await deshabilitarElemento('cont-encabezado', 'cont-navegacion', 'cont-rutas', 'cont-detalle', 'costeo-pasajeros', 'costeo-relacion');
    let estatus = $("#estatus").val();
    $('#btnServicio').hide();
    $('#costeo-relacion').hide();

    if (!estatus) {
        $('#cont-navegacion').show();
        $('#cont-rutas').show();
        $('#cont-detalle').hide();
        $('#cont-pax').hide();
        $('#costeo-pasajeros').hide();
        habilitarElemento('cont-encabezado', 'cont-navegacion', 'cont-rutas', 'cont-comment');
    } else if (estatus == 'PND') {
        $(".ruta-origen").addClass('disabled-element');
        await habilitarElemento('cont-navegacion', 'cont-rutas');
        $('#cont-detalle').hide();
        $('#cont-pax').hide();
    } else if (estatus == 'CTZ') {
        habilitarElemento('costeo-pasajeros', 'cont-detalle', 'costeo-pasajeros', 'costeo-relacion');
        $('#cont-detalle').show();
        $('#cont-pax').show();
        $('#cont-navegacion').hide();
        $('#cont-rutas').hide();
        $('#btnServicio').show();
        $('#costeo-pasajeros').show();
        $('#costeo-relacion').show();
    } else if (estatus == 'SVC') {
        habilitarElemento('cont-detalle',);
        $('#cont-detalle').show();
        $('#cont-pax').show();
        $('#cont-navegacion').hide();
        $('#cont-rutas').hide();
        $('#costeo-pasajeros').show();
        $('#costeo-relacion').show();
    } else if (estatus == 'CMP') {
        habilitarElemento('cont-detalle');
        $('#cont-detalle').show();
        $('#cont-pax').show();
        $('#cont-navegacion').hide();
        $('#cont-rutas').hide();
        $('#costeo-pasajeros').show();
    }

    if (estatus == 'CTZ' || estatus == 'SVC' || estatus == 'CMP') {
        configTablaCrear();
    }
}
async function configTablaCrear() {
    let aeropuerto = await obtenerAeropuertos();
    let categoria = await obtenerCategorias();

    let columnDefs = [
        {
            headerName: 'Id',
            field: 'cot_det_id',
            width: 60,
        },
        {
            headerName: 'Fecha',
            field: "fecha_salida",
            width: 100,
            cellEditor: 'agDateCellEditor',
            valueFormatter: function (params) {
                let fecha = params.value;
                if (fecha) {
                    return formatearFecha(fecha);
                }
                return null;
            },
        },
        {
            headerName: 'Hora',
            field: "hora_salida",
            width: 75,
            columnGroupShow: "open",
            valueFormatter: function (params) {

                if (params.value !== null && params.value !== undefined) {
                    const hora = params.value;
                    let horas = 0;
                    let minutos = 0;
                    if (hora) {
                        if (hora.includes(':')) {
                            const partes = hora.split(':');

                            horas = partes[0];
                            minutos = partes[1];
                        } else {
                            horas = hora;
                        }
                    } else {
                        horas = hora;
                    }
                    // Convertir el valor numérico a horas y minutos
                    const hrsNum = parseFloat(horas);
                    const minNum = parseFloat(minutos);

                    const horaFormateada = `${hrsNum.toString().padStart(2, '0')}:${minNum.toString().padStart(2, '0')}`;
                    const horaRegex = /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;

                    if (horaRegex.test(horaFormateada)) {
                        return horaFormateada; // Devolver la hora formateada si es válida
                    } else {
                        return '00:00'; // Devolver un valor por defecto si el formato no es válido
                    }
                }

                return null;
            },
        },
        {
            headerName: 'Categoria',
            field: 'categoria',
            width: 95,
            cellEditor: 'agSelectCellEditor',
            editable: false,
            cellEditorParams: {
                values: ['', ...categoria.map(a => ({ categoria_id: a.categoria_id, nombre: a.nombre }))],
            },
            valueFormatter: function (params) {
                if (params.value) {
                    return params.value.nombre;
                }
            },
            valueGetter: function (params) {
                return params.data.categoria ? params.data.categoria.nombre : '';
            },
            valueSetter: function (params) {
                params.data.categoria = params.newValue;
                return true;
            },
        },
        {
            headerName: 'Concepto',
            field: 'concepto',
            width: 160,
        },
        {
            headerName: 'Origen',
            field: 'origen',
            width: 120,
            editable: false,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: ['', ...aeropuerto.map(a => ({ aeropuerto_id: a.aeropuerto_id, municipio: a.municipio }))],
            },
            valueFormatter: function (params) {
                if (params.value) {
                    return params.value.municipio;
                }
            },
            valueGetter: function (params) {
                return params.data.origen ? params.data.origen.municipio : '' // Debe devolver el objeto seleccionado
            },
            valueSetter: function (params) {
                params.data.origen = params.newValue;
                return true;
            },
        },
        {
            headerName: 'Destino',
            field: 'destino',
            width: 120,
            editable: false,
            cellEditor: 'agSelectCellEditor',
            cellEditorParams: {
                values: ['', ...aeropuerto.map(a => ({ aeropuerto_id: a.aeropuerto_id, municipio: a.municipio }))],
            },
            valueFormatter: function (params) {
                if (params.value) return params.value.municipio;
            },
            valueParser: function (params) {
                if (params.value) return { aeropuerto_id: params.value.aeropuerto_id, municipio: params.value.municipio };
            },
            valueGetter: function (params) {
                return params.data.destino ? params.data.destino.municipio : '' // Debe devolver el objeto seleccionado
            },
            cellClassRules: {
                'event-none': params => {
                    // Verificar si cot_det_id tiene un valor
                    const cotDetIdValue = params.data.cot_det_id;
                    return cotDetIdValue !== undefined && cotDetIdValue !== null && cotDetIdValue !== '';
                }
            },
        },
        {
            headerName: 'pax',
            field: 'pax',
            width: 60,
        },
        {
            headerName: 'Tipo',
            field: 'tipo_vuelo',
            width: 80,
            cellEditorParams: {
                values: ['N', 'I'], // Valores disponibles en el select: 'I' para Internacional y 'N' para Nacional
            },
            valueFormatter: function (params) {
                const tipoVuelo = params.value;

                // Mapear el valor 'I' a 'Internacional' y 'N' a 'Nacional'
                if (tipoVuelo === 'I') {
                    return 'Internacional';
                } else if (tipoVuelo === 'N') {
                    return 'Nacional';
                }

                // Retornar el valor original si no coincide con 'I' o 'N'
                return tipoVuelo;
            },
        },
        {
            headerName: 'Cant',
            field: 'cantidad',
            width: 80,
        },
        {
            headerName: 'Tarifa',
            field: 'tarifa',
            width: 100,
            editable: true,
            cellStyle: { textAlign: 'right' }, // Alinea los datos a la derecha
            cellEditor: 'agNumberCellEditor',
            valueFormatter: function (params) {
                if (params.value) {
                    // Formatea el número con comas como separadores de miles y dos decimales
                    return Number(params.value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
            }
        },
        {
            headerName: 'Subtotal',
            field: 'subtotal',
            width: 100,
            cellStyle: { textAlign: 'right' }, // Alinea los datos a la derecha
            valueFormatter: function (params) {
                if (params.value) {
                    // Formatea el número con comas como separadores de miles y dos decimales
                    return Number(params.value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
            }
        },
        {
            headerName: 'Relacion Ruta',
            field: 'rel_ruta',
            width: 80,
            // hide: true,
        },
        {
            headerName: 'Relacion',
            field: 'relaciones_id',
            width: 80,
            // hide: true,
        },
        {
            headerName: 'LineID',
            field: 'line_id',
            width: 80,
        },

    ];

    let data = '';
    iniciarTabla(data, columnDefs, '#myGrid2');
    await traerDetalle();
    ordenarPorCategoria()
}
async function updateActiveClass() {
    $(".nav-destinos button").removeClass("pasoActivo");
    $(".dest" + currentStep).addClass("pasoActivo");
    await cerrarVentana('', ['#fdest1', '#fdest2']);

    // Ida
    $("#rt-origen1 option").text('Origen');
    $("#rt-destino1 option").text('Destino');

    // Ida y Vuelta
    $("#rt-origIda1 option").text('Origen');
    $("#rt-origIda2 option").text('Destino');
    $("#rt-destVue1 option").text('Destino');
    $("#rt-destVue2 option").text('Destino');
    // Multidestino
    const opcMulti = document.querySelectorAll(`#fdest3 .nuevaRuta`);
    // Iterar sobre los elementos a partir del segundo elemento
    for (let i = 1; i < opcMulti.length; i++) {
        opcMulti[i].remove(); // Eliminar el elemento
    }
    $("#rt-origMul1 option").text('Origen');
    $("#rt-destinoMul1 option").text('Destino');
}
async function obtenerRutPaxCot(id) {
    try {

        const datos = new FormData();
        datos.append('cotizar_id', id);

        const respuesta = await fetch('../obtener/rutPaxCot', {
            method: 'POST',
            body: datos
        });
        const data = await respuesta.json();
        // console.log(data);

        return data;

    } catch (error) {
        console.error(error);
        SwalLoad('error', 'Ocurrio Un Error', 'Conección Perdida a BD.', false);
    }
}
async function relRutasPax(toggleRelRuta, params) {

    if (toggleRelRuta.classList.contains('expanded')) return;

    // Obtener los pasajeros guardados por ruta y cotización
    let detRutPax = await obtenerRutPaxCot($("#cotizar_id").val());

    // Agrupar los pasajeros por ruta
    let pasajerosPorRuta = detRutPax.reduce((acc, pax) => {
        if (!acc[pax.ruta_id]) {
            acc[pax.ruta_id] = [];
        }
        acc[pax.ruta_id].push(pax);
        return acc;
    }, {});

    // Crear un objeto para mantener un registro de los pasajeros seleccionados por ruta
    let pasajerosSeleccionadosPorRuta = {};

    gridApi.forEachNode(function (nodo) {
        if (nodo.data.categoria && nodo.data.categoria.nombre == 'Ruta') {

            let pRuta = document.createElement('p');
            pRuta.textContent = `Ruta: ${nodo.data.concepto}`;
            pRuta.classList.add("rel-ruta");
            pRuta.setAttribute('data-id', nodo.data.cot_det_id); // Asumiendo que nodo.data.id es el ID de la ruta

            // Crear el elemento select
            let selectPasajeros = document.createElement('select');
            selectPasajeros.name = `seleccion-${nodo.data.cot_det_id}`;

            // Obtener el formulario de pasajeros
            let formPasajeros = document.getElementById('formPasajeros');

            // Encontrar todos los elementos de pasajeros dentro del formulario
            let pasajerosElements = formPasajeros.querySelectorAll('.cont-pasajero [data-pax]');

            let optionEmpty = document.createElement('option');
            optionEmpty.value = ''; // Valor vacío para la opción
            optionEmpty.textContent = 'Agrega un pasajero'; // Texto vacío para la opción
            optionEmpty.disabled = true; // Deshabilitar la opción vacía
            optionEmpty.selected = true; // Seleccionar la opción vacía
            selectPasajeros.appendChild(optionEmpty); // Agregar la opción vacía al inicio del select

            // Iterar sobre los elementos de pasajeros y agregarlos al select
            pasajerosElements.forEach(pasajeroElement => {
                let nombrePasajero = $(`#${pasajeroElement.id}`).val();
                let idPasajero = $(`#${pasajeroElement.id}`).data('pax');
                let option = document.createElement('option');
                option.value = nombrePasajero; // Valor del pasajero
                option.textContent = nombrePasajero; // Texto del pasajero
                option.setAttribute('data-pax', idPasajero); // Añadir atributo data-pax con el ID del pasajero
                selectPasajeros.appendChild(option);
            });

            // Manejar el evento change del select
            selectPasajeros.addEventListener('change', function () {
                let pasajeroSeleccionado = selectPasajeros.value;
                let idPasajeroSeleccionado = selectPasajeros.options[selectPasajeros.selectedIndex].getAttribute('data-pax');

                // Obtener el ID de la ruta actual
                let idRuta = pRuta.getAttribute('data-id');

                // Verificar si ya existe un registro para la ruta actual
                if (!pasajerosSeleccionadosPorRuta[idRuta]) {
                    // Si no existe, crear un array vacío para almacenar los pasajeros seleccionados
                    pasajerosSeleccionadosPorRuta[idRuta] = [];
                }

                console.log(pasajerosSeleccionadosPorRuta);

                // Verificar si el pasajero ya ha sido seleccionado para esta ruta
                if (pasajerosSeleccionadosPorRuta[idRuta].includes(idPasajeroSeleccionado)) {
                    // Si el pasajero ya existe, mostrar un mensaje de error o realizar la acción correspondiente
                    console.log('¡Este pasajero ya ha sido seleccionado para esta ruta!');
                    selectPasajeros.value = '';
                    return; // Detener el proceso
                }

                // Agregar el pasajero al registro de la ruta actual
                pasajerosSeleccionadosPorRuta[idRuta].push(idPasajeroSeleccionado);

                let pasajeroElemento = document.createElement('p');
                pasajeroElemento.textContent = `Pasajero: ${pasajeroSeleccionado}`;
                pasajeroElemento.setAttribute('data-paxid', idPasajeroSeleccionado); // Añadir atributo data-pax al elemento p

                // Insertar el elemento p antes del selectPasajeros
                pRuta.insertBefore(pasajeroElemento, selectPasajeros);

                // Restablecer el select a la opción vacía
                selectPasajeros.value = '';
            });

            // Agregar el select al elemento pRuta
            pRuta.appendChild(selectPasajeros);

            // Agregar el elemento p al formulario 'formRelRuta'
            document.getElementById('formRelRuta').appendChild(pRuta);

            // Rellenar los datos si ya existen para esta ruta
            if (pasajerosPorRuta[nodo.data.cot_det_id]) {
                pasajerosPorRuta[nodo.data.cot_det_id].forEach(pax => {

                    let pasajeroElemento = document.createElement('p');
                    pasajeroElemento.textContent = `Pasajero: ${pax.nombre}`;
                    pasajeroElemento.setAttribute('data-paxid', pax.pasajero_id); // Añadir atributo data-pax al elemento p

                    // Insertar el elemento p antes del selectPasajeros
                    pRuta.insertBefore(pasajeroElemento, selectPasajeros);

                    // Marcar la opción como seleccionada en el select
                    let optionToSelect = Array.from(selectPasajeros.options).find(option => option.getAttribute('data-pax') == pax.pasajero_id);
                    if (optionToSelect) {
                        optionToSelect.selected = true;
                    }

                    // Agregar el pasajero al registro de la ruta actual
                    if (!pasajerosSeleccionadosPorRuta[nodo.data.cot_det_id]) {
                        pasajerosSeleccionadosPorRuta[nodo.data.cot_det_id.toString()] = [];
                    }
                    pasajerosSeleccionadosPorRuta[nodo.data.cot_det_id].push(pax.pasajero_id.toString());
                });

                console.log(pasajerosSeleccionadosPorRuta);
            }
        }
    });
}
async function ordenarPorCategoria() {
    const allData = [];
    const rutaRows = [];
    const aterrizajeRows = [];
    const pernoctaRows = [];
    const otrasCategoriasRows = [];

    // const categorias = obtenerCategorias();

    // Iterar sobre todas las filas de datos en la tabla
    gridApi.forEachNode(node => {
        const rowData = node.data;
        allData.push(rowData);

        // Clasificar las filas en diferentes arreglos segun la categoria
        if (rowData.categoria) {
            if (rowData.categoria.nombre == 'Ruta') {
                rutaRows.push(rowData);
            } else if (rowData.categoria && rowData.categoria.nombre == 'Pernocta') {
                pernoctaRows.push(rowData);
            } else if (rowData.categoria && rowData.categoria.nombre == 'Aterrizaje') {
                aterrizajeRows.push(rowData);
            } else {
                // Cualquier otra categoría
                otrasCategoriasRows.push(rowData);
            }
        }
    });

    // Concatenar todas las filas en el nuevo orden deseado
    let sortedRows = [...rutaRows, ...pernoctaRows, ...aterrizajeRows, ...otrasCategoriasRows];
    sortedRows.push({});

    if (sortedRows.length < 9) {
        const numObjetosVacios = 8;
        const arreglo2 = Array(numObjetosVacios - sortedRows.length).fill({});
        const arregloCombinado = sortedRows.concat(arreglo2);
        const nuevosDatosClonados = arregloCombinado.map(obj => ({ ...obj }));
        gridApi.updateGridOptions({ rowData: nuevosDatosClonados })
    } else {
        gridApi.updateGridOptions({ rowData: sortedRows })
    }

}

// FETCH
async function obtenerCotizaciones() {
    try {
        const respuesta = await fetch('../obtener/cotizaciones', {
            method: 'GET',
        });
        const data = await respuesta.json();

        let convert = verificarArray(data);
        gridApi.setGridOption('rowData', convert);

    } catch (error) {
        console.error(error);
        SwalToast('warning', 'Error al obtener las Cotizaciones', 2500);
    }
}
function actTotalesLineold(rowData) {
    // Tasa Aterrizaje 
    const tarifaAterrizaje = parseFloat(rowData.tarifa_aterrizaje || 0);
    const tarifaTerrestre = parseFloat(rowData.tarifa_ser_terrestre || 0);
    const tarifaAuxiliares = parseFloat(rowData.tarifa_ser_auxiliares || 0);
    let totTarTerr = tarifaAterrizaje + tarifaTerrestre + tarifaAuxiliares;
    rowData.total_costos = totTarTerr;

    // SubTotal
    const tiempoEstimado = parseFloat(rowData.hora_cotizada || 0);
    let pernocta = parseFloat(rowData.pernocta || 0);
    const costoTarifa = parseFloat(rowData.costo || 0);

    let subT = (tiempoEstimado * costoTarifa) + (pernocta * costoTarifa);
    subT = subT + totTarTerr;
    rowData.subtotal = subT;

    gridApi.applyTransaction({ update: [rowData] });
}
function actTotalesLine(rowData) {

    if (!rowData) return

    const lineaAct = rowData.line_id;

    gridApi.forEachNode(node => {
        if (node.data.line_id === lineaAct && node.data.categoria) {

            const categoria = node.data.categoria.nombre;
            const pernocta = node.data.percost;
            const cantidad = node.data.cantidad;
            const tarifa = node.data.tarifa;
            let subtotal = 0;

            if (categoria == 'Ruta') {
                subtotal = cantidad * tarifa;
            } else if (categoria == 'Pernocta') {
                subtotal = (cantidad * pernocta) * tarifa;
            } else if (categoria == 'Aterrizaje') {
                subtotal = tarifa;
            } else {
                subtotal = cantidad * tarifa;
            }

            // Actualizar el subtotal en el nodo de datos
            node.setDataValue('subtotal', subtotal);
        }
        // Refrescar las celdas para mostrar los nuevos subtotales
        gridApi.refreshCells({ force: true });
    });
}
function actTotales() {

    // Actualizar Totales Generales
    let cantPernoctas = 0;
    let totPernoctas = 0;
    let cantHoras = 0;
    let totalHoras = 0;
    let subtotalInpt = 0;

    let subtNac = 0;
    let subtInt = 0;
    let ivaNac = 0;
    let ivaInt = 0;

    // Iterar sobre todas las filas de la tabla
    gridApi.forEachNode(node => {
        const hr_cant = parseFloat(node.data.cantidad || 0);
        const subtotal = parseFloat(node.data.subtotal || 0);

        if (node.data.categoria && node.data.categoria.nombre == 'Pernocta') {
            cantPernoctas += hr_cant;
            totPernoctas += subtotal;
        }

        if (node.data.categoria && node.data.categoria.nombre == 'Ruta') {
            cantHoras += hr_cant;
            totalHoras += subtotal;
        }

        subtotalInpt += subtotal;

        if (node.data.tipo_vuelo == 'N') {
            subtNac += subtotal;
        } else if (node.data.tipo_vuelo == 'I') {
            subtInt += subtotal;
        }

    });

    ivaNac = subtNac * 0.16;
    ivaInt = subtInt * 0.04;

    // Actualizar el valor del input 'cant_hrs'
    $('#cant_pernocta').val(cantPernoctas);
    $('#tot_pernocta').val(totPernoctas);
    $('#cant_hrs').val(cantHoras);
    $('#tot_hrs').val(totalHoras);
    $('#subtotal').val(subtotalInpt);
    $('#ivaNac').val(ivaNac);
    $('#ivaInt').val(ivaInt);
    $('#total').val(subtotalInpt + ivaNac + ivaInt);
}
async function obtenerAeronaves() {
    try {
        const respuesta = await fetch('../allAeronaves', {
            method: 'GET'
        });
        const data = await respuesta.json();

        if (!data.length > 0) SwalToast('warning', 'No hay Aeronaves disponibles.', 2500);

        return data;
    } catch (error) {
        console.error(error);
        SwalLoad('error', 'Ocurrio Un Error', 'Conección Perdida a BD.', false);
    }
}
async function obtenerBroker() {
    try {
        const respuesta = await fetch('../brokers/activas', {
            method: 'GET'
        });
        const data = await respuesta.json();
        // console.log(data);

        if (!data.length > 0) { SwalToast('warning', 'No hay Programas disponibles.', 2500); }
        else {
            BROKERS = data;
        }


        return data;
    } catch (error) {
        console.error(error);
        SwalLoad('error', 'Ocurrio Un Error', 'Conección Perdida a BD.', false);
    }
}
async function obtenerClientes() {
    try {
        const respuesta = await fetch('../allClientes', {
            method: 'GET'
        });
        const data = await respuesta.json();
        // console.log(data);

        if (!data.length > 0) SwalToast('warning', 'No hay Clientes disponibles.', 2500);

        return data;
    } catch (error) {
        console.error(error);
        SwalLoad('error', 'Ocurrio Un Error', 'Conección Perdida a BD.', false);
    }
}
async function obtenerAeropuertos() {
    try {
        const respuesta = await fetch('../allAeropuertos', {
            method: 'GET'
        });
        const data = await respuesta.json();
        // console.log(data);
        if (!data.length > 0) {
            SwalToast('warning', 'No hay Aeropuertos disponibles.', 2500);
        } else {
            AEROPUERTOS = data;
        }

        return data;
    } catch (error) {
        console.error(error);
        SwalLoad('error', 'Ocurrio Un Error', 'Conección Perdida a BD.', false);
    }
}
async function obtenerPax(id) {
    try {
        const datos = new FormData();
        datos.append('cotizar_id', id);

        const respuesta = await fetch('../obtener/pax', {
            method: 'POST',
            body: datos
        });
        const data = await respuesta.json();

        return data;
    } catch (error) {
        console.error(error);
        SwalLoad('error', 'Ocurrio Un Error', 'Conección Perdida a BD.', false);
    }
}
async function obtenerPasajeros() {
    try {

        const respuesta = await fetch('../obtener/pasajeros', {
            method: 'get',
        });
        const data = await respuesta.json();

        return data;
    } catch (error) {
        console.error(error);
        SwalLoad('error', 'Ocurrio Un Error', 'Conección Perdida a BD.', false);
    }
}
// Función para manejar el evento mousedown
async function mostrarListaOrigen(event) {
    event.preventDefault();
    if (AEROPUERTOS == '') { let data = await obtenerAeropuertos(); }
    // Obtener el número del vuelo
    let flightNumber = $(this).attr('id').replace('rt-origMul', '');
    // Mostrar el elemento de búsqueda de origen correspondiente
    $(`.origSchMul${flightNumber}`).show();
    $(`.inOrigSrchMul${flightNumber}`).focus();
    const listSearch = await mostrarListaSearch(AEROPUERTOS, `.origSchMul${flightNumber}`, 'aeropuerto_id', 'municipio');
    if (listSearch) {
        let slcActivo = this.parentNode.parentNode.parentNode;
        existeRuta(slcActivo);
        activarRutas();

    }
}
async function mostrarListaDestino(event) {
    event.preventDefault();
    if (AEROPUERTOS == '') { let data = await obtenerAeropuertos(); }
    // Obtener el número del vuelo
    let flightNumber = $(this).attr('id').replace('rt-destinoMul', '');
    $(`.destSrchMul${flightNumber}`).show();
    $(`.inDestgSrchMul${flightNumber}`).focus();
    const listSearch = await mostrarListaSearch(AEROPUERTOS, `.destSrchMul${flightNumber}`, 'aeropuerto_id', 'municipio');
    if (listSearch) {
        let slcActivo = this.parentNode.parentNode.parentNode;
        existeRuta(slcActivo);
        activarRutas();
    }
}
// validar rutas por formulario 
function validarRutas(idForm) {

    let isEmpty = false;
    let form = document.getElementById(idForm);
    let inputs = form.querySelectorAll('select, input[type="date"]');

    let elementsWithErrors = form.querySelectorAll('.errorRuta');
    // Iterar sobre cada elemento y eliminar la clase 'errorRuta'
    elementsWithErrors.forEach(function (element) {
        element.classList.remove('errorRuta');
    });

    // Iterar sobre cada elemento
    inputs.forEach(function (input) {
        // Verificar si el campo está vacío
        if (!input.value.trim()) {
            if (input.tagName == 'SELECT') {
                input.parentNode.parentNode.parentNode.classList.add('errorRuta');
            } else if (input.tagName == 'INPUT') {
                input.classList.add('errorRuta');
            }
            isEmpty = true;
        }
    });

    return isEmpty;
}

async function obtenerRutas() {
    let botonActivo = $('.nav-destinos').find('.pasoActivo');
    let indiceBotonActivo = $('.nav-destinos button').index(botonActivo);

    if (indiceBotonActivo === 0) {
        if (validarRutas('fdest1')) return;

        let form = '#fdest1';
        let rutas = [];

        const formDestino = document.querySelectorAll(`${form} .nuevaRuta`);

        // Usar Promise.all para esperar a que todas las llamadas a obtenerCodigosIATA se completen
        await Promise.all(Array.from(formDestino).map(async (ruta, indice) => {
            let idDet = ruta.querySelector('input[id^="cot-det"]');
            idDet = idDet.getAttribute('id');
            idDet = $(`#${idDet}`).val();
            let origen = ruta.querySelector('select[id^="rt-origen"]').value;
            let destino = ruta.querySelector('select[id^="rt-destino"]').value;
            let fecha = ruta.querySelector('input[id^="rt-fecha"]').value;
            let pax = ruta.querySelector('input[id^="rt-pax"]').value;
            let hora = ruta.querySelector('input[id^="rt-hora"]').value;

            let cod = await obtenerCodigosIATA(origen, destino);

            let rutaActual = {
                line_id: indice + 1,
                categoria_id: 1,
                concepto: cod,
                cot_det_id: idDet,
                origen: origen,
                destino: destino,
                fecha_salida: fecha,
                pasajeros: pax,
                hora_salida: hora,
            }

            rutas.push(rutaActual);
        }));

        return rutas;
    } else if (indiceBotonActivo === 1) {
        if (validarRutas('fdest2')) return;

        let form = '#fdest2';
        let rutas = [];

        const formDestino = document.querySelectorAll(`${form} .nuevaRuta`);

        await Promise.all(Array.from(formDestino).map(async (ruta, indice) => {
            let idDet = ruta.querySelector('input[id^="cot-detIda"]');
            idDet = idDet.getAttribute('id');
            idDet = $(`#${idDet}`).val();
            let origen = ruta.querySelector('select[id^="rt-origIda"]').value;
            let destino = ruta.querySelector('select[id^="rt-destVue"]').value;
            let fecha = ruta.querySelector('input[id^="rt-fechaIda"]').value;
            let pax = ruta.querySelector('input[id^="rt-paxIda"]').value;
            let hora = ruta.querySelector('input[id^="rt-horaIda"]').value;

            let cod = await obtenerCodigosIATA(origen, destino);

            let rutaActual = {
                line_id: indice + 1,
                categoria_id: 1,
                concepto: cod,
                cot_det_id: idDet,
                origen: origen,
                destino: destino,
                fecha_salida: fecha,
                pasajeros: pax,
                hora_salida: hora,
            }

            rutas.push(rutaActual);
        }));

        return rutas;
    } else if (indiceBotonActivo === 2) {
        if (validarRutas('fdest3')) return;

        let form = '#fdest3';
        let rutas = [];

        const formDestino = document.querySelectorAll(`${form} .nuevaRuta`);

        await Promise.all(Array.from(formDestino).map(async (ruta, indice) => {
            let idDet = ruta.querySelector('input[id^="cot-detMul"]');
            idDet = idDet.getAttribute('id');
            idDet = $(`#${idDet}`).val();
            let origen = ruta.querySelector('select[id^="rt-origMul"]').value;
            let destino = ruta.querySelector('select[id^="rt-destinoMul"]').value;
            let fecha = ruta.querySelector('input[id^="rt-fechaMul"]').value;
            let pax = ruta.querySelector('input[id^="rt-paxMul"]').value;
            let hora = ruta.querySelector('input[id^="rt-horaMul"]').value;

            let cod = await obtenerCodigosIATA(origen, destino);

            let rutaActual = {
                line_id: indice + 1,
                categoria_id: 1,
                concepto: cod,
                cot_det_id: idDet,
                origen: origen,
                destino: destino,
                fecha_salida: fecha,
                pasajeros: pax,
                hora_salida: hora,
            }

            rutas.push(rutaActual);
        }));

        return rutas;
    }
}
async function obtenerDocsbyPax(id) {

    try {

        const datos = new FormData();
        datos.append('pasajero_id', id);

        const respuesta = await fetch('../obtener/pasajerosDocs', {
            method: 'POST',
            body: datos
        });

        const data = await respuesta.json();
        // if (!data.length > 0) SwalToast('warning', 'No hay Documentos disponibles.', 2500);

        return data
    } catch (error) {
        console.error(error);
        SwalLoad('error', 'Error en la Conexión', 'Comunicate con el Administrador', false);
    }
}
async function obtnerVuelosId(id) {
    try {
        const datos = new FormData();
        datos.append('cotizar_id', id);

        const respuesta = await fetch('../obtener/vuelos', {
            method: 'POST',
            body: datos
        });
        const data = await respuesta.json();

        return data;
    } catch (error) {
        console.error(error);
        SwalLoad('error', 'Ocurrio Un Error', 'Conección Perdida a BD.', false);
    }
}
async function obtenerTasaAterrizaje(origenVal, aeronave) {
    try {
        const datos = new FormData();
        datos.append('origen', origenVal);
        datos.append('aeronave_id', aeronave);

        const respuesta = await fetch('../valida/aterrizaje', {
            method: 'POST',
            body: datos
        });

        const data = await respuesta.json();


        return data;
    } catch (error) {
        console.error(error);
        SwalToast('warning', 'Error al obtener los usuarios', 2500);
    }
}
async function obtenerCategorias() {
    try {
        const respuesta = await fetch('../obtener/categorias', {
            method: 'GET'
        });
        const data = await respuesta.json();
        if (!data.length > 0) {
            SwalToast('warning', 'No hay Categorias disponibles.', 2500);
        }

        return data;
    } catch (error) {
        console.error(error);
        SwalLoad('error', 'Ocurrio Un Error', 'Conección Perdida a BD.', false);
    }
}
async function validaRutaTarifa(origenVal, destinoVal) {
    try {
        let cliente = $('#cliente_id').val();
        let broker = $('#broker_id').val();
        const aeronave = $('#aeronave_id').val();

        const datos = new FormData();
        datos.append('origen', origenVal);
        datos.append('destino', destinoVal);
        datos.append('cliente_id', cliente);
        datos.append('broker_id', broker);
        datos.append('aeronave_id', aeronave);

        const respuesta = await fetch('../valida/ruta', {
            method: 'POST',
            body: datos
        });

        const data = await respuesta.json();

        return data;
    } catch (error) {
        console.error(error);
        SwalToast('warning', 'Error al obtener los usuarios', 2500);
    }
}
function mostrarClienteBroker(opcionSeleccionada) {
    $('#inpCliente').toggle(opcionSeleccionada == 1);
    $('#inpEmpresa').toggle(opcionSeleccionada == 2);

    if (opcionSeleccionada == 1) {
        $("label[for='cliente_id']").addClass("labelImportant");
        $("label[for='broker_id']").removeClass("labelImportant");
        $("select[id='broker_id'] option").val("");
        $("select[id='broker_id'] option").text("");
    } else if (opcionSeleccionada == 2) {
        $("label[for='broker_id']").addClass("labelImportant");
        $("label[for='cliente_id']").removeClass("labelImportant");
        $("#rt-responsable").val("");
        $("select[id='cliente_id'] option").val("");
        $("select[id='cliente_id'] option").text("");
    }
}
function nuevaRuta() {

    let form = document.getElementById('fdest3');
    let flightCount = form.querySelectorAll('.ruta-origen').length;

    // Actualizar maxId si flightCount es mayor
    if (flightCount > maxId) {
        maxId = flightCount;
    }

    let nuevoMax = maxId + 1;
    maxId = nuevoMax;

    // Crear el nuevo elemento de vuelo cot-det
    let newFlight = document.createElement('div');
    newFlight.classList.add('row', 'gap-1', 'nuevaRuta');

    newFlight.innerHTML = `
        <div class="col-7">
            <input type="text" id="cot-detMul${nuevoMax}" class="hidden">
            <p>Ruta <span>${nuevoMax}</span></p>
            <div class="row ruta-origen hr_separador">
                <div class="col-6 listados">
                    <div class="vuelo-titulo">
                        <select name="rt-origMul${nuevoMax}" id="rt-origMul${nuevoMax}" placeholder="">
                            <option value="">Origen</option>
                        </select>
                    </div>
                    <i class="vuelo-icon fa-solid fa-plane-departure"></i>
                    <div class="containerSearch origSchMul${nuevoMax}">
                        <input placeholder="Buscar..." class="inOrigSrchMul${nuevoMax}" type="search" name="inOrigSrchMul${nuevoMax}">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>
                </div>
                <div class="separador-icon">
                    <i class=" fa-solid fa-arrow-right"></i>
                </div>
                <div class="col-6 listados">
                    <div class="vuelo-titulo">
                        <select name="rt-destinoMul${nuevoMax}" id="rt-destinoMul${nuevoMax}" placeholder="">
                            <option value="">Destino</option>
                        </select>
                    </div>
                    <i class="vuelo-icon fa-solid fa-plane-arrival"></i>
                    <div class="containerSearch destSrchMul${nuevoMax}">
                        <input placeholder="Buscar..." class="inDestgSrchMul${nuevoMax}" type="search" name="inDestgSrchMul${nuevoMax}">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>
                </div>
            </div>
            <a class="btn btn-eliminarRuta" id="eliminarRuta${nuevoMax}">Eliminar ruta</a>
        </div>
        <div class="col-5 row gap-1">

            <div class="rt-fecha">
                <label for="rt-fechaMul${nuevoMax}">Fecha</label>
                <input type="date" id="rt-fechaMul${nuevoMax}" />
            </div>
            <div class="rt-hora">
                <label for="rt-horaMul${nuevoMax}">Hora:</label>
                <input type="time" name="rt-horaMul${nuevoMax}" id="rt-horaMul${nuevoMax}">
            </div>
            <div class="rt-pax">
                <label for="rt-paxMul${nuevoMax}">Pax</label>
                <input class="pax" type="number" name="" id="rt-paxMul${nuevoMax}" min="0" placeholder="0">
            </div>
        </div>
    `;

    // Agregar nueva ruta
    document.getElementById('fdest3').appendChild(newFlight);

    // Ocultar el elemento de búsqueda de origen correspondiente
    $(`.origSchMul${nuevoMax}`).hide();
    $(`.destSrchMul${nuevoMax}`).hide();

    // Asignar evento mousedown al nuevo elemento de origen
    $(`#rt-origMul${nuevoMax}`).on("mousedown", mostrarListaOrigen);
    $(`#rt-destinoMul${nuevoMax}`).on("mousedown", mostrarListaDestino);
    $("select[name^='rt-orig'], select[name^='rt-dest']").prop('disabled', true);
    activarRutas();

    // Agregar event listener al botón "Eliminar ruta"
    $(`#eliminarRuta${nuevoMax}`).on("click", function () {
        // id a eliminar 
        const idRuta = $('#cotizar_id').val();
        const cot_det_id = $(`#cot-detMul${nuevoMax}`).val();

        if (cot_det_id && idRuta) eliminarRuta(idRuta, cot_det_id);

        $(this).closest('.nuevaRuta').remove(); // Eliminar el div padre más cercano con la clase 'nuevaRuta'
    });
}
function nuevoPax() {
    const formPasajeros = document.getElementById('formPasajeros');
    const btnPasajero = document.getElementById('btnPasajero');
    let contadorPasajeros = formPasajeros.querySelectorAll('.cont-pasajero').length + 1;

    // Crear nuevo div para el nuevo pasajero
    const nuevoPasajeroDiv = document.createElement('DIV');
    nuevoPasajeroDiv.classList.add('cont-form3', 'cont-pasajero');

    // Crear div contenedor para el grupo de entrada de texto
    const divInputGroupText = document.createElement('DIV');
    divInputGroupText.classList.add('form-group');

    // Crear input para el id del pasajero
    const idPaxInput = document.createElement('INPUT');
    idPaxInput.type = 'text';
    idPaxInput.id = 'pasajero_id' + contadorPasajeros;
    idPaxInput.classList.add('hidden');
    // divInputGroupText.appendChild(idPaxInput);

    // Crear input para el nombre del pasajero
    const nuevoNombreInput = document.createElement('INPUT');
    nuevoNombreInput.type = 'text';
    nuevoNombreInput.id = 'paxName' + contadorPasajeros;
    // nuevoNombreInput.dataset.target = contadorPasajeros;
    nuevoNombreInput.placeholder = '';
    divInputGroupText.appendChild(nuevoNombreInput);

    // Crear label para el nombre del pasajero
    const nuevoNombreLabel = document.createElement('LABEL');
    nuevoNombreLabel.textContent = 'Pasajero ' + contadorPasajeros + ':';
    nuevoNombreLabel.htmlFor = 'paxName' + contadorPasajeros;
    divInputGroupText.appendChild(nuevoNombreLabel);

    // Agregar div de entrada de texto al div del pasajero
    nuevoPasajeroDiv.appendChild(divInputGroupText);

    // Crear div contenedor para el grupo de entrada de archivo
    const divInputGroupFile = document.createElement('DIV');
    divInputGroupFile.classList.add('form-group');

    // Crear input de archivo para el pasajero
    const nuevoArchivoInput = document.createElement('INPUT');
    nuevoArchivoInput.type = 'file';
    nuevoArchivoInput.name = 'paxFile' + contadorPasajeros;
    nuevoArchivoInput.id = 'paxFile' + contadorPasajeros;
    nuevoArchivoInput.accept = 'image/*';  // Esto permite solo archivos de imagen
    divInputGroupFile.appendChild(nuevoArchivoInput);

    // Crear input de eliminar para el pasajero
    const nuevoEliminar = document.createElement('A');
    nuevoEliminar.id = 'btnEliminarPax' + contadorPasajeros;
    nuevoEliminar.classList.add('btn', 'btn-eliminarPax');
    nuevoEliminar.title = 'Eliminar Pasajero';

    // Crear Div Mostrar Docs
    const divDocs = document.createElement('DIV');
    divDocs.classList.add('contenedor-docs', 'flex');

    divInputGroupFile.appendChild(nuevoEliminar);

    // Agregar div de entrada de archivo al div del pasajero
    nuevoPasajeroDiv.appendChild(divInputGroupFile);

    // Insertar el nuevo pasajero antes del botón "Agregar Pasajero"
    // formPasajeros.insertBefore(nuevoPasajeroDiv, btnPasajero);
    formPasajeros.appendChild(nuevoPasajeroDiv);

    // Agregar Div Docs
    nuevoPasajeroDiv.appendChild(divDocs);


    $(`#btnEliminarPax${contadorPasajeros}`).on("click", async function () {
        // id a eliminar 
        const cotizar_id = $('#cotizar_id').val();
        // const pasajero_id = $(`#pasajero_id${contadorPasajeros}`).val();
        const pasajero_id = $(this).closest('.cont-pasajero').find('input[id^="paxName"]').data('pax');

        if (cotizar_id && pasajero_id) await eliminarPasajero(cotizar_id, pasajero_id);

        $(this).closest('.cont-pasajero').remove(); // Eliminar el div padre más cercano con la clase 'nuevaRuta'
    });
}
async function setPaxId(listSearch) {

    let flagRepetido = 0;

    // Antes de agregar el pasajero, validar si ya existe 
    let form = '#formPasajeros';
    const contPasajeros = document.querySelectorAll(`${form} .cont-pasajero`);
    contPasajeros.forEach((ruta, indice) => {
        let inputElement = ruta.querySelector('input[id^="paxName"]');

        if (inputElement) {
            let dataPaxnValue = inputElement.dataset.paxn || inputElement.dataset.pax;
            if (dataPaxnValue == listSearch['pasajero_id']) flagRepetido = 1;
        }
    });

    if (flagRepetido == 0) {

        const pasajero_id = listSearch['pasajero_id'];

        const docsPAx = await obtenerDocsbyPax(pasajero_id);

        const formPasajeros = document.getElementById('formPasajeros');
        const btnPasajero = document.getElementById('btnPasajero');
        const slcPasajero = document.getElementById('pasajero_id');
        let contadorPasajeros = formPasajeros.querySelectorAll('.cont-pasajero').length + 1;

        // Crear nuevo div para el nuevo pasajero
        const nuevoPasajeroDiv = document.createElement('DIV');
        nuevoPasajeroDiv.classList.add('cont-form3', 'cont-pasajero');

        // Crear div contenedor para el grupo de entrada de texto
        const divInputGroupText = document.createElement('DIV');
        divInputGroupText.classList.add('form-group');

        // Crear input para el id del pasajero
        const idPaxInput = document.createElement('INPUT');
        idPaxInput.type = 'text';
        idPaxInput.id = 'pasajero_id' + contadorPasajeros;
        idPaxInput.classList.add('hidden');

        // Crear input para el nombre del pasajero
        const nuevoNombreInput = document.createElement('INPUT');
        nuevoNombreInput.type = 'text';
        nuevoNombreInput.id = 'paxName' + contadorPasajeros;
        // nuevoNombreInput.dataset.target = contadorPasajeros;
        nuevoNombreInput.placeholder = '';
        nuevoNombreInput.value = listSearch['nombre'];
        nuevoNombreInput.setAttribute('data-paxN', pasajero_id); // Añadir atributo data-pax con el ID del pasajero
        divInputGroupText.appendChild(nuevoNombreInput);

        // Crear label para el nombre del pasajero
        const nuevoNombreLabel = document.createElement('LABEL');
        nuevoNombreLabel.textContent = 'Pasajero ' + contadorPasajeros + ':';
        nuevoNombreLabel.htmlFor = 'paxName' + contadorPasajeros;
        divInputGroupText.appendChild(nuevoNombreLabel);

        // Agregar div de entrada de texto al div del pasajero
        nuevoPasajeroDiv.appendChild(divInputGroupText);

        // Crear div contenedor para el grupo de entrada de archivo
        const divInputGroupFile = document.createElement('DIV');
        divInputGroupFile.classList.add('form-group');

        // Crear input de archivo para el pasajero
        const nuevoArchivoInput = document.createElement('INPUT');
        nuevoArchivoInput.type = 'file';
        nuevoArchivoInput.name = 'paxFile' + contadorPasajeros;
        nuevoArchivoInput.id = 'paxFile' + contadorPasajeros;
        nuevoArchivoInput.accept = 'image/*';  // Esto permite solo archivos de imagen
        divInputGroupFile.appendChild(nuevoArchivoInput);

        // Crear input de eliminar para el pasajero
        const nuevoEliminar = document.createElement('A');
        nuevoEliminar.id = 'btnEliminarPax' + contadorPasajeros;
        nuevoEliminar.classList.add('btn', 'btn-eliminarPax');
        nuevoEliminar.title = 'Eliminar Pasajero';

        // Crear Div Mostrar Docs
        const divDocs = document.createElement('DIV');
        divDocs.classList.add('contenedor-docs', 'flex');

        divInputGroupFile.appendChild(nuevoEliminar);

        // Agregar div de entrada de archivo al div del pasajero
        nuevoPasajeroDiv.appendChild(divInputGroupFile);

        // Insertar el nuevo pasajero antes del botón "Agregar Pasajero"
        // formPasajeros.insertBefore(nuevoPasajeroDiv, btnPasajero);
        formPasajeros.appendChild(nuevoPasajeroDiv);

        // Agregar Div Docs
        nuevoPasajeroDiv.appendChild(divDocs);


        // Si tiene Documentos agregarlos
        if (docsPAx.length > 0) {
            // let container = document.getElementsByClassName('contenedor-docs');
            // container = container[0];

            docsPAx.forEach(doc => {

                const enlace = document.createElement('a');
                enlace.classList.add('thumbnail');
                enlace.href = `/${doc.ruta}/${doc.hash_doc}.${doc.tipo_doc}`;
                enlace.setAttribute('target', '_blank'); // Abre el enlace en una nueva pestaña

                const divIcon = document.createElement('DIV');
                divIcon.classList.add('fileicon');

                const icon = document.createElement('I');
                icon.classList.add('fa-regular', 'fa-file');

                const divName = document.createElement('DIV');
                divName.classList.add('filename');

                const name = document.createElement('P');
                name.textContent = `${doc.nombre_doc}`;

                divIcon.appendChild(icon);
                divName.appendChild(name);
                enlace.appendChild(divIcon);
                enlace.appendChild(divName);
                divDocs.appendChild(enlace);

            });
        }

        $(`#btnEliminarPax${contadorPasajeros}`).on("click", async function () {

            // id a eliminar 
            const cotizar_id = $('#cotizar_id').val();
            // const pasajero_id = $(`#pasajero_id${contadorPasajeros}`).val();
            const pasajero_id = $(this).closest('.cont-pasajero').find('input[id^="paxName"]').data('paxn');

            $(this).closest('.cont-pasajero').remove(); // Eliminar el div padre más cercano con la clase 'nuevaRuta'
        });

    }

}
async function validarRutaPax() {

    // Crear un array para almacenar todas las relaciones posibles
    const relaciones = [];

    // Obtener todos los elementos <p> dentro del formulario 'formRelRuta'
    $('#formRelRuta').find('p[data-id]').each(function () {
        const $pElemento = $(this);
        const ruta_id = $pElemento.attr('data-id');

        $(this).find('p[data-paxid]').each(function () {
            const $pElemento = $(this);
            const pasajero_id = $pElemento.attr('data-paxid');

            if (ruta_id && pasajero_id) {
                relaciones.push({ ruta_id, pasajero_id });
            }
        });
    });

    return relaciones;
}
async function validarPasajeros() {

    let form = '#formPasajeros';
    const pasajerosDet = [];
    const contPasajeros = document.querySelectorAll(`${form} .cont-pasajero`);

    contPasajeros.forEach((ruta, indice) => {
        let nombre = ruta.querySelector('input[id^="paxName"]');
        let nombre_ruta = ruta.querySelector('input[id^="paxFile"]');

        let paxActual = {};

        if ((nombre && nombre.value.trim() !== '') || (nombre && nombre.dataset.paxn)) {
            // Obtener el id de pasajero desde el data-target
            let id_pax = nombre.dataset.pax || nombre.dataset.paxn;

            if (id_pax) {
                paxActual.pasajero_id = id_pax.trim();
            }
            if (nombre_ruta && nombre_ruta.files.length > 0) {
                paxActual.nombre_ruta = nombre_ruta.files[0];
            }
            paxActual.nombre = nombre.value.trim();
            pasajerosDet.push(paxActual);
        }
    });

    return pasajerosDet;
}
async function existeRuta(slc) {

    let origen = $(slc).find("select[name^='rt-orig']").val(); // Buscar dentro de 'slc' el select con nombre que comienza con 'rt-origen'
    let destino = $(slc).find("select[name^='rt-dest']").val(); // Buscar dentro de 'slc' el select con nombre que comienza con 'rt-destino'
    let cliente = $('#cliente_id').val();
    let broker = $('#broker_id').val();
    let aeronave = $('#aeronave_id').val();

    if (!origen || !destino || !aeronave) return;
    if (!cliente && !broker) return;

    try {

        const datos = new FormData();
        datos.append('origen', origen);
        datos.append('destino', destino);
        datos.append('cliente_id', cliente);
        datos.append('broker_id', broker);
        datos.append('aeronave_id', aeronave);

        const respuesta = await fetch('../valida/ruta', {
            method: 'POST',
            body: datos
        });

        const data = await respuesta.json();
        if (data.exito == '0') {
            // Vaciar y restablecer los options de los select dentro del elemento 'slc'
            $(slc).find("select[name^='rt-orig'] option").val('');
            $(slc).find("select[name^='rt-orig'] option").text('Origen');
            $(slc).find("select[name^='rt-dest'] option").val('');
            $(slc).find("select[name^='rt-dest'] option").text('Destino');

            SwalToast('warning', data.alertas.error[0], 2500);
        }

    } catch (error) {
        console.error(error);
        SwalLoad('error', 'Error en la Conexión', 'Comunicate con el Administrador', false);
    }
}
async function traerDetalle() {

    let ctz = $("#cotizar_id").val();
    let detalleRutas = await obtnerVuelosId(ctz);

    let nuevosDatos = detalleRutas.map(cot => {
        let baseObjeto = {
            cot_det_id: cot.cot_det_id,
            categoria: { categoria_id: cot.categoria_id, nombre: cot.nombreCat },
            fecha_salida: cot.fecha_salida,
            pasajeros: cot.pasajeros,
            tipo_vuelo: cot.tipo_vuelo,
            hora_salida: cot.hora_salida,
            concepto: cot.concepto,
            cantidad: cot.cantidad,
            tarifa: cot.tarifa,
            rel_ruta: cot.rel_ruta,
            relaciones_id: cot.relacion_id,
            line_id: cot.line_id,
            subtotal: cot.subtotal
        }

        // Agregar origen y destino solo si categoria es 1
        if (cot.categoria_id == 1) {
            baseObjeto.origen = { 'aeropuerto_id': cot.origenId, 'municipio': cot.origMun };
            baseObjeto.destino = { 'aeropuerto_id': cot.destinoId, 'municipio': cot.destMun };
        }

        return baseObjeto;
    });

    if (nuevosDatos.length < 9) {
        const numObjetosVacios = 8;
        const arreglo2 = Array(numObjetosVacios - nuevosDatos.length).fill({});
        const arregloCombinado = nuevosDatos.concat(arreglo2);
        const nuevosDatosClonados = arregloCombinado.map(obj => ({ ...obj }));
        gridApi.setGridOption('rowData', nuevosDatosClonados);
    } else {
        gridApi.setGridOption('rowData', nuevosDatos);
    }

    const aeronave = $('#aeronave_id').val();
    let rowData = [];
    gridApi.forEachNode(node => {
        rowData.push(node.data); // Aquí obtienes los datos de cada fila
    });

    // for (const data of rowData) {
    //     if (data.cot_det_id) {
    //         let origenVal = data['origen']['aeropuerto_id'];
    //         let destinoVal = data['destino']['aeropuerto_id'];

    //         let valida = await validaRutaTarifa(origenVal, destinoVal);
    //         let valAterrizaje = await obtenerTasaAterrizaje(destinoVal, aeronave);

    //         if (valida.exito == '0') {
    //             SwalToast('warning', valida.alertas.error[0], 2500);
    //         } else {
    //             if (valida.ruta.tipo_vuelo == 'N') {
    //                 data.costo = valida.tarifa.costo_mx;
    //             } else if (valida.ruta.tipo_vuelo == 'I') {
    //                 data.costo = valida.tarifa.costo_usd;
    //             }

    //             // IMPORTANTE console.log('Quite tipo_vuelo');
    //             // data.tipo_vuelo = valida.ruta.tipo_vuelo;
    //             $('#costo_id').val(valida.tarifa.costo_id);
    //         }

    //         if (valAterrizaje.exito == '1') {
    //             data.tarifa_aterrizaje = valAterrizaje.aterrizaje.tarifa_aterrizaje;
    //             data.tarifa_ser_terrestre = valAterrizaje.aterrizaje.tarifa_ser_terrestre;
    //             data.tarifa_ser_auxiliares = valAterrizaje.aterrizaje.tarifa_ser_auxiliares;
    //             data.total_costos = valAterrizaje.aterrizaje.total_costos;
    //             $('#tasa_aterrizaje_id').val(valAterrizaje.aterrizaje.tasa_aterrizaje_id);
    //         } else {
    //             SwalToast('warning', 'No existe Tasa de Aterrizaje', 2500);
    //         }

    //         // actTotalesLine(data);
    //         actTotales();
    //     }
    // }

    actTotales();


    let updatedRows = rowData.filter(data => data.costo !== undefined);

    if (updatedRows.length > 0) {
        gridApi.applyTransaction({ update: updatedRows });
    }

    //  Aplica los cambios a la cuadrícula
    gridApi.applyTransaction({ update: rowData });

}
async function obtenerCotizacionPDF() {
    try {

        const datos = new FormData();
        const fecha_cot = $('#fecha-cot').val();
        const folio = $('#folio').val();
        const aeronave_id = $('#aeronave_id').val();
        if ($('#slctOpcion').val() == 1) {
            const cliente_id = $('#cliente_id').val();
            const clienteName = $('#cliente_id option').text();

            datos.append('cliente_id', cliente_id);
            datos.append('clienteName', clienteName);
        } else if ($('#slctOpcion').val() == 2) {
            const broker_id = $('#broker_id').val();
            const brokerName = $('#broker_id option').text();
            datos.append('broker_id', broker_id);
            datos.append('brokerName', brokerName);
        }
        const condiciones = 'Contado';
        const subtotal = $('#subtotal').val();
        const ivaNac = $('#ivaNac').val();
        const ivaInt = $('#ivaInt').val();
        const total = $('#total').val();
        const cant_pernocta = $('#cant_pernocta').val();
        const tot_pernocta = $('#tot_pernocta').val();
        const cant_hrs = $('#cant_hrs').val();
        const tot_hrs = $('#tot_hrs').val();

        // const detalles = await validarGrid();
        const detalles = await validarGridPDF();

        if (detalles.length > 0) {
            detalles.forEach(node => {
                // let data = { ...node.data }; // Crear una copia del objeto para no modificar el original
                if (node.categoria && node.categoria != 'Ruta') {
                    delete node.fecha_salida;
                }
            });
        }

        datos.append('fecha_cot', fecha_cot);
        datos.append('folio', folio);
        datos.append('aeronave_id', aeronave_id);
        datos.append('condiciones', condiciones);
        datos.append('subtotal', subtotal);
        datos.append('ivaNac', ivaNac);
        datos.append('ivaInt', ivaInt);
        datos.append('total', total);
        datos.append('cant_pernocta', cant_pernocta);
        datos.append('tot_pernocta', tot_pernocta);
        datos.append('cant_hrs', cant_hrs);
        datos.append('tot_hrs', tot_hrs);
        datos.append('detalles', JSON.stringify(detalles));

        const respuesta = await fetch('../obtener/pdf', {
            method: 'POST',
            body: datos
        });
        const data = await respuesta.json();

        if (data.urlArchivo) {
            window.open(data.urlArchivo, '_blank');
        } else {
            console.error('No se pudo obtener la URL del archivo PDF.');
        }

    } catch (error) {
        console.error(error);
        SwalToast('warning', 'Error al obtener los usuarios', 2500);
    }
}
async function crearCotizacion() {

    try {
        const datos = new FormData();

        const aeronave_id = $('#aeronave_id').val();
        const fechaCot = $('#fecha-cot').val();
        const estatus = $('#estatus').val();
        const comentarios = $('#rt-comment').val();
        if ($('#slctOpcion').val() == 1) {
            const cliente_id = $('#cliente_id').val();
            datos.append('cliente_id', cliente_id);
        } else if ($('#slctOpcion').val() == 2) {
            const broker_id = $('#broker_id').val();
            datos.append('broker_id', broker_id);
        }

        let detalleRutas = await obtenerRutas();

        if (detalleRutas) {

            datos.append('aeronave_id', aeronave_id);
            datos.append('fecha_creacion', fechaCot);
            datos.append('estatus', estatus);
            datos.append('comentarios', comentarios);
            datos.append('tipo_de_viaje', currentStep);
            datos.append('detalleRutas', JSON.stringify(detalleRutas));

            const respuesta = await fetch('../crear/SolCotizacion', {
                method: 'POST',
                body: datos
            });

            const data = await respuesta.json();
            console.log(data);

            if (data.exito == 1) {
                // Registro Creado Exitosamente
                SwalLoad('success', 'Éxito', 'Registro Creado Correctamente', false);
                setTimeout(() => {
                    swal.close();
                    resetForm();
                    obtenerCotizaciones();
                }, 1500);

            }
            else if (data.exito == 0) {
                SwalLoad('error', 'Error en la Transacción', data.errorSMS, true);
            }

            if (data.alertas) {
                SwalToast('warning', data.alertas.error, 2500);
            }

        }
    } catch (error) {
        console.error(error);
        SwalLoad('error', 'Error en la Conexión', 'Comunicate con el Administrador', false);
    }
}
async function actualizarCotizacion() {

    try {
        const datos = new FormData();
        const cotizar_id = $('#cotizar_id').val();
        const folio = $('#folio').val();
        const aeronave_id = $('#aeronave_id').val();
        const fechaCot = $('#fecha-cot').val();
        const estatus = $('#estatus').val();
        const tipo_cambio = $('#tipo_cambio').val();
        let comentarios = '';

        if ($('#slctOpcion').val() == 1) {
            const cliente_id = $('#cliente_id').val();
            datos.append('cliente_id', cliente_id);
        } else if ($('#slctOpcion').val() == 2) {
            const broker_id = $('#broker_id').val();
            datos.append('broker_id', broker_id);
        }
        let detalleRutas = '';
        if (estatus == 'PND') {
            detalleRutas = await obtenerRutas();
            datos.append('detalleRutas', JSON.stringify(detalleRutas));
            comentarios = $('#rt-comment').val();
        } else {
            comentarios = $('#cot-comment').val();
            detalleRutas = await validarGrid();
        }
        let pasajerosDet = await validarPasajeros();
        datos.append('pasajerosDet', JSON.stringify(pasajerosDet));

        // Agregar los archivos al FormData
        pasajerosDet.forEach((pasajero, index) => {
            if (pasajero && pasajero.nombre && pasajero.nombre_ruta) {
                let prefijo;
                if (pasajero.pasajero_id) {
                    prefijo = pasajero.pasajero_id;
                    datos.append(`archivo_${prefijo}`, pasajero.nombre_ruta);
                } else {
                    // Obtener la primera letra de cada palabra en el nombre
                    prefijo = pasajero.nombre.split(' ').map(word => word.charAt(0)).join('');
                    datos.append(`archivo_${prefijo}`, pasajero.nombre_ruta);
                }
            }
        });

        if (detalleRutas) {
            datos.append('cotizar_id', cotizar_id);
            datos.append('folio_cotizar', folio);
            datos.append('aeronave_id', aeronave_id);
            datos.append('fecha_creacion', fechaCot);
            datos.append('estatus', estatus);
            datos.append('comentarios', comentarios);
            datos.append('tipo_de_viaje', currentStep);
            datos.append('tipo_cambio_id', tipo_cambio);


            const respuesta = await fetch('../actualizar/SolCotizacion', {
                method: 'POST',
                body: datos
            });

            const data = await respuesta.json();
            console.log(data);

            if (data.exito == 1) {
                SwalLoad('success', 'Éxito', 'Registro Actualizado Correctamente', false);
                setTimeout(() => {
                    swal.close();
                    resetForm();
                    obtenerCotizaciones();
                }, 1500);
            } else if (data.exito == 0) {
                SwalLoad('error', 'Error en la Transacción', data.errorSMS, true);
                return
            }

            if (data.alertas) {
                SwalToast('warning', data.alertas.error, 2500);
                return
            }

        }

    } catch (error) {
        console.error(error);
        SwalLoad('error', 'Error en la Conexión', 'Comunicate con el Administrador', false);
    }
}
async function actualizarRutaPax() {

    try {
        let relRutaPax = await validarRutaPax();
        if (relRutaPax == '') return
        const cotizar_id = $('#cotizar_id').val();
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

        const datos = new FormData();
        datos.append('id_cot', cotizar_id);
        datos.append('csrf_token', csrfToken);
        datos.append('relRutaPax', JSON.stringify(relRutaPax));

        const respuesta = await fetch('../actualizar/relacionRutaPax', {
            method: 'POST',
            body: datos,
            headers: {
                'X-CSRF-Token': csrfToken
            }
        });

        const data = await respuesta.json();
        console.log(data);

        $('#formRelRuta').empty();


    } catch (error) {
        console.error(error);
        SwalLoad('error', 'Error en la Conexión', 'Comunicate con el Administrador', false);
    }
}
async function eliminarRuta(idRuta, cot_det_id) {

    try {
        const datos = new FormData();
        datos.append('cotizar_id', idRuta);
        datos.append('cot_det_id', cot_det_id);

        const respuesta = await fetch('../eliminar/ruta', {
            method: 'POST',
            body: datos
        });

        const data = await respuesta.json();

        if (data.exito == 1) {
            // Registro Creado Exitosamente
            SwalToast('success', 'Registro Eliminado Correctamente', 2500);
            maxId = maxId - 1;
        }

        if (data.alertas) {
            SwalToast('warning', data.alertas.error, 2500);
        }

    } catch (error) {
        console.error(error);
        SwalLoad('error', 'Error en la Conexión', 'Comunicate con el Administrador', false);
    }

}
async function generarServicio() {

    try {
        const cotizar_id = $('#cotizar_id').val();

        const datos = new FormData();
        datos.append('cotizar_id', cotizar_id);

        const respuesta = await fetch('../generar/servicio', {
            method: 'POST',
            body: datos
        });

        const data = await respuesta.json();
        // console.log(data);

        if (data.exito == 1) {
            SwalLoad('success', 'Éxito', 'Servicio Creado Correctamente', false);
            setTimeout(() => {
                swal.close();
                resetForm();
                obtenerCotizaciones();
            }, 1500);
        } else if (data.exito == 0) {
            SwalLoad('error', 'Error en la Transacción', data.errorSMS, true);
        }

        if (data.alertas) {
            SwalToast('warning', data.alertas.error, 2500);
            return
        }

    } catch (error) {
        console.error(error);
        SwalLoad('error', 'Error en la Conexión', 'Comunicate con el Administrador', false);
    }
}
async function obtenerCodigosIATA(origenVal, destinoVal) {
    try {
        const datos = new FormData();
        datos.append('origen', origenVal);
        datos.append('destino', destinoVal);

        const respuesta = await fetch('../obtener/codigos', {
            method: 'POST',
            body: datos
        });
        const data = await respuesta.json();

        return data;
    } catch (error) {
        console.error(error);
        SwalLoad('error', 'Ocurrio Un Error', 'Conección Perdida a BD.', false);
    }
}
async function eliminarPasajero(cotizar_id, pasajero_id) {

    try {
        const datos = new FormData();
        datos.append('cotizar_id', cotizar_id);
        datos.append('pasajero_id', pasajero_id);

        const respuesta = await fetch('../eliminar/pasajero', {
            method: 'POST',
            body: datos
        });

        const data = await respuesta.json();

        if (data.exito == 1) {
            SwalToast('success', 'Registro Eliminado Correctamente', 2500);
        }

        if (data.alertas) {
            SwalToast('warning', data.alertas.error, 2500);
            return;
        }

    } catch (error) {
        console.error(error);
        SwalLoad('error', 'Error en la Conexión', 'Comunicate con el Administrador', false);
    }

}
async function validarGrid() {
    let detalles = [];
    try {
        const nodes = [];
        gridApi.forEachNode(node => nodes.push(node));

        for (const node of nodes) {
            // Obtener los datos de la fila
            const relacion_id = node.data.relaciones_id;
            const categoria = node.data.categoria;
            const concepto = node.data.concepto;
            const fecha = node.data.fecha_salida;
            const tHoras = node.data.cantidad;

            const formattedFecha = formatearFechaYear(fecha);
            node.data.fecha_salida = formattedFecha;
            node.data.categoria_nombre = '';

            // Copiar la fila y modificar el valor de origen
            // Verificar si la fila tiene relacion_id
            if (relacion_id) {

                // Copiar la fila y modificar el valor de origen
                let filaModificada = { ...node.data }; // Crear una copia de la fila

                // Agregar categoria_nombre si categoria está definida
                if (categoria) {
                    filaModificada.categoria_nombre = filaModificada.categoria.nombre;
                }

                // Ajustar 'Categoria' para contener solo el ID
                if (filaModificada.categoria && filaModificada.categoria.categoria_id !== undefined) {
                    filaModificada.categoria = filaModificada.categoria.categoria_id;
                }

                if (categoria && categoria.nombre == 'Ruta') {
                    // Validar que tengan fecha obligatoriamente
                    if (fecha == undefined) {
                        throw SwalToast('warning', 'Fecha Obligatoria', 2500);
                    }

                    if (tHoras == undefined) {
                        throw SwalToast('warning', 'Horas Obligatorias', 2500);
                    }

                    // Formatear la fecha a 'año-mes-día' (YYYY-MM-DD)
                    // const formattedFecha = new Date(fecha).toISOString().split('T')[0];
                    const formattedFecha = formatearFechaYear(fecha);

                    // Asignar el valor de 'aeropuerto_id' de 'origen' a 'origen'
                    if (filaModificada.origen && filaModificada.origen.aeropuerto_id !== undefined) {
                        filaModificada.origen = filaModificada.origen.aeropuerto_id;
                    }

                    // // Ajustar 'destino' para contener solo 'aeropuerto_id'
                    if (filaModificada.destino && filaModificada.destino.aeropuerto_id !== undefined) {
                        filaModificada.destino = filaModificada.destino.aeropuerto_id;
                    }

                    // Ajustar la Hora
                    const horaFormat = await formatoHora(filaModificada.hora_salida);


                    filaModificada.hora_salida = horaFormat;
                    filaModificada.fecha_salida = formattedFecha;
                }

                // Agregar la fila modificada al arreglo detalles
                detalles.push(filaModificada);
            } else if (categoria && categoria.nombre == 'Pernocta') {
                if (concepto == undefined) {
                    throw SwalToast('warning', 'Concepto Obligatorio para Pernocta', 2500);
                }
                filaModificada = { ...node.data }; // Crear una copia de la fila

                // Ajustar 'Categoria' para contener solo el ID
                if (filaModificada.categoria && filaModificada.categoria.categoria_id !== undefined) {
                    filaModificada.categoria = filaModificada.categoria.categoria_id;
                    filaModificada.categoria_nombre = categoria.nombre;
                }
                detalles.push(filaModificada);
            }
        }

    } catch (error) {
        return detalles = '';
    }

    return detalles;
}
async function validarGridPDF() {

    let rowData = [];
    gridApi.forEachNode(node => {
        if (node.data.categoria) {
            let data = { ...node.data }; // Copia del objeto original
            data.categoria = `${data.categoria.nombre}`
            rowData.push(data);
        }
    });

    let categorias = await obtenerCategorias();

    // Orden específico para los valores de categoria.nombre
    const ordenCategoria = categorias.map(categoria => categoria.nombre);


    // Función de comparación para múltiples campos
    function compararVuelos(a, b) {
        // Comparar por fecha_salida
        const fechaA = new Date(a.fecha_salida);
        const fechaB = new Date(b.fecha_salida);

        if (fechaA - fechaB != 0) return fechaA - fechaB;

        // Comparar por categoria.nombre según el orden especificado
        const indexA = ordenCategoria.indexOf(a.categoria);
        const indexB = ordenCategoria.indexOf(b.categoria);
        // const indexA = ordenCategoria.indexOf(a.categoria.nombre);
        // const indexB = ordenCategoria.indexOf(b.categoria.nombre);

        if (indexA - indexB !== 0) return indexA - indexB;

        // Agregar más comparaciones si es necesario
        // Comparar por concepto
        if (a.concepto.localeCompare(b.concepto) !== 0) return a.concepto.localeCompare(b.concepto);

        // Comparar por destino.municipio
        if (a.destino.municipio.localeCompare(b.destino.municipio) !== 0) return a.destino.municipio.localeCompare(b.destino.municipio);

        // Comparar por origen.municipio
        if (a.origen.municipio.localeCompare(b.origen.municipio) !== 0) return a.origen.municipio.localeCompare(b.origen.municipio);

        // Comparar por tarifa
        return parseFloat(a.tarifa) - parseFloat(b.tarifa);
    }

    // Ordenar el arreglo usando la función de comparación
    rowData.sort(compararVuelos);
    return rowData
}
