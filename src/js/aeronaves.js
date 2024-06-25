let gridOptions;

// Utilizando el Principio de Modularidad
$(function () {
    asignarEventos();
    inicializarPagina();
    configurarBotones();
});

function asignarEventos() {
    document.addEventListener("keydown", e => {
        if (e.key === 'Escape') {
            resetFormAeronave();
        }
    });

    aplicarMascaraKm('ktas');
}

function configurarBotones() {
    $(".contenedor-altas").hide();
    $("#crear-aeronave").click(mostrarContenedorAltas);

    $(".btn-cancelar").click(e => {
        resetFormAeronave();
    });

    $("#btnGuardar").click(e => {
        let validar = validateInputs($('#formAltas'));
        if (validar) $('#aeronave_id').val() == '' ? crearAeronave() : actualizarAeronave();
    });
}

// FUNCIONES
function inicializarPagina() {

    let columnDefs = [
        {
            headerName: 'id',
            field: 'aeronave_id',
            width: 80
        },
        {
            headerName: 'Número Serie',
            field: 'numero_serie',
            width: 120
        },
        {
            headerName: 'Modelo',
            field: 'modelo',
            width: 150
        },
        {
            headerName: 'Fabricante',
            field: 'fabricante',
            width: 100
        },
        {
            headerName: 'Matricula',
            field: 'matricula',
            width: 120
        },
        {
            headerName: 'asientos',
            field: 'asientos',
            width: 100
        },
        {
            headerName: 'Velocidad Máxima',
            field: 'ktas',
            width: 130
        },
        {
            headerName: 'Horas Vuelo',
            field: 'horas_vuelo',
            width: 120
        },
        {
            headerName: 'Estado Actual',
            field: 'estado_actual',
            width: 130
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

                    $('#aeronave_id').val(params.data.aeronave_id);
                    $('#modelo').val(params.data.modelo);
                    $('#ktas').val(params.data.ktas);
                    $('#matricula').val(params.data.matricula);
                    $('#fabricante').val(params.data.fabricante);
                    $('#numero_serie').val(params.data.numero_serie);
                    $('#anio_fabricante').val(params.data.anio_fabricante);
                    $('#asientos').val(params.data.asientos);
                    $('#ultima_revision').val(params.data.ultima_revision);
                    $('#horas').val(params.data.horas);
                    $('#estado_actual').val(params.data.estado_actual);
                    $('#fecha_retiro').val(params.data.fecha_retiro);

                    
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
    traerAeronaves();
}

async function traerAeronaves() {
    try {
        const respuesta = await fetch('allAeronaves', {
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

async function mostrarContenedorAltas() {
    $(".contenedor-altas").show();
}

function resetFormAeronave() {
    cerrarVentana('.contenedor-altas', ['#formAltas']);
}

async function crearAeronave() {

    const modelo = $('#modelo').val();
    const ktas = $('#ktas').val();
    const matricula = $('#matricula').val();
    const fabricante = $('#fabricante').val();
    const numero_serie = $('#numero_serie').val();
    const anio_fabricante = $('#anio_fabricante').val();
    const asientos = $('#asientos').val();
    const ultima_revision = $('#ultima_revision').val();
    const horas = $('#horas').val();
    const estado_actual = $('#estado_actual').val();
    const fecha_retiro = $('#fecha_retiro').val();

    try {

        const datos = new FormData();
        datos.append('modelo', modelo);
        datos.append('ktas', ktas);
        datos.append('matricula', matricula);
        datos.append('fabricante', fabricante);
        datos.append('numero_serie', numero_serie);
        datos.append('anio_fabricante', anio_fabricante);
        datos.append('asientos', asientos);
        datos.append('ultima_revision', ultima_revision);
        datos.append('horas', horas);
        datos.append('estado_actual', estado_actual);
        datos.append('fecha_retiro', fecha_retiro);

        const respuesta = await fetch('crear/aeronave', {
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
                resetFormAeronave();
                traerAeronaves();
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

async function actualizarAeronave() {

    const aeronave_id = $('#aeronave_id').val();
    const modelo = $('#modelo').val();
    const ktas = $('#ktas').val();
    const matricula = $('#matricula').val();
    const fabricante = $('#fabricante').val();
    const numero_serie = $('#numero_serie').val();
    const anio_fabricante = $('#anio_fabricante').val();
    const asientos = $('#asientos').val();
    const ultima_revision = $('#ultima_revision').val();
    const horas = $('#horas').val();
    const estado_actual = $('#estado_actual').val();
    const fecha_retiro = $('#fecha_retiro').val();

    try {

        const datos = new FormData();
        datos.append('aeronave_id', aeronave_id);
        datos.append('modelo', modelo);
        datos.append('ktas', ktas);
        datos.append('matricula', matricula);
        datos.append('fabricante', fabricante);
        datos.append('numero_serie', numero_serie);
        datos.append('anio_fabricante', anio_fabricante);
        datos.append('asientos', asientos);
        datos.append('ultima_revision', ultima_revision);
        datos.append('horas', horas);
        datos.append('estado_actual', estado_actual);
        datos.append('fecha_retiro', fecha_retiro);

        const respuesta = await fetch('actualizar/aeronave', {
            method: 'POST',
            body: datos
        });

        const data = await respuesta.json();

        if (data.exito == 1) {
            // Registro Creado Exitosamente
            SwalLoad('success', 'Éxito', 'Registro Actualizado Correctamente', false);
            setTimeout(() => {
                swal.close();
                resetFormAeronave();
                traerAeronaves();
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
