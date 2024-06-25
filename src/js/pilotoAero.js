let gridOptions;

// Utilizando el Principio de Modularidad
$(function () {
    asignarEventos();
    inicializarPagina();
    configurarBotones();
});

function asignarEventos() {
    // Ocultar Listados
    $('.pilotoSearch').hide();
    $('.aeroSearch').hide();

    document.addEventListener("keydown", e => {
        if (e.key === 'Escape') {
            resetForm();
        }
    });

    // Lista Pilotos
    document.getElementById("piloto_id").addEventListener("mousedown", async function (event) {
        event.preventDefault();
        $('.pilotoSearch').show();
        $('.inPilotoSrch').focus()
        let data = await obtenerPilotos();
        const listSearch = await mostrarListaSearch(data, '.pilotoSearch', 'empleado_id', 'nombre_empleado');

    });

    // Lista Aeronaves
    document.getElementById("aeronave_id").addEventListener("mousedown", async function (event) {
        event.preventDefault();
        $('.aeroSearch').show();
        $('.inAeroSrch').focus()
        let data = await obtenerAeronaves();
        const listSearch = await mostrarListaSearch(data, '.aeroSearch', 'aeronave_id', 'modelo');
    });
}

function configurarBotones() {
    // Ocultar altas
    $(".contenedor-altas").hide();

    $("#crear-pilotoAero").click(mostrarContenedorAltas);

    $(".btn-cancelar").click(e => {
        resetForm();
    });

    $("#btnGuardar").click(e => {
        let validar = validateInputs($('#formAltas'));
        if (validar) $('#piloto_aero_id').val() == '' ? crearPilotAero() : actualizarPilotAero();
    });
}

function inicializarPagina() {

    let columnDefs = [
        {
            headerName: 'id',
            field: 'piloto_aero_id',
            width: 80
        },
        {
            headerName: 'Piloto',
            field: 'nombre_empleado',
            width: 160
        },
        {
            headerName: 'Aeronave',
            field: 'modelo',
            width: 250
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

                    $('#piloto_aero_id').val(params.data.piloto_aero_id);

                    $('#piloto_id option').val(params.data.piloto_id);
                    $('#piloto_id option').text(params.data.nombre_empleado);

                    $('#aeronave_id option').val(params.data.aeronave_id);
                    $('#aeronave_id option').text(params.data.modelo);

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
    traePilotoAero();
}

// FUNCIONES 
async function traePilotoAero() {
    try {
        const respuesta = await fetch('allPilotoAero', {
            method: 'GET',
        });
        const data = await respuesta.json();
        // console.log(data);

        let convert = verificarArray (data);
        gridApi.setGridOption('rowData', convert);

    } catch (error) {
        console.error(error);
        SwalToast('warning', 'Error al obtener los usuarios', 2500);
    }
}

function resetForm() {
    cerrarVentana('.contenedor-altas', ['#formAltas']);
}

async function mostrarContenedorAltas() {
    $(".contenedor-altas").show();
    await obtenerPilotos();
    await obtenerAeronaves();
}

async function obtenerPilotos() {
    try {
        const respuesta = await fetch('pilotos/activos', {
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
        const respuesta = await fetch('aeronaves/activas', {
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

async function crearPilotAero() {

    const piloto_id = $('#piloto_id').val();
    const aeronave_id = $('#aeronave_id').val();

    try {

        const datos = new FormData();
        datos.append('piloto_id', piloto_id);
        datos.append('aeronave_id', aeronave_id);

        const respuesta = await fetch('crear/pilotoAero', {
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
                traePilotoAero();
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

async function actualizarPilotAero() {

    const piloto_aero_id = $('#piloto_aero_id').val();
    const piloto_id = $('#piloto_id').val();
    const aeronave_id = $('#aeronave_id').val();

    try {

        const datos = new FormData();
        datos.append('piloto_aero_id', piloto_aero_id);
        datos.append('piloto_id', piloto_id);
        datos.append('aeronave_id', aeronave_id);

        const respuesta = await fetch('actualizar/pilotoAero', {
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
                traePilotoAero();
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