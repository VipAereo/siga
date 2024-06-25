let gridOptions;
let PASAJEROS = '';


// Utilizando el Principio de Modularidad
$(function () {
    asignarEventos();
    inicializarPagina();
    configurarBotones();
});
function asignarEventos() {
    $(".contenedor-altas").hide();
    $(".costeo-relacion").hide();
    $(".btn-pass").hide();
    $("#myGrid2").addClass('event-none');

    // Ocultar Listados
    $('.pilSearch').hide();
    $('.aeroSearch').hide();
    $('.emprSearch').hide();
    $('.cliSearch').hide();
    $('.paxSearch').hide();

    aplicarMascaraCantidad('subtotal', 'ivaNac', 'ivaInt', 'total', 'cant_pernocta', 'tot_pernocta', 'cant_hrs', 'tot_hrs');

    // Esc Cerrar
    document.addEventListener("keydown", e => {
        if (e.key === 'Escape') {
            // Limpiar Ruta
            resetForm();
        }
    });

    // Lista Pilotos
    document.getElementById("piloto_id").addEventListener("mousedown", async function (event) {
        event.preventDefault();
        $('.pilSearch').show();
        $('.inPilSrch').focus();
        let data = await obtenerPilotos();
        const listSearch = await mostrarListaSearch(data, '.pilSearch', 'piloto_id', 'nombre_empleado');
        if (listSearch) activarRutas();
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

}
function configurarBotones() {

    $("#btnCancel").click(e => {
        resetForm();
    });

    $("#btnPasajero").click(e => {
        nuevoPax();
    });

    $("#btnGuardar").click(async e => {
        const validar = validateInputs($('#formAltas'));
        const estatus = $("#estatus").val();
        if ((validar) && (estatus == 'SVC') && ($("#servicio_id").val())) {
            let formPasajeros = document.getElementById('formPasajeros');
            let pasajerosElements = formPasajeros.querySelectorAll('.cont-pasajero [data-pax]');
            if (pasajerosElements) {
                await actualizarCotizacion();
                await actualizarRutaPax();
            } else {
                await actualizarCotizacion();
            }
        }
    });

    $("#actTipoCambio").click(async e => {
        let tipo = await obtenerTipoCambio();
        if (tipo) SwalToast('success', 'Tipo de Cambio Actualizado.', 2500);
    });
}

// GRID
function inicializarPagina() {

    let columnDefs = [
        {
            headerName: 'id',
            field: 'servicio_id',
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
            width: 150,
            headerClass: 'txt-center',
            cellClass: 'custom-action-cell', // Agregar la clase CSS 'custom-action-cell' a todas las celdas en esta columna
            filter: false,
            cellRenderer: function (params) {
                const editButton = document.createElement('I');
                editButton.className = "fa-regular fa-pen-to-square btn btn-editar";
                editButton.title = 'Ver o Editar';

                // Datos a Editar
                editButton.addEventListener('click', async function (e) {

                    console.log(params.data);
                    if (Object.keys(params.data).length == 0) return;

                    $('#aeronave_id').prop('disabled', true);
                    $('#slctOpcion').prop('disabled', true);
                    $('#cliente_id').prop('disabled', true);
                    $('#broker_id').prop('disabled', true);

                    // Establecer Datos
                    $('#servicio_id').val(params.data.servicio_id);
                    $('#cotizar_id').val(params.data.cotizar_id);
                    $('#folio').val(params.data.folio_cotizar);
                    $('#fecha-cot').val(formatearFecha(params.data.fecha_creacion));
                    $('#rt-comment').val(params.data.comentarios);
                    $('#estatus').val(params.data.estatus);
                    $('#aeronave_id option').val(params.data.aeronave_id);
                    $('#aeronave_id option').text(params.data.modeloAeronave);

                    // Agregar 1% arriba
                    let tipoCambio = params.data.tipo_cambio;
                    let porciento = tipoCambio * 0.01;
                    let cambioNuevo = parseFloat(tipoCambio) + parseFloat(porciento);
                    cambioNuevo.toFixed();

                    $('#tipo_cambio option').val(params.data.tipo_cambio_id);
                    $('#tipo_cambio option').text(Number(cambioNuevo).toFixed(2));

                    $('#piloto_id option').val(params.data.piloto_id);
                    $('#piloto_id option').text(params.data.nombrePiloto);

                    await mostrarContenedorAltas();

                    if (params.data.cliente_id) {
                        $('#slctOpcion').val(1);
                        mostrarClienteEmpresa();
                        $("#cliente_id option").val(params.data.cliente_id);
                        $("#cliente_id option").text(params.data.nombreCli);
                    } else if (params.data.broker_id) {
                        $('#slctOpcion').val(2);
                        mostrarClienteEmpresa();
                        $("#broker_id option").val(params.data.broker_id);
                        $("#broker_id option").text(params.data.nombreBrok);
                        $('#rt-responsable').val(params.data.contacto_principal);
                    }

                    let detalleRutas = await obtenerServDet(params.data.servicio_id);

                    let nuevosDatos = detalleRutas.map(cot => {

                        let baseObjeto = {
                            servicio_detalle_id: cot.servicio_detalle_id,
                            fecha_salida: cot.fecha_salida,
                            hora_salida: cot.hora_salida,
                            categoria: { categoria_id: cot.categoria_id, nombre: cot.nombreCat },
                            concepto: cot.concepto,
                            pasajeros: cot.pasajeros,
                            tipo_vuelo: cot.tipo_vuelo,
                            cantidad: cot.cantidad,
                            percost: cot.percost,
                            tarifa: cot.tarifa,
                            subtotal: cot.subtotal,
                            rel_ruta: cot.rel_ruta,
                            relaciones_id: cot.relacion_id,
                            line_id: cot.line_id,
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

                    obtenerTarifaCosto();
                    botonBoardingPass();
                    activarRutas();
                    actTotales();

                    // CARGAR PASAJEROS
                    let datosPax = await obtenerPax(params.data.cotizar_id);
                    detallePax = datosPax.pasajeros;
                    let paxDoc = datosPax.paxDoc;

                    for (let i = 0; i < detallePax.length; i++) {
                        nuevoPax();
                    }


                    // Agregar datos a Seccion Pax
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

                    await ordenarPorCategoria();

                    $(".costeo-relacion").show();

                });

                const actionContainer = document.createElement('div');
                actionContainer.classList = "btn-cont centrado";
                actionContainer.appendChild(editButton);
                $('.pasajeros').prop('disabled', false);

                return actionContainer;
            }
        }
    ];

    let data = '';
    iniciarTabla(data, columnDefs, '#myGrid');
    obtenerServicios();
}
async function configTablaCrear() {
    mostrarClienteEmpresa();

    let aeropuerto = await obtenerAeropuertos();
    let categoria = await obtenerCategorias();
    let producto = await obtenerProductos();

    let columnDefs = [
        {
            headerName: 'Id',
            field: 'servicio_detalle_id',
            width: 60
        },
        {
            headerName: "",
            headerGroupComponent: CustomHeaderGroup,

            children: [
                {
                    headerName: 'Fecha',
                    field: "fecha_salida",
                    width: 100,
                    cellEditor: 'agDateCellEditor',
                    editable: true,
                    valueFormatter: function (params) {
                        let fecha = params.value;
                        if (fecha) {
                            return formatearFecha(fecha);
                        }
                        return null;
                    },
                    cellClassRules: {
                        'event-none': params => {
                            // Verificar si servicio_detalle_id tiene un valor
                            const cotDetIdValue = params.data.servicio_detalle_id;
                            // return cotDetIdValue !== undefined && cotDetIdValue !== null && cotDetIdValue !== '';
                        }
                    },

                },
                {
                    headerName: 'Hora',
                    field: "hora_salida",
                    width: 120,
                    editable: true,
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
            ],
        },
        {
            headerName: 'Cat',
            field: 'categoria',
            width: 80,
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
            cellClassRules: {
                'event-none': params => {
                    // Verificar si servicio_detalle_id tiene un valor
                    const cotDetIdValue = params.data.servicio_detalle_id;
                    return cotDetIdValue !== undefined && cotDetIdValue !== null && cotDetIdValue !== '';
                }
            },
        },
        {
            headerName: 'Concepto',
            field: 'concepto',
            width: 160,
            editable: false,
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
                    // Verificar si servicio_detalle_id tiene un valor
                    const cotDetIdValue = params.data.servicio_detalle_id;
                    return cotDetIdValue !== undefined && cotDetIdValue !== null && cotDetIdValue !== '';
                }
            },
        },
        {
            headerName: 'Pax',
            field: 'pasajeros',
            width: 60,
            editable: true,
            cellEditor: 'agNumberCellEditor',
            valueParser: function (params) {
                // Convertir la entrada en un número entero
                return parseFloat(params.newValue) || null;
            },
            valueFormatter: function (params) {
                // Formatear el número como entero
                if (params.value !== null && params.value !== undefined) {
                    return Math.round(params.value);
                }
                return null;
            }
        },
        {
            headerName: 'Tipo',
            field: 'tipo_vuelo',
            width: 80,
            cellEditor: 'agSelectCellEditor',
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
            editable: false,
        },
        {
            headerName: "",
            headerGroupComponent: CustomHeaderGroup,
            children: [
                {
                    headerName: 'Cant',
                    field: 'cantidad',
                    width: 80,
                    cellEditor: 'agNumberCellEditor',
                    editable: true,
                    valueParser: function (params) {
                        // Convertir la entrada en un número entero
                        return parseFloat(params.newValue) || null;
                    },
                    valueFormatter: function (params) {
                        // Formatear el número como entero
                        if (typeof params.value === 'number' && !isNaN(params.value)) {
                            // Formatear el número como un decimal con un dígito después del punto decimal
                            return params.value.toFixed(1);
                        }
                        return null;
                    }
                },
                {
                    headerName: 'Pernocta Costo',
                    field: 'percost',
                    width: 80,
                    cellEditor: 'agNumberCellEditor',
                    editable: true,
                    columnGroupShow: "open",
                    valueParser: function (params) {
                        if (params.newValue == '0') {
                            return 0.5
                        }
                        // Convertir la entrada en un número entero
                        return parseFloat(params.newValue) || null;
                    },
                    valueFormatter: function (params) {
                        // Formatear el número como entero
                        if (typeof params.value === 'number' && !isNaN(params.value)) {
                            // Formatear el número como un decimal con un dígito después del punto decimal
                            return params.value.toFixed(1);
                        }
                        return null;
                    }
                },
            ]
        },
        {
            headerName: 'Tarifa',
            field: 'tarifa',
            width: 100,
            editable: true,
            cellEditor: 'agNumberCellEditor',
            valueFormatter: function (params) {
                if (params.value) {
                    // Formatea el número con comas como separadores de miles y dos decimales
                    return Number(params.value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
            },
            valueSetter: function (params) {
                // Asegura que el valor se guarda como una cadena
                if (params.newValue) {
                    params.data.tarifa = params.newValue.toString();
                    return true;
                } else {
                    return false;
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
            },
            valueSetter: function (params) {
                // Asegura que el valor se guarda como una cadena
                if (params.newValue) {
                    params.data.subtotal = params.newValue.toString();
                    return true;
                } else {
                    return false;
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
        {
            headerName: 'Acción',
            width: 90,
            headerClass: 'txt-center',
            cellClass: 'custom-action-cell', // Agregar la clase CSS 'custom-action-cell' a todas las celdas en esta columna
            filter: false,
            cellRenderer: function (params) {
                // Que el estatus sea Cotizado 
                const estatus = $("#estatus").val();
                if (estatus == 'SVC' && (params.data.categoria && params.data.categoria.nombre)) {

                    const editButton = document.createElement('I');
                    editButton.className = "fa-regular fa-trash-can btn btn-eliminar";
                    editButton.title = 'Eliminar';

                    editButton.addEventListener('click', async function () {

                        if (Object.keys(params.data).length == 0) return;

                        const lineId = params.data.servicio_detalle_id
                        const rowNode = params.node;

                        if (lineId) {
                            await validarDetEliminar(lineId, rowNode);
                            actTotales();
                            actualizarCotizacion();
                        } else {
                            limpiarCelda(rowNode);
                            actTotales();
                        }

                    });

                    const actionContainer = document.createElement('div');
                    actionContainer.classList = "btn-cont centrado";
                    actionContainer.appendChild(editButton);

                    return actionContainer;
                }


            }
        }
    ];

    let data = '';
    iniciarTabla(data, columnDefs, '#myGrid2');

    // Establece los asientos para la aronave
    establecerAsientos();

    // OnChange
    gridApi.addEventListener('cellValueChanged', async function (e) {
        const columnName = e.column.colId;
        const rowData = e.node.data;
        const rowIndex = e.rowIndex;

        let origenVal = rowData.origen ? rowData.origen.aeropuerto_id : '';
        let destinoVal = rowData.destino ? rowData.destino.aeropuerto_id : '';

        if (columnName == 'origen' || columnName == 'destino') {

            if (origenVal && destinoVal) {
                let valida = await validaRutaTarifa(origenVal, destinoVal);
                if (valida.exito == '0') {
                    SwalToast('warning', valida.alertas.error[0], 2500);
                    let rowNode = gridApi.getRowNode(rowIndex);
                    if (rowNode && rowNode.data) {
                        Object.keys(rowNode.data).forEach(key => {
                            rowNode.setDataValue(key, null);
                        });
                    }
                } else {
                    $('#costo_id').val(valida.tarifa.costo_id);
                    if (valida.ruta.tipo_vuelo == 'N') {
                        rowData.tarifa = valida.tarifa.costo_mx;
                    } else if (valida.ruta.tipo_vuelo == 'I') {
                        rowData.tarifa = valida.tarifa.costo_usd;
                    }
                    rowData.tipo_vuelo = valida.ruta.tipo_vuelo;
                    rowData.relaciones_id = valida.ruta.ruta_id;
                    rowData.rel_ruta = valida.ruta.ruta_id;
                    rowData.hora_salida = '00:00';
                    rowData.cantidad = '1';

                    let categoria = rowData.categoria;
                    let cod = '';

                    if (categoria.nombre == 'Ruta') {
                        cod = await obtenerCodigosIATA(origenVal, destinoVal);
                        rowData.concepto = cod;
                    }

                    let newLineID = await consecutivoLineID();
                    rowData.line_id = newLineID;

                    //     gridApi.applyTransaction({ update: [rowData] });
                    await generarPernoctas();
                    await generarAterrizajes();
                    await generarTUA();
                    await ordenarPorCategoria();
                    // gridApi.applyTransaction({ update: [rowData] });
                }
            }
        }


        if (columnName == 'fecha_salida') {
            if (origenVal && destinoVal) {
                await generarPernoctas();
                await ordenarPorCategoria();
            }
        }

        // Calcular PAX
        if (columnName == 'pasajeros') {
            const value = e.newValue;
            const oldValue = e.oldValue; // Guardar el valor anterior

            if (value > PASAJEROS) {
                rowData.pasajeros = PASAJEROS;
                gridApi.applyTransaction({ update: [rowData] });
            }

            if (rowData.origen && rowData.destino) {
                // Verificar si hay suficientes TUAS para el número de pasajeros
                const rutasData = [];
                gridApi.forEachNode(node => {
                    const rowData = node.data;
                    if (rowData.categoria && rowData.categoria.nombre === 'Ruta' && rowData.origen && rowData.destino) {
                        rutasData.push(rowData);
                    }
                });

                // if (rutasData.length > 0) {
                //     const aeropuertos = await obtenerAeropuertos();
                //     for (let i = 0; i < rutasData.length; i++) {
                //         const ruta = rutasData[i];
                //         const origen = ruta.origen.aeropuerto_id;
                //         // const pax = ruta.pasajeros;

                //         // Contar TUAS existentes para este origen
                //         let existingTuasCount = 0;
                //         gridApi.forEachNode(node => {
                //             if (node.data.categoria && node.data.categoria.nombre === 'Tua' && node.data.relaciones_id === origen) {
                //                 existingTuasCount++;
                //             }
                //         });

                //         // Verificar si hay suficientes TUAS para el número de pasajeros
                //         if (value <= existingTuasCount) {
                //             rowData.pasajeros = oldValue;
                //             gridApi.applyTransaction({ update: [rowData] });
                //             SwalToast('warning', 'El número de TUAS existentes es suficiente', 2500);
                //             return; // Detener la ejecución de la función
                //         }
                //     }
                // }

                // Si se supera la validación de los pasajeros, generar TUAS y ordenar por categoría
                await generarTUA();
                await ordenarPorCategoria();
            }
        }

        // Calcular totales
        if ((e.oldValue != e.newValue) && (rowData.categoria) && (rowData.percost || rowData.categoria || rowData.tarifa)) {
            actTotalesLine(rowData);
            actTotales();
        }

    });

    gridApi.addEventListener('cellDoubleClicked', async function (e) {
        const columnName = e.column.colId;
        const rowData = e.node.data;
        const rowIndex = e.rowIndex;
        const cellElement = e.event.target; // Elemento DOM de la celda clicada
        const contLista = '#filtro'; // DIV para las busquedas
        const contScroll = '.contenedor-altas'; // DIV donde obtendremos el Scroll

        // Al cambiar de categoria
        if (columnName == 'categoria') {
            const nuevacategoria = categoria.map(objeto => {
                return {
                    id: objeto.categoria_id,
                    nombre: objeto.nombre
                };
            });

            let grid = await mostrarListaGrid(cellElement, nuevacategoria, contLista, contScroll);
            let rowNode = gridApi.getRowNode(rowIndex);

            if (rowData.categoria) {
                limpiarCelda(rowNode);
            }
            rowNode = gridApi.getRowNode(rowIndex);
            const valor = { categoria_id: grid.id, nombre: grid.nombre };
            rowNode.setDataValue('categoria', valor);
            gridApi.redrawRows(); // Redibujar la fila para reflejar los cambios
        }

        // Mostrar concepto dependiendo de la ruta
        if (columnName == 'concepto' && rowData.categoria) {

            if (rowData.categoria.nombre == 'Producto') {

                const nuevoProducto = producto.map(objeto => {
                    return {
                        id: objeto.producto_id,
                        nombre: objeto.nombre
                    };
                });

                let grid = await mostrarListaGrid(cellElement, nuevoProducto, contLista, contScroll);

                let newLineID = await consecutivoLineID();

                const rowNode = gridApi.getRowNode(rowIndex);
                const prodFind = producto.find(item => item.producto_id === grid.id);
                rowNode.setDataValue('concepto', grid.nombre);
                rowNode.setDataValue('relaciones_id', grid.id);
                rowNode.setDataValue('tarifa', prodFind.precio);
                rowNode.setDataValue('cantidad', '1');
                rowNode.setDataValue('line_id', newLineID);

                gridApi.redrawRows(); // Redibujar la fila para reflejar los cambios
            }

            if (rowData.categoria.nombre == 'Aterrizaje') {

            }

            if (rowData.categoria.nombre == 'Pernocta') {

            }

            if (rowData.categoria.nombre == 'Ruta') {

            }

        }

        // seleccionar si la cat = Ruta
        if (columnName === 'origen' || columnName === 'destino') {
            const nuevoAeropuerto = aeropuerto.map(objeto => {
                return {
                    id: objeto.aeropuerto_id,
                    nombre: objeto.municipio,
                };
            });

            if (rowData.categoria && rowData.categoria.nombre == 'Ruta' && !(rowData && rowData.servicio_detalle_id)) {
                let grid = await mostrarListaGrid(cellElement, nuevoAeropuerto, contLista, contScroll);
                const rowNode = gridApi.getRowNode(rowIndex);
                const valor = { aeropuerto_id: grid.id, municipio: grid.nombre };

                if (columnName === 'origen') {
                    rowNode.setDataValue('origen', valor);
                } else {
                    rowNode.setDataValue('destino', valor);
                }

                gridApi.redrawRows(); // Redibujar la fila para reflejar los cambios
            }
        }

    });

}
function limpiarCelda(rowNode) {

    // Obtén todas las columnas del grid
    const allColumns = [];
    gridApi.forEachNode(node => {
        const rowData = node.data;
        allColumns.push(rowData);
    });

    // Crea un objeto vacío para almacenar los cambios
    let updatedData = {};

    // Itera sobre cada columna y establece el valor a null o ''
    allColumns.forEach(column => {
        const colId = column.colId;
        // updatedData[colId] = null; // o '' si prefieres
    });

    // Actualiza los datos de la fila
    rowNode.setData(updatedData);
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
            } else if (categoria == 'Producto') {
                subtotal = cantidad * tarifa;
            }

            // Actualizar el subtotal en el nodo de datos
            node.setDataValue('subtotal', subtotal);
        }
        // Refrescar las celdas para mostrar los nuevos subtotales
        gridApi.refreshCells({ force: true });
    });


    // const categoria = rowData.categoria.nombre;
    // const cantidad = parseFloat(rowData.cantidad || 0);
    // const tarifa = parseFloat(rowData.tarifa || 0);
    // const pernocta = parseFloat(rowData.percost || 0.5);
    // let subtotal = 0;

    // if (categoria == 'Ruta') {
    //     subtotal = cantidad * tarifa;
    //     rowData.subtotal = subtotal;
    // } else if (categoria == 'Pernocta') {
    //     subtotal = (cantidad * pernocta) * tarifa;
    //     rowData.subtotal = subtotal;
    // } else if (categoria == 'Aterrizaje') {
    //     subtotal = tarifa;
    //     rowData.subtotal = subtotal;
    // } else if (categoria == 'Producto') {
    //     subtotal = cantidad * tarifa;
    //     rowData.subtotal = subtotal;
    // }

    // gridApi.applyTransaction({ update: [rowData] });
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
async function generarPernoctas() {

    const rowDataToRemove = [];
    // Eliminar todas las pernoctas existentes, menos las que tengan id
    gridApi.forEachNode(node => {
        let cat = node.data.categoria;
        let idLine = node.data.servicio_detalle_id;
        if ((cat && node.data.categoria.nombre === 'Pernocta') && (!idLine)) {
            rowDataToRemove.push(node.data);
        }
    });

    if (rowDataToRemove.length > 0) {
        // Remover las filas identificadas como pernoctas
        gridApi.applyTransaction({ remove: rowDataToRemove });

        const allData = [];
        gridApi.forEachNode(node => {
            const rowData = node.data;
            allData.push(rowData);
        });
        gridApi.updateGridOptions({ rowData: allData });
    }

    // Agregar las pernoctas
    const allData = [];
    const pernoctasMap = {}; // Mapa para rastrear pernoctas por 'relaciones_id'

    // Recorremos todas las filas con la categoría 'Ruta' para calcular las pernoctas
    gridApi.forEachNode(node => {
        const rowData = node.data;
        if (rowData.categoria && rowData.categoria.nombre === 'Ruta' && rowData.origen && rowData.destino) {
            allData.push(rowData);
        } else if (rowData.categoria && rowData.categoria.nombre === 'Pernocta') {
            pernoctasMap[rowData.rel_ruta] = rowData;
        }
    });

    if (allData.length > 1) {
        const rowsToAdd = []; // Aquí almacenaremos las nuevas filas de pernocta

        let newLineID = await consecutivoLineID();

        for (let i = 0; i < allData.length - 1; i++) {
            // const fechaActual = new Date(allData[i].fecha_salida);
            const fechaActual = formatearFecha(allData[i].fecha_salida);
            const diaActual = obtenerDia(fechaActual);
            let conceptoActual = allData[i].concepto;
            conceptoActual = conceptoActual.substring(conceptoActual.lastIndexOf(' ') + 1);
            const tarifaActual = allData[i].tarifa;
            const relacionActual = allData[i].relaciones_id;
            const lineID = allData[i].line_id;

            const fechaSiguiente = formatearFecha(allData[i + 1].fecha_salida);
            const daysDifference = calcularDiferenciaDias(fechaActual, fechaSiguiente);

            if (daysDifference > 0) {
                if (pernoctasMap[lineID]) {
                    // Actualizar cantidad de 'daysDifference' en la pernocta existente
                    pernoctasMap[relacionActual].concepto = `${conceptoActual} - Día: ${diaActual}`;
                    pernoctasMap[relacionActual].cantidad = daysDifference;
                    pernoctasMap[relacionActual].subtotal = (daysDifference * 0.5) * tarifaActual;
                } else {

                    // Crear nueva fila Pernocta
                    const newRow = {
                        servicio_detalle_id: '',
                        fecha_salida: fechaActual,
                        hora_salida: '0',
                        categoria: { categoria_id: 2, nombre: 'Pernocta' },
                        concepto: `${conceptoActual} - Día: ${diaActual}`,
                        origen: '',
                        destino: '',
                        pasajeros: '',
                        tipo_vuelo: '',
                        cantidad: daysDifference,
                        tarifa: tarifaActual,
                        percost: '0.5',
                        subtotal: (daysDifference * 0.5) * tarifaActual,
                        // relaciones_id: relacionActual,
                        rel_ruta: lineID,
                        line_id: newLineID
                    };
                    newLineID++;
                    rowsToAdd.push(newRow);
                }
            }
        }

        // Agregar las nuevas filas al grid
        if (rowsToAdd.length > 0) {
            gridApi.applyTransaction({ add: rowsToAdd });
        }

        // Actualizar las filas existentes con los nuevos valores calculados
        const rowsToUpdate = Object.values(pernoctasMap).filter(row => row.cantidad !== undefined);
        if (rowsToUpdate.length > 0) {
            gridApi.applyTransaction({ update: rowsToUpdate });
        }

    }

}
async function generarAterrizajes() {

    // Eliminar todas las tasas de aterrizaje en el grid
    const rowDataToRemove = [];

    gridApi.forEachNode(node => {
        let cat = node.data.categoria;
        let idLine = node.data.servicio_detalle_id;
        if ((cat && node.data.categoria.nombre === 'Aterrizaje') && (!idLine)) {
            rowDataToRemove.push(node.data);
        }
    });

    if (rowDataToRemove.length > 0) {
        // Remover las filas indetificadas como Aterrizajes
        gridApi.applyTransaction({ remove: rowDataToRemove });

        const allData = [];
        gridApi.forEachNode(node => {
            const rowData = node.data;
            allData.push(rowData);
        });
        gridApi.updateGridOptions({ rowData: allData });
    }

    // Agregar las pernoctas
    const allData = [];
    const aterrizajesMap = {}; // Mapa para rastrear Aterrizajes por 'relaciones_id'

    // Recorremos todas las filas con la categoría 'Ruta' para calcular Aterrizajes
    gridApi.forEachNode(node => {
        const rowData = node.data;
        if (rowData.categoria && rowData.categoria.nombre === 'Ruta' && rowData.origen && rowData.destino) {
            allData.push(rowData);
        } else if (rowData.categoria && rowData.categoria.nombre === 'Aterrizaje') {
            aterrizajesMap[rowData.rel_ruta] = rowData;
        }
    });

    if (allData.length > 0) {
        const rowsToAdd = []; // Aquí almacenaremos las nuevas filas de Aterrizaje
        const aeronave = $('#aeronave_id').val();

        let newLineID = await consecutivoLineID();

        for (i in allData) {
            if (allData[i].destino) {
                const destino = allData[i].destino.aeropuerto_id;
                let concepto = allData[i].concepto;
                concepto = concepto.substring(concepto.lastIndexOf(' ') + 1);
                const relacion = allData[i].line_id;
                const fechaActual = formatearFecha(allData[i].fecha_salida);

                if (!aterrizajesMap[relacion]) {

                    const valAterrizaje = await obtenerTasaAterrizaje(destino, aeronave);
                    if (valAterrizaje.exito == 1) {
                        const newRow = {
                            servicio_detalle_id: '',
                            fecha_salida: fechaActual,
                            hora_salida: '0',
                            categoria: { categoria_id: 3, nombre: 'Aterrizaje' },
                            concepto: concepto,
                            origen: '',
                            destino: '',
                            pax: '',
                            tipo_vuelo: '',
                            tarifa: valAterrizaje.aterrizaje.tarifa_aterrizaje,
                            subtotal: valAterrizaje.aterrizaje.tarifa_aterrizaje,
                            relaciones_id: valAterrizaje.aterrizaje.tasa_aterrizaje_id,
                            rel_ruta: relacion,
                            line_id: newLineID,
                            cantidad: 1
                        }
                        newLineID++; // Incrementar el lineID para cada nueva fila
                        rowsToAdd.push(newRow);
                    }
                }
            }
        }

        // Agregar las nuevas filas al grid
        if (rowsToAdd.length > 0) {
            gridApi.applyTransaction({ add: rowsToAdd });
        }

        // Actualizar las filas existentes con los nuevos valores calculados
        const rowsToUpdate = Object.values(aterrizajesMap).filter(row => row.cantidad !== undefined);
        if (rowsToUpdate.length > 0) {
            gridApi.applyTransaction({ update: rowsToUpdate });
        }

    }

}
async function generarTUA() {

    const rowDataToRemove = [];

    // Eliminar todas las Tuas existentes, menos las que tengan id
    gridApi.forEachNode(node => {
        let cat = node.data.categoria;
        let idLine = node.data.servicio_detalle_id;
        if ((cat && node.data.categoria.nombre === 'Tua') && (!idLine)) {
            rowDataToRemove.push(node.data);
        }
    });

    if (rowDataToRemove.length > 0) {
        // Remover las filas identificadas como Tuas
        gridApi.applyTransaction({ remove: rowDataToRemove });

        const allData = [];
        gridApi.forEachNode(node => {
            const rowData = node.data;
            allData.push(rowData);
        });
        gridApi.updateGridOptions({ rowData: allData });
    }

    // Agregar las pernoctas
    const allData = [];
    const tuasMap = {}; // Mapa para rastrear TUAS por 'relaciones_id'

    // Recorremos todas las filas con la categoría 'Ruta' para calcular las TUAS
    gridApi.forEachNode(node => {
        const rowData = node.data;
        if (rowData.categoria && rowData.categoria.nombre === 'Ruta' && rowData.origen && rowData.destino) {
            allData.push(rowData);
        } else if (rowData.categoria && rowData.categoria.nombre === 'Tua') {
            tuasMap[rowData.rel_ruta] = rowData;
        }
    });

    const tipoCambio = await obtenerTipoCambio();
    if (!tipoCambio) return;

    if (allData.length > 0) {
        const rowsToAdd = []; // Aquí almacenaremos las nuevas filas de Tuas
        const rowsToUpdate = []; // Aquí almacenaremos las filas de Tuas a actualizar
        let newLineID = await consecutivoLineID();
        const aeropuertos = await obtenerAeropuertos();

        for (let i = 0; i < allData.length; i++) {
            const origen = allData[i].origen.aeropuerto_id;
            const pax = allData[i].pasajeros;
            const ruta = allData[i];
            const rel_ruta = ruta.line_id;
            const concepto = ruta.concepto;
            const fechaActual = formatearFecha(ruta.fecha_salida);

            const aeropuertoFind = aeropuertos.find(objeto => objeto.aeropuerto_id == origen);

            if (aeropuertoFind && aeropuertoFind['costo_tua']) {

                const tarifa = parseFloat(aeropuertoFind['costo_tua']) / parseFloat(tipoCambio.tipo_cambio);
                const subtotales = (parseFloat(aeropuertoFind['costo_tua']) / parseFloat(tipoCambio.tipo_cambio)) * pax;

                if (tuasMap[rel_ruta]) {
                    // Actualizar TUA existente
                    tuasMap[rel_ruta].cantidad = pax;
                    tuasMap[rel_ruta].tarifa = tarifa;
                    tuasMap[rel_ruta].subtotal = subtotales;
                    rowsToUpdate.push(tuasMap[rel_ruta]);
                } else if (pax > 0) {
                    // Crear nueva fila TUA
                    const newRow = {
                        servicio_detalle_id: '',
                        fecha_salida: fechaActual,
                        hora_salida: '0',
                        categoria: { categoria_id: 5, nombre: 'Tua' },
                        concepto: `${concepto}`,
                        origen: '',
                        destino: '',
                        pax: '',
                        tipo_vuelo: '',
                        cantidad: pax,
                        tarifa: tarifa,
                        subtotal: subtotales,
                        relaciones_id: aeropuertoFind['aeropuerto_id'],
                        rel_ruta: rel_ruta,
                        line_id: newLineID
                    };
                    newLineID++; // Incrementar el lineID para cada nueva fila
                    rowsToAdd.push(newRow);
                }

            }
        }

        // Agregar las nuevas filas al grid
        if (rowsToAdd.length > 0) {
            gridApi.applyTransaction({ add: rowsToAdd });
        }

        // Actualizar las filas existentes con los nuevos valores calculados
        if (rowsToUpdate.length > 0) {
            gridApi.applyTransaction({ update: rowsToUpdate });
        }
    }

}


// FUNCIONES 
async function mostrarContenedorAltas() {
    await configTablaCrear();
    $(".contenedor-altas").show();
}
function resetForm() {
    resetearTabla('#myGrid2', '#searchInput1');
    cerrarVentana('.contenedor-altas', ['#formAltas', '#formTotales']);
    $('#inpCliente').hide();
    $('#inpEmpresa').hide();
    $('#inpGeneral').hide();

    $('#aeronave_id').prop('disabled', false);
    $('#slctOpcion').prop('disabled', false);
    $('#cliente_id').prop('disabled', false);
    $('#broker_id').prop('disabled', false);

    // limpiar pax
    const pax = document.querySelectorAll(`#formPasajeros .cont-pasajero`);
    // Iterar sobre los elementos a partir del segundo elemento
    for (let i = 0; i < pax.length; i++) {
        pax[i].remove(); // Eliminar el elemento
    }
    $('#formRelRuta').empty();
    PASAJEROS = '';
    MAXPAX = 0;
    limpiarForm("#formAltas");
    obtenerServicios();
}
function mostrarClienteEmpresa() {

    let opcionSeleccionada = $('#slctOpcion').val();

    if (opcionSeleccionada == 1) {
        $('#inpCliente').show();
        $('#inpEmpresa').hide();
        $("label[for='cliente_id']").addClass("labelImportant");
        $("label[for='broker_id']").removeClass("labelImportant");
        $("select[id='broker_id'] option").val("");
        $("select[id='broker_id'] option").text("");
    } else if (opcionSeleccionada == 2) {
        $('#inpCliente').hide();
        $('#inpEmpresa').show();
        // $("#rt-responsable").val("");
        $("label[for='broker_id']").addClass("labelImportant");
        $("label[for='cliente_id']").removeClass("labelImportant");
        $("select[id='cliente_id'] option").val("");
        $("select[id='cliente_id'] option").text("");
    }
}
function botonBoardingPass() {
    $(".btn-pass").toggle(['SVC', 'CMP'].includes($('#estatus').val()));
    $("#btnServicio").toggle($('#estatus').val() === 'CTZ');
}
function mostrarClienteEmpresa() {

    let opcionSeleccionada = $('#slctOpcion').val();

    if (opcionSeleccionada == 1) {
        $('#inpCliente').show();
        $('#inpEmpresa').hide();
        $("label[for='cliente_id']").addClass("labelImportant");
        $("label[for='broker_id']").removeClass("labelImportant");
        $("select[id='broker_id'] option").val("");
        $("select[id='broker_id'] option").text("");
    } else if (opcionSeleccionada == 2) {
        $('#inpCliente').hide();
        $('#inpEmpresa').show();
        // $("#rt-responsable").val("");
        $("label[for='broker_id']").addClass("labelImportant");
        $("label[for='cliente_id']").removeClass("labelImportant");
        $("select[id='cliente_id'] option").val("");
        $("select[id='cliente_id'] option").text("");
    }
}
function activarRutas() {
    // Obtener los valores de los campos
    let piloto = $('#piloto_id').val();
    let estatus = $('#estatus').val();

    if (estatus == 'SVC' && piloto) {
        $("#myGrid2").removeClass('event-none');
        $("#formTotales").removeClass('event-none');
        $("#formPasajeros").removeClass('event-none');
    } else {
        $("#myGrid2").addClass('event-none');
        $("#formTotales").addClass('event-none');
        $("#formPasajeros").addClass('event-none');
    }
}
async function consecutivoLineID() {
    // Obtiene todos los datos de la grid
    const allRowData = [];
    gridApi.forEachNode(node => allRowData.push(node.data));

    // Encuentra el máximo valor de lineID
    let maxLineID = 0;
    allRowData.forEach(row => {
        if (row.line_id && row.line_id > maxLineID) {
            maxLineID = row.line_id;
        }
    });

    // Incrementa el máximo valor en 1 o establece en 1 si no hay registros
    const newLineID = maxLineID + 1 || 1;

    return newLineID;
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
        // const inputElement = ruta.querySelector('input[data-paxn]');
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
async function relRutasPaxPld(toggleRelRuta, params) {

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
            // pRuta.setAttribute('data-id', nodo.data.servicio_detalle_id); // Asumiendo que nodo.data.id es el ID de la ruta
            pRuta.setAttribute('data-id', nodo.data.line_id); // Asumiendo que nodo.data.id es el ID de la ruta

            // Crear el elemento select
            let selectPasajeros = document.createElement('select');
            // selectPasajeros.name = `seleccion-${nodo.data.servicio_detalle_id}`;
            selectPasajeros.name = `seleccion-${nodo.data.line_id}`;

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

                selectPasajeros.value = '';

            });

            // Agregar el select al elemento pRuta
            pRuta.appendChild(selectPasajeros);

            // Agregar el elemento p al formulario 'formRelRuta'
            document.getElementById('formRelRuta').appendChild(pRuta);

            console.log(pasajerosPorRuta);

            // Rellenar los datos si ya existen para esta ruta
            if (pasajerosPorRuta[nodo.data.servicio_detalle_id]) {
                pasajerosPorRuta[nodo.data.servicio_detalle_id].forEach(pax => {

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
                    if (!pasajerosSeleccionadosPorRuta[nodo.data.servicio_detalle_id]) {
                        pasajerosSeleccionadosPorRuta[nodo.data.servicio_detalle_id.toString()] = [];
                    }
                    pasajerosSeleccionadosPorRuta[nodo.data.servicio_detalle_id].push(pax.pasajero_id.toString());
                });
            }
        }
    });
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
        if (nodo.data.categoria && nodo.data.categoria.nombre === 'Ruta') {

            let pRuta = document.createElement('p');
            pRuta.textContent = `Ruta: ${nodo.data.concepto}`;
            pRuta.classList.add("rel-ruta");
            pRuta.setAttribute('data-id', nodo.data.line_id); // Asumiendo que nodo.data.line_id es el ID de la ruta

            // Crear el elemento select
            let selectPasajeros = document.createElement('select');
            selectPasajeros.name = `seleccion-${nodo.data.line_id}`;

            // Obtener el formulario de pasajeros
            let formPasajeros = document.getElementById('formPasajeros');

            // Encontrar todos los elementos de pasajeros dentro del formulario
            let pasajerosElements = formPasajeros.querySelectorAll('.cont-pasajero [data-pax]');

            let optionEmpty = document.createElement('option');
            optionEmpty.value = ''; // Valor vacío para la opción
            optionEmpty.textContent = 'Agrega un pasajero'; // Texto de la opción vacía
            optionEmpty.disabled = true; // Deshabilitar la opción vacía
            optionEmpty.selected = true; // Seleccionar la opción vacía
            selectPasajeros.appendChild(optionEmpty); // Agregar la opción vacía al inicio del select

            // Iterar sobre los elementos de pasajeros y agregarlos al select
            pasajerosElements.forEach(pasajeroElement => {
                let nombrePasajero = pasajeroElement.value;
                let idPasajero = pasajeroElement.getAttribute('data-pax');
                let option = document.createElement('option');
                option.value = idPasajero; // Usar el ID del pasajero como valor
                option.textContent = nombrePasajero; // Texto del pasajero
                selectPasajeros.appendChild(option);
            });

            // Manejar el evento change del select
            selectPasajeros.addEventListener('change', function () {
                let idPasajeroSeleccionado = selectPasajeros.value;
                let pasajeroSeleccionado = selectPasajeros.options[selectPasajeros.selectedIndex].textContent;

                // Obtener el ID de la ruta actual
                let idRuta = pRuta.getAttribute('data-id');

                // Verificar si ya existe un registro para la ruta actual
                if (!pasajerosSeleccionadosPorRuta[idRuta]) {
                    // Si no existe, crear un array vacío para almacenar los pasajeros seleccionados
                    pasajerosSeleccionadosPorRuta[idRuta] = [];
                }

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
                pasajeroElemento.setAttribute('data-paxid', idPasajeroSeleccionado); // Añadir atributo data-paxid al elemento p

                // Insertar el elemento p antes del selectPasajeros
                pRuta.insertBefore(pasajeroElemento, selectPasajeros);

                selectPasajeros.value = '';

            });

            // Agregar el select al elemento pRuta
            pRuta.appendChild(selectPasajeros);

            // Agregar el elemento p al formulario 'formRelRuta'
            document.getElementById('formRelRuta').appendChild(pRuta);

            // Rellenar los datos si ya existen para esta ruta
            if (pasajerosPorRuta[nodo.data.line_id]) {
                pasajerosPorRuta[nodo.data.line_id].forEach(pax => {
                    let pasajeroElemento = document.createElement('p');
                    pasajeroElemento.textContent = `Pasajero: ${pax.nombre}`;
                    pasajeroElemento.setAttribute('data-paxid', pax.pasajero_id); // Añadir atributo data-paxid al elemento p

                    // Insertar el elemento p antes del selectPasajeros
                    pRuta.insertBefore(pasajeroElemento, selectPasajeros);

                    // Agregar el pasajero al registro de la ruta actual
                    if (!pasajerosSeleccionadosPorRuta[nodo.data.line_id]) {
                        pasajerosSeleccionadosPorRuta[nodo.data.line_id] = [];
                    }
                    pasajerosSeleccionadosPorRuta[nodo.data.line_id].push(pax.pasajero_id.toString());
                });
            }
        }
    });
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

        return data;

    } catch (error) {
        console.error(error);
        SwalLoad('error', 'Ocurrio Un Error', 'Conección Perdida a BD.', false);
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

            // Copiar la fila y modificar el valor de origen
            let filaModificada = {};
            // Verificar si la fila tiene relacion_id
            if (relacion_id) {

                filaModificada = { ...node.data }; // Crear una copia de la fila


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

                    // Ajustar 'destino' para contener solo 'aeropuerto_id'
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
                }
                detalles.push(filaModificada);
            }
        }

    } catch (error) {
        return detalles = '';
    }

    return detalles;
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

