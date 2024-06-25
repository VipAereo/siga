let gridOptions;

// Utilizando el Principio de Modularidad
$(function () {
    asignarEventos();
    inicializarPagina();
    configurarBotones();
});

function asignarEventos() {
    // Ocultar Listados
    $('.rutaSearch').hide();
    $('.aeronSearch').hide();

    document.addEventListener("keydown", e => {
        if (e.key === 'Escape') {
            resetForm();
        }
    });

    // $("#ruta_id, #aeronave_id").change(e => {
    //     console.log('cambio');
    //     $('#tiempo_estimado').val('');
    //     let ruta = $('#ruta_id').val();
    //     let aeronave = $('#aeronave_id').val();
    //     if (ruta && aeronave) obtenerDetalleTarifa(ruta, aeronave);
    // });

    aplicarMascaraCantidad('costo', 'impuesto', 'descuento');

    // Lista Rutas
    document.getElementById("ruta_id").addEventListener("mousedown", async function (event) {
        event.preventDefault();
        $('.rutaSearch').show();
        $('.inRutaSrch').focus()
        let data = await obtenerRutas();
        const listSearch = await mostrarListaSearch(data, '.rutaSearch', 'ruta_id', 'rutas_nombre');
        obtenerDetalleTarifa();
    });

    // Lista Aeronaves
    document.getElementById("aeronave_id").addEventListener("mousedown", async function (event) {
        event.preventDefault();
        $('.aeronSearch').show();
        $('.inAeronSrch').focus()
        let data = await obtenerAeronaves();
        const listSearch = await mostrarListaSearch(data, '.aeronSearch', 'aeronave_id', 'modelo');
        obtenerDetalleTarifa();
    });
}

function configurarBotones() {
    $(".contenedor-altas").hide();
    $("#crear-tarifa").click(mostrarContenedorAltas);

    $(".btn-cancelar").click(e => {
        resetForm();
    });

    $("#btnGuardar").click(e => {
        let validar = validateInputs($('#formAltas'));
        if (validar) $('#tarifa_id').val() == '' ? crearTarifa() : actualizarTarifa();
    });
}

