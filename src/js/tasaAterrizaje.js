let gridOptions;

// Utilizando el Principio de Modularidad
$(function () {
    asignarEventos();
    inicializarPagina();
    configurarBotones();
});

function asignarEventos() {
    // Ocultar Listados
    $('.aeropSearch').hide();
    $('.naveSearch').hide();

    document.addEventListener("keydown", e => {
        if (e.key === 'Escape') {
            resetForm();
        }
    });

    seleccionTxt('tarifa_aterrizaje');
    aplicarMascaraCantidad('tarifa_aterrizaje');

    $('#tarifa_aterrizaje').on('input', function () {
        var total = 0;
        // Suma los valores de los tres campos de entrada
        $('#tarifa_aterrizaje').each(function () {
            let valor = Number($(this).val().replace(/,/g, ''));
            total += valor;
        });
    });

    // Lista Aeropuertos
    document.getElementById("aeropuerto_id").addEventListener("mousedown", async function (event) {
        event.preventDefault();
        $('.aeropSearch').show();
        $('.inAeropSrch').focus()
        let data = await obtenerAeropuertos();
        const listSearch = await mostrarListaSearch(data, '.aeropSearch', 'aeropuerto_id', 'municipio');
    });

    // Lista Aeronaves
    document.getElementById("aeronave_id").addEventListener("mousedown", async function (event) {
        event.preventDefault();
        $('.naveSearch').show();
        $('.inNaveSrch').focus()
        let data = await obtenerAeronaves();
        const listSearch = await mostrarListaSearch(data, '.naveSearch', 'aeronave_id', 'modelo');
    });   
}

function configurarBotones() {
    $(".contenedor-altas").hide();
    $("#crear-tasa").click(mostrarContenedorAltas);

    $(".btn-cancelar").click(e => {
        resetForm();
    });

    $("#btnGuardar").click(e => {
        let validar = validateInputs($('#formAltas'));
        if (validar) $('#tasa_aterrizaje_id').val() == '' ? crearTasa() : actualizarTasa();
    });
}
function inicializarPagina() {
    let columnDefs = [
        {
            headerName: 'id',
            field: 'tasa_aterrizaje_id',
            width: 80
        },
        {
            headerName: 'Aeropuerto ',
            field: 'nombre_aeropuerto',
            width: 190,
        },
        {
            headerName: 'Aeronave',
            field: 'nombre_aeronave',
            width: 120,
        },
        {
            headerName: 'Tarifa de Aterrizaje',
            field: 'tarifa_aterrizaje',
            width: 160,
            cellStyle: { textAlign: 'right' }, // Alinea los datos a la derecha
            valueFormatter: function (params) {
                // Formatea el número con comas como separadores de miles y dos decimales
                return Number(params.value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        },
        {
            headerName: 'Acción',
            cellRenderer: function (params) {
                const editButton = document.createElement('I');
                editButton.className = "fa-regular fa-pen-to-square btn btn-editar";
                editButton.title = 'Editar';

                // Datos a Editar
                editButton.addEventListener('click', async function () {
                    await mostrarContenedorAltas();

                    $('#tasa_aterrizaje_id').val(params.data.tasa_aterrizaje_id);
                    $('#tarifa_aterrizaje').val(conComa(params.data.tarifa_aterrizaje));
                
                    $('#aeropuerto_id option').val(params.data.aeropuerto_id);
                    $('#aeropuerto_id option').text(params.data.nombre_aeropuerto);

                    $('#aeronave_id option').val(params.data.aeronave_id);
                    $('#aeronave_id option').text(params.data.nombre_aeronave);
                });

                const actionContainer = document.createElement('div');
                actionContainer.classList = "btn-cont centrado";
                actionContainer.appendChild(editButton);

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
    traeTasaAterrizaje();
}

// FUNCIONES
function resetForm() {
    cerrarVentana('.contenedor-altas', ['#formAltas']);
}
async function mostrarContenedorAltas() {
    $(".contenedor-altas").show();
    await obtenerAeropuertos();
    await obtenerAeronaves();
}
async function traeTasaAterrizaje() {
    try {
        const respuesta = await fetch('allTasaAt', {
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
async function obtenerAeropuertos() {
    try {
        const respuesta = await fetch('allAeropuertos', {
            method: 'GET'
        });
        const data = await respuesta.json();
        // console.log(data);

        if (!data.length > 0) SwalToast('warning', 'No hay Aeropuertos disponibles.', 2500);

        return data;
    } catch (error) {
        console.error(error);
        SwalLoad('error', 'Ocurrio Un Error', 'Conección Perdida a BD.', false);
    }
}
async function obtenerAeronaves() {
    try {
        const respuesta = await fetch('allAeronaves', {
            method: 'GET'
        });
        const data = await respuesta.json();
        // console.log(data);

        if (!data.length > 0) SwalToast('warning', 'No hay Aeronaves disponibles.', 2500);

        return data;
    } catch (error) {
        console.error(error);
        SwalLoad('error', 'Ocurrio Un Error', 'Conección Perdida a BD.', false);
    }
}
async function crearTasa() {

    const aeropuerto_id = $('#aeropuerto_id').val();
    const aeronave_id = $('#aeronave_id').val();
    const tarifa_aterrizaje = sinComa($('#tarifa_aterrizaje').val());

    try {

        const datos = new FormData();
        datos.append('aeropuerto_id', aeropuerto_id);
        datos.append('aeronave_id', aeronave_id);
        datos.append('tarifa_aterrizaje', tarifa_aterrizaje);

        const respuesta = await fetch('crear/tasaAterrizaje', {
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
                traeTasaAterrizaje();
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
async function actualizarTasa() {

    const tasa_aterrizaje_id = $('#tasa_aterrizaje_id').val();
    const aeropuerto_id = $('#aeropuerto_id').val();
    const aeronave_id = $('#aeronave_id').val();
    const tarifa_aterrizaje = sinComa($('#tarifa_aterrizaje').val());

    try {

        const datos = new FormData();
        datos.append('tasa_aterrizaje_id', tasa_aterrizaje_id);
        datos.append('aeropuerto_id', aeropuerto_id);
        datos.append('aeronave_id', aeronave_id);
        datos.append('tarifa_aterrizaje', tarifa_aterrizaje);

        const respuesta = await fetch('actualizar/tasaAterrizaje', {
            method: 'POST',
            body: datos
        });

        const data = await respuesta.json();

        if (data.exito == 1) {
            // Registro Creado Exitosamente
            SwalLoad('success', 'Éxito', 'Registro Actualizado Correctamente', false);
            setTimeout(() => {
                swal.close();
                resetForm();
                traeTasaAterrizaje();
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