// FETCH
async function obtenerServicios() {
    try {
        const respuesta = await fetch('../obtener/servicios', {
            method: 'GET',
        });
        const data = await respuesta.json();
        // console.log(data);

        let convert = verificarArray(data);
        gridApi.setGridOption('rowData', convert);

    } catch (error) {
        console.error(error);
        SwalToast('warning', 'Error al obtener las cotizaciones', 2500);
    }
}
async function obtenerServDet(id) {
    try {
        const datos = new FormData();
        datos.append('servicio_id', id);

        const respuesta = await fetch('../obtener/vuelosServ', {
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
async function obtenerAeropuertos() {
    try {
        const respuesta = await fetch('../allAeropuertos', {
            method: 'GET'
        });
        const data = await respuesta.json();
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
async function obtenerTarifaCosto() {

    try {

        const aeronave = $("#aeronave_id").val();
        const broker_id = $("#broker_id").val();
        const cliente_id = $("#cliente_id").val();

        const datos = new FormData();
        datos.append('aeronave', aeronave);
        datos.append('broker_id', broker_id);
        datos.append('cliente_id', cliente_id);

        const respuesta = await fetch('../obtener/tarifacostos', {
            method: 'post',
            body: datos
        });
        const data = await respuesta.json();

        if (data && data.tarifa) {
            $("#costo_id").val(data.tarifa.costo_id);
        }
    } catch (error) {
        console.error(error);
        SwalLoad('error', 'Ocurrio Un Error', 'Conección Perdida a BD.', false);
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
async function obtenerProductos() {
    try {
        const respuesta = await fetch('../obtener/productos', {
            method: 'GET'
        });
        const data = await respuesta.json();
        if (!data.length > 0) {
            SwalToast('warning', 'No hay Productos disponibles.', 2500);
        }

        return data;
    } catch (error) {
        console.error(error);
        SwalLoad('error', 'Ocurrio Un Error', 'Conección Perdida a BD.', false);
    }
}
async function obtenerPilotos() {
    try {
        const respuesta = await fetch('pilotos/activos', {
            method: 'GET'
        });
        const data = await respuesta.json();
        if (!data.length > 0) {
            SwalToast('warning', 'No hay Pilotos disponibles.', 2500);
        }

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
async function establecerAsientos() {
    let aeronaves = await obtenerAeronaves();
    let aeronaveId = $('#aeronave_id').val();
    const aeronaveEncontrada = aeronaves.find(objeto => objeto.aeronave_id == aeronaveId);
    if (aeronaveEncontrada) PASAJEROS = aeronaveEncontrada.asientos;
}
async function obtenerTipoCambio() {
    try {
        const respuesta = await fetch('../tipo/cambio', {
            method: 'GET'
        });
        const data = await respuesta.json();

        if (!data) {
            SwalToast('warning', 'No hay Tipo de Cambio.', 2500);
        } else {

            // Agregar 1% arriba
            let tipoCambio = data.tipo_cambio;
            let porciento = tipoCambio * 0.01;
            let cambioNuevo = parseFloat(tipoCambio) + parseFloat(porciento);

            // console.log(tipoCambio);
            // console.log(cambioNuevo);

            $('#tipo_cambio option').val(data.tipo_cambio_id);
            $('#tipo_cambio option').text(parseFloat(cambioNuevo).toFixed(2));
        }

        return data;
    } catch (error) {
        console.error(error);
        SwalLoad('error', 'Ocurrio Un Error', 'Conección Perdida a BD.', false);
    }
}
async function validarDetEliminar(lineId, rowNode) {

    // Verificar si la fila tiene la categoría 'Ruta'
    const categoriaRuta = rowNode.data.categoria.nombre === 'Ruta';

    if (categoriaRuta) {
        const aeronave = $('#aeronave_id').val();

        gridApi.forEachNode(async node => {
            const rowData = node.data;
            const rowNodeP = node;

            // Buscar las filas con la categoría 'Pernocta' y el mismo ID de relaciones
            if (rowData.categoria && rowData.categoria.nombre === 'Pernocta' && rowData.rel_ruta === lineId) {
                limpiarCelda(rowNodeP);
                await eliminarDet(rowData.servicio_detalle_id)
            }

            // Buscar las filas con la categoría 'Tua' y el mismo ID de relaciones
            if (rowData.categoria && rowData.categoria.nombre === 'Tua' && rowData.rel_ruta === lineId) {
                limpiarCelda(rowNodeP);
                await eliminarDet(rowData.servicio_detalle_id)
            }
            // Buscar las filas con la categoria 'Aterrizaje'
            if (rowData.categoria && rowData.categoria.nombre === 'Aterrizaje' && rowData.rel_ruta === lineId) {
                limpiarCelda(rowNodeP);
                await eliminarDet(rowData.servicio_detalle_id)
            }

        });
    }

    // Eliminamos el Registro clickeado
    await eliminarDet(rowNode.data.servicio_detalle_id)
    limpiarCelda(rowNode);
}
// ACCIONES
async function actualizarCotizacion() {
    try {

        const datos = new FormData();
        const servicio = $('#servicio_id').val();
        const piloto = $('#piloto_id').val();
        const folio = $('#folio').val();
        const estatus = $('#estatus').val();
        const fechaCot = $('#fecha-cot').val();
        const aeronave_id = $('#aeronave_id').val();
        if ($('#slctOpcion').val() == 1) {
            const cliente_id = $('#cliente_id').val();
            datos.append('cliente_id', cliente_id);
        } else if ($('#slctOpcion').val() == 2) {
            const broker_id = $('#broker_id').val();
            datos.append('broker_id', broker_id);
        }
        const tipo_cambio = $('#tipo_cambio').val();
        const cant_pernocta = $('#cant_pernocta').val();
        const tot_pernocta = sinComa($('#tot_pernocta').val());
        const tot_hrs = sinComa($('#tot_hrs').val());
        const subtotal = sinComa($('#subtotal').val());
        const ivaNac = sinComa($('#ivaNac').val());
        const ivaInt = sinComa($('#ivaInt').val());
        const total = sinComa($('#total').val());
        const costo_id = $('#costo_id').val();
        const comentarios = $('#rt-comment').val();

        let tipo_de_viaje = 0;
        let detalles = await validarGrid();
        let pasajerosDet = await validarPasajeros();

        if (detalles.length > 0) {
            let dtO1 = detalles[0]['origen'];
            let dtD1 = detalles[0]['destino'];
            if (detalles.length == 1) {
                tipo_de_viaje = 1;
            } else if (detalles.length == 2) {
                let dtO2 = detalles[1]['origen'];
                let dtD2 = detalles[1]['destino'];
                if (dtO1 == dtD2 && dtD1 == dtO2) {
                    tipo_de_viaje = 2;
                } else {
                    tipo_de_viaje = 3;
                }
            } else {
                tipo_de_viaje = 3;
            }
            datos.append('servicio_id', servicio);
            datos.append('piloto_id', piloto);
            datos.append('folio_cotizar', folio);
            datos.append('aeronave_id', aeronave_id);
            datos.append('fecha_creacion', fechaCot);
            datos.append('estatus', estatus);
            datos.append('tipo_cambio_id', tipo_cambio);
            datos.append('cant_pernocta', cant_pernocta);
            datos.append('tot_pernocta', tot_pernocta);
            datos.append('tot_hr_cotizadas', tot_hrs);
            datos.append('subtotal', subtotal);
            datos.append('ivaNac', ivaNac);
            datos.append('ivaInt', ivaInt);
            datos.append('total', total);
            datos.append('comentarios', comentarios);
            datos.append('tipo_de_viaje', tipo_de_viaje);
            datos.append('costo_id', costo_id);
            datos.append('pasajerosDet', JSON.stringify(pasajerosDet));
            datos.append('detalles', JSON.stringify(detalles));

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

            const respuesta = await fetch('../actualizar/servicio', {
                method: 'POST',
                body: datos
            });

            const data = await respuesta.json();

            if (data.exito == 1) {
                SwalLoad('success', 'Éxito', 'Registro Actualizado Correctamente', false);
                setTimeout(() => {
                    swal.close();
                    resetForm();
                    obtenerServicios();
                }, 1500);
            } else if (data.exito == 0) {
                SwalLoad('error', 'Error en la Transacción', data.errorSMS, true);
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
        datos.append('relRutaPax', JSON.stringify(relRutaPax));
        datos.append('csrf_token', csrfToken);

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

async function eliminarDet(id) {

    try {
        const servicio = $('#servicio_id').val();

        const datos = new FormData();
        datos.append('servicio_detalle_id', id);
        datos.append('servicio_id', servicio);

        const respuesta = await fetch('../eliminar/detServicio', {
            method: 'POST',
            body: datos
        });

        const data = await respuesta.json();

        if (data.exito == 1) {
            // Registro Creado Exitosamente
            // SwalToast('success', 'Registro Eliminado Correctamente', 2500);
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

//  CLASES
class CustomHeaderGroup {

    init(params) {
        this.params = params;
        this.eGui = document.createElement('div');
        this.eGui.className = 'ag-header-group-cell-label';
        this.eGui.innerHTML = '' +
            '<div class="customHeaderLabel">' + this.params.displayName + '</div>' +
            '<div class="customExpandButton"><i class="fa fa-arrow-right"></i></div>';

        this.onExpandButtonClickedListener = this.expandOrCollapse.bind(this);
        this.eExpandButton = this.eGui.querySelector(".customExpandButton");
        this.eExpandButton.addEventListener('click', this.onExpandButtonClickedListener);

        this.onExpandChangedListener = this.syncExpandButtons.bind(this);
        this.params.columnGroup.getProvidedColumnGroup().addEventListener('expandedChanged', this.onExpandChangedListener);

        this.syncExpandButtons();
    }

    getGui() {
        return this.eGui;
    }

    expandOrCollapse() {
        var currentState = this.params.columnGroup.getProvidedColumnGroup().isExpanded();
        this.params.setExpanded(!currentState);
    }

    syncExpandButtons() {
        function collapsed(toDeactivate) {
            toDeactivate.className = toDeactivate.className.split(' ')[0] + ' collapsed';
        }

        function expanded(toActivate) {
            toActivate.className = toActivate.className.split(' ')[0] + ' expanded';
        }

        if (this.params.columnGroup.getProvidedColumnGroup().isExpanded()) {
            expanded(this.eExpandButton);
        } else {
            collapsed(this.eExpandButton);
        }
    }

    destroy() {
        this.eExpandButton.removeEventListener('click', this.onExpandButtonClickedListener);
    }
}