function inicializarPagina() {
    let columnDefs = [
        {
            headerName: 'id',
            field: 'tarifa_id',
            width: 80
        },
        {
            headerName: 'Concepto',
            field: 'concepto',
            width: 150
        },
        {
            headerName: 'Ruta',
            field: 'ruta',
            width: 180
        },
        {
            headerName: 'Aeronave',
            field: 'modelo',
            width: 150
        },
        {
            headerName: 'Tipo de Vuelo',
            field: 'tipo_vuelo',
            width: 120
        },
        {
            headerName: 'Tiempo Estimado',
            field: 'tiempo_estimado',
            width: 120
        },
        {
            headerName: 'Costo',
            field: 'costo',
            width: 130,
            cellStyle: { textAlign: 'right' }, // Alinea los datos a la derecha
            valueFormatter: function (params) {
                // Formatea el número con comas como separadores de miles y dos decimales
                return Number(params.value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        },
        {
            headerName: 'Tipo de Vuelo',
            field: 'tipo_vuelo',
            width: 120,
            valueFormatter: function (params) {
                const traducciones = {
                    "N": "Nacional",
                    "I": "Internacional"
                };
                return traducciones[params.value] || params.value;
            }
        },
        {
            headerName: 'Acción',
            cellRenderer: function (params) {
                const editButton = document.createElement('I');
                editButton.className = "fa-regular fa-pen-to-square btn btn-editar";
                editButton.title = 'Editar';

                editButton.addEventListener('click', async function () {
                    await mostrarContenedorAltas();

                    $('#tarifa_id').val(params.data.tarifa_id);

                    $('#tiempo_estimado').val(params.data.tiempo_estimado);
                    $('#concepto').val(params.data.concepto);
                    $('#tipo_vuelo').val(params.data.tipo_vuelo);
                    $('#costo').val(params.data.costo);
                    $('#impuesto').val(params.data.impuesto);
                    $('#descuento').val(params.data.descuento);

                    $('#ruta_id option').val(params.data.ruta_id);
                    $('#ruta_id option').text(params.data.ruta);

                    $('#aeronave_id option').val(params.data.aeronave_id);
                    $('#aeronave_id option').text(params.data.modelo);

                    if ($('#tarifa_id').val()) {
                        $('#ruta_id').addClass('input-disabled');
                        $('#aeronave_id').addClass('input-disabled');
                    }
                });

                // Crea un contenedor para los botones y los agrega
                const actionContainer = document.createElement('div');
                actionContainer.classList = "btn-cont centrado";
                actionContainer.appendChild(editButton);

                return actionContainer;
            },
            width: 150,
            headerClass: 'txt-center',
            cellClass: 'custom-action-cell', // Agregar la clase CSS 'custom-action-cell' a todas las celdas en esta columna
            filter: false
        },
    ];

    let data = '';
    iniciarTabla(data, columnDefs, '#myGrid');
    traerTarifas();
}

// FUNCIONES
function resetForm() {
    cerrarVentana('.contenedor-altas', ['#formAltas']);
}
async function mostrarContenedorAltas() {
    $(".contenedor-altas").show();
    $('#ruta_id').removeClass('input-disabled');
    $('#aeronave_id').removeClass('input-disabled');

    await obtenerRutas();
    await obtenerAeronaves();
}
async function obtenerRutas() {
    try {
        const respuesta = await fetch('/obtener/rutas', {
            method: 'GET'
        });
        const data = await respuesta.json();
        // console.log(data);

        if (!data.length > 0) SwalToast('warning', 'No hay Programas disponibles.', 2500);

        return data;
    } catch (error) {
        console.error(error);
        SwalLoad('error', 'Ocurrio Un Error', 'Conección Perdida a BD.', false);
    }
}
async function obtenerAeronaves() {
    try {
        const respuesta = await fetch('/aeronaves/activas', {
            method: 'GET'
        });
        const data = await respuesta.json();
        // console.log(data);

        if (!data.length > 0) SwalToast('warning', 'No hay Programas disponibles.', 2500);

        return data;
    } catch (error) {
        console.error(error);
        SwalLoad('error', 'Ocurrio Un Error', 'Conección Perdida a BD.', false);
    }
}
async function obtenerDetalleTarifa() {

    console.log('calculando...');
    $('#tiempo_estimado').val('');
    let ruta = $('#ruta_id').val();
    let aeronave = $('#aeronave_id').val();

    if (ruta && aeronave) {
        try {
            const datos = new FormData();
            datos.append('ruta_id', ruta);
            datos.append('aeronave_id', aeronave);

            const respuesta = await fetch('/obtener/detalleTarifa', {
                method: 'POST',
                body: datos
            });

            const data = await respuesta.json();
            // console.log(data);

            if (data.exito) {
                let distancia = data.exito[0].distancia;
                let ktas = data.exito[0].ktas;


                if (distancia && ktas > 0) {
                    let tiempoEstimado = calcularTiempoEstimado(distancia, ktas);
                    
                    $('#tiempo_estimado').val(tiempoEstimado);
                }
            }

            if (data.alertas) {
                SwalToast('warning', data.alertas.error, 2500);
            }

            return data;
        } catch (error) {
            console.error(error);
            SwalLoad('error', 'Ocurrio Un Error', 'Conección Perdida a BD.', false);
        }
    }
}
// Función para calcular el tiempo estimado de vuelo
function calcularTiempoEstimado(distancia, ktas) {

    const nudo = 1.852; // Km / h
    let km = nudo * ktas;
    let tiempo = (distancia / km).toFixed(2);

    let horas = Math.floor(tiempo); // Obtener la parte entera de las horas
    let minutos = Math.round((tiempo - horas) * 60); // Convertir la fracción de hora a minutos

    return horas + ":" + minutos;
}
async function traerTarifas() {
    try {
        const respuesta = await fetch('obtener/tarifas', {
            method: 'GET',
        });
        const data = await respuesta.json();
        // console.log(data);

        let convert = verificarArray (data);
        gridApi.setGridOption('rowData', convert);

    } catch (error) {
        console.error(error);
        SwalToast('warning', 'Error al obtener los datos', 2500);
    }
}
async function crearTarifa() {

    const ruta_id = $('#ruta_id').val();
    const aeronave_id = $('#aeronave_id').val();
    const tiempo_estimado = $('#tiempo_estimado').val();
    const concepto = $('#concepto').val();
    const tipo_vuelo = $('#tipo_vuelo').val();
    const costo = $('#costo').val();
    const impuesto = $('#impuesto').val();
    const descuento = $('#descuento').val();

    try {

        const datos = new FormData();
        datos.append('ruta_id', ruta_id);
        datos.append('aeronave_id', aeronave_id);
        datos.append('tiempo_estimado', tiempo_estimado);
        datos.append('concepto', concepto);
        datos.append('tipo_vuelo', tipo_vuelo);
        datos.append('costo', costo);
        datos.append('impuesto', impuesto);
        datos.append('descuento', descuento);

        const respuesta = await fetch('crear/tarifa', {
            method: 'POST',
            body: datos
        });

        const data = await respuesta.json();
        // console.log(data);

        if (data.exito == 1) {
            // Registro Creado Exitosamente
            SwalLoad('success', 'Éxito', 'Registro Creado Correctamente', false);
            setTimeout(() => {
                swal.close();
                resetForm();
                traerTarifas();
            }, 1500);
        } else if (data.exito == 0) {
            SwalLoad('error', 'Error en la Transacción', data.errorSMS, true);
        }
        if (data.alertas) {
            SwalToast('warning', data.alertas.error, 2500);
        }

    } catch (error) {
        console.error(error);
        SwalLoad('error', 'Error en la Conexión', 'Comunicate con el Administrador', false);
    }
}
async function actualizarTarifa() {

    const tarifa_id = $('#tarifa_id').val();
    const ruta_id = $('#ruta_id').val();
    const aeronave_id = $('#aeronave_id').val();
    const tiempo_estimado = $('#tiempo_estimado').val();
    const concepto = $('#concepto').val();
    const tipo_vuelo = $('#tipo_vuelo').val();
    const costo = $('#costo').val();
    const impuesto = $('#impuesto').val();
    const descuento = $('#descuento').val();

    try {

        const datos = new FormData();
        datos.append('tarifa_id', tarifa_id);
        datos.append('ruta_id', ruta_id);
        datos.append('aeronave_id', aeronave_id);
        datos.append('tiempo_estimado', tiempo_estimado);
        datos.append('concepto', concepto);
        datos.append('tipo_vuelo', tipo_vuelo);
        datos.append('costo', costo);
        datos.append('impuesto', impuesto);
        datos.append('descuento', descuento);

        const respuesta = await fetch('actualizar/tarifa', {
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
                traerTarifas();
            }, 1500);
        } else if (data.exito == 0) {
            SwalLoad('error', 'Error en la Transacción', data.errorSMS, true);
        }
        if (data.alertas) {
            SwalToast('warning', data.alertas.error, 2500);
        }

    } catch (error) {
        console.error(error);
        SwalLoad('error', 'Error en la Conexión', 'Comunicate con el Administrador', false);
    }
}
