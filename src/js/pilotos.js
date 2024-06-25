let gridOptions;

// Utilizando el Principio de Modularidad
$(function () {
    asignarEventos();
    inicializarPagina();
    configurarBotones();
});

function asignarEventos() {
    // Ocultar Listados
    $('.pilotosSearch').hide();

    document.addEventListener("keydown", e => {
        if (e.key === 'Escape') {
            resetForm();
        }
    });

    // Lista Piloto
    document.getElementById("empleado_id").addEventListener("mousedown", async function (event) {
        event.preventDefault();
        $('.pilotosSearch').show();
        $('.inPilotoSrch').focus()
        let data = await obtenerEmpleados();
        console.log(data);
        const listSearch = await mostrarListaSearch(data, '.pilotosSearch', 'empleado_id', 'nombre');
    });
}

function configurarBotones() {
    $(".contenedor-altas").hide();
    $("#crear-piloto").click(mostrarContenedorAltas);

    $(".btn-cancelar").click(e => {
        resetForm();
    });

    $("#btnGuardar").click(e => {
        let validar = validateInputs($('#formAltas'));
        if (validar) $('#piloto_id').val() == '' ? crearPiloto() : actualizarPiloto();
    });
}

function inicializarPagina() {

    let columnDefs = [
        {
            headerName: 'id',
            field: 'piloto_id',
            width: 80
        },
        {
            headerName: 'Nombre',
            field: 'empleado_nombre',
            width: 150
        },
        {
            headerName: 'Licencia',
            field: 'licencia',
            width: 120
        },
        {
            headerName: 'Tipo Licencia',
            field: 'tipo_licencia',
            width: 130
        },
        {
            headerName: 'Estatus',
            field: 'estatus',
            width: 150
        },
        {
            headerName: 'Horas Vuelo',
            field: 'horas_vuelo',
            width: 120
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

                    $('#piloto_id').val(params.data.piloto_id);
                    $('#licencia').val(params.data.licencia);
                    $('#tipo_licencia').val(params.data.tipo_licencia);
                    $('#vence_licencia').val(params.data.vence_licencia);
                    $('#horas_vuelo').val(params.data.horas_vuelo);
                    $('#estatus').val(params.data.estatus);

                    $('#empleado_id option').val(params.data.empleado_id);
                    $('#empleado_id option').text(params.data.empleado_nombre);
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
    traePilotos();
}

function resetForm() {
    cerrarVentana('.contenedor-altas', ['#formAltas']);
}

async function mostrarContenedorAltas() {
    $(".contenedor-altas").show();
    await obtenerEmpleados();
}

async function traePilotos() {
    try {
        const respuesta = await fetch('allPilotos', {
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

async function obtenerEmpleados() {
    try {
        const respuesta = await fetch('empleados/activos', {
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

async function crearPiloto() {

    const licencia = $('#licencia').val();
    const tipo_licencia = $('#tipo_licencia').val();
    const vence_licencia = $('#vence_licencia').val();
    const horas_vuelo = $('#horas_vuelo').val();
    const empleado_id = $('#empleado_id').val();
    const estatus = $('#estatus').val();

    try {

        const datos = new FormData();
        datos.append('licencia', licencia);
        datos.append('tipo_licencia', tipo_licencia);
        datos.append('vence_licencia', vence_licencia);
        datos.append('horas_vuelo', horas_vuelo);
        datos.append('empleado_id', empleado_id);
        datos.append('estatus', estatus);

        const respuesta = await fetch('crear/piloto', {
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
                traePilotos();
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

async function actualizarPiloto() {

    const piloto_id = $('#piloto_id').val();
    const licencia = $('#licencia').val();
    const tipo_licencia = $('#tipo_licencia').val();
    const vence_licencia = $('#vence_licencia').val();
    const horas_vuelo = $('#horas_vuelo').val();
    const empleado_id = $('#empleado_id').val();
    const estatus = $('#estatus').val();

    try {

        const datos = new FormData();
        datos.append('piloto_id', piloto_id);
        datos.append('licencia', licencia);
        datos.append('tipo_licencia', tipo_licencia);
        datos.append('vence_licencia', vence_licencia);
        datos.append('horas_vuelo', horas_vuelo);
        datos.append('empleado_id', empleado_id);
        datos.append('estatus', estatus);

        const respuesta = await fetch('actualizar/piloto', {
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
                traePilotos();
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