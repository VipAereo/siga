let gridOptions;

// Utilizando el Principio de Modularidad
$(function () {
    asignarEventos();
    inicializarPagina();
    configurarBotones();
});

function asignarEventos() {

    aplicarMascaraCantidad('costo_tua');

    document.addEventListener("keydown", e => {
        if (e.key === 'Escape') {
            resetForm();
        }
    });
}

function configurarBotones() {
    $(".contenedor-altas").hide();
    $("#crear-aeronave").click(mostrarContenedorAltas);

    $(".btn-cancelar").click(e => {
        resetForm();
    });

    $("#btnGuardar").click(e => {
        let validar = validateInputs($('#formAltas'));
        if (validar) $('#aeropuerto_id').val() == '' ? crearAeropuerto() : actualizarAeropuerto();
    });
}

function inicializarPagina() {

    let columnDefs = [
        {
            headerName: 'id',
            field: 'aeropuerto_id',
            width: 80
        },
        {
            headerName: 'Nombre',
            field: 'nombre',
            width: 250
        },
        {
            headerName: 'Código IATA',
            field: 'codigo_iata',
            width: 120
        },
        {
            headerName: 'Código ICAO',
            field: 'codigo_icao',
            width: 120
        },
        {
            headerName: 'Costo TUA',
            field: 'costo_tua',
            width: 120,
            valueFormatter: function (params) {
                // Formatea el número con comas como separadores de miles y dos decimales
                return Number(params.value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        },
        {
            headerName: 'País',
            field: 'pais',
            width: 100
        },
        {
            headerName: 'Estado',
            field: 'estado',
            width: 135
        },
        {
            headerName: 'Estatus',
            field: 'estatus',
            width: 100
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

                    $('#aeropuerto_id').val(params.data.aeropuerto_id);
                    $('#nombre').val(params.data.nombre);
                    $('#codigo_iata').val(params.data.codigo_iata);
                    $('#codigo_icao').val(params.data.codigo_icao);
                    $('#costo_tua').val(params.data.costo_tua);
                    $('#pais').val(params.data.pais);
                    $('#estado').val(params.data.estado);
                    $('#municipio').val(params.data.municipio);
                    $('#concesionario').val(params.data.concesionario);
                    $('#permisionario').val(params.data.permisionario);
                    $('#longitud').val(params.data.longitud);
                    $('#latitud').val(params.data.latitud);
                    $('#altitud').val(params.data.altitud);
                    $('#estatus').val(params.data.estatus);
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
    traeAeropuerto();
}

function resetForm() {
    cerrarVentana('.contenedor-altas', ['#formAltas']);
}
async function mostrarContenedorAltas() {
    $(".contenedor-altas").show();
}

async function traeAeropuerto() {
    try {
        const respuesta = await fetch('allAeropuertos', {
            method: 'GET',
        });
        const data = await respuesta.json();
        console.log(data);

        let convert = verificarArray (data);
        gridApi.setGridOption('rowData', convert);

    } catch (error) {
        console.error(error);
        SwalToast('warning', 'Error al obtener los usuarios', 2500);
    }
}
async function crearAeropuerto() {

    const nombre = $('#nombre').val();
    const codigo_iata = $('#codigo_iata').val();
    const codigo_icao = $('#codigo_icao').val();
    const costo_tua = $('#costo_tua').val();
    const pais = $('#pais').val();
    const estado = $('#estado').val();
    const municipio = $('#municipio').val();
    const concesionario = $('#concesionario').val();
    const permisionario = $('#permisionario').val();
    const longitud = $('#longitud').val();
    const latitud = $('#latitud').val();
    const altitud = $('#altitud').val();
    const estatus = $('#estatus').val();

    try {

        const datos = new FormData();
        datos.append('nombre', nombre);
        datos.append('codigo_iata', codigo_iata);
        datos.append('codigo_icao', codigo_icao);
        datos.append('costo_tua', costo_tua);
        datos.append('pais', pais);
        datos.append('estado', estado);
        datos.append('municipio', municipio);
        datos.append('concesionario', concesionario);
        datos.append('permisionario', permisionario);
        datos.append('longitud', longitud);
        datos.append('latitud', latitud);
        datos.append('altitud', altitud);
        datos.append('estatus', estatus);

        const respuesta = await fetch('crear/aeropuerto', {
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
                traeAeropuerto();
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
async function actualizarAeropuerto() {

    const aeropuerto_id = $('#aeropuerto_id').val();
    const nombre = $('#nombre').val();
    const codigo_iata = $('#codigo_iata').val();
    const codigo_icao = $('#codigo_icao').val();
    const costo_tua = sinComa($('#costo_tua').val());
    const pais = $('#pais').val();
    const estado = $('#estado').val();
    const municipio = $('#municipio').val();
    const concesionario = $('#concesionario').val();
    const permisionario = $('#permisionario').val();
    const longitud = $('#longitud').val();
    const latitud = $('#latitud').val();
    const altitud = $('#altitud').val();
    const estatus = $('#estatus').val();

    try {

        const datos = new FormData();
        datos.append('aeropuerto_id', aeropuerto_id);
        datos.append('nombre', nombre);
        datos.append('codigo_iata', codigo_iata);
        datos.append('codigo_icao', codigo_icao);
        datos.append('costo_tua', costo_tua);
        datos.append('pais', pais);
        datos.append('estado', estado);
        datos.append('municipio', municipio);
        datos.append('concesionario', concesionario);
        datos.append('permisionario', permisionario);
        datos.append('longitud', longitud);
        datos.append('latitud', latitud);
        datos.append('altitud', altitud);
        datos.append('estatus', estatus);


        const respuesta = await fetch('actualizar/aeropuerto', {
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
                traeAeropuerto();
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