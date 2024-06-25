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
            cerrarVentana('.contenedor-altas', ['#formAltas']);
        }
    });
}

function configurarBotones() {
    $(".contenedor-altas").hide();

    $("#crear-departamento").click(mostrarContenedorAltas);

    $("#btnCancel").click(e => {
        limpiarForm("#formAltas");
        $(".contenedor-altas").hide();
    });

    $("#btnGuardar").click(e => {
        let validar = validateInputs($('#formAltas'));
        if (validar) $('#departamento_id').val() == '' ? crearDepa() : actualizarDepa();
    });
}

function inicializarPagina() {

    let columnDefs = [
        {
            headerName: 'id',
            field: 'departamento_id',
            width: 80
        },
        {
            headerName: 'Nombre',
            field: 'nombre',
            width: 150
        },
        {
            headerName: 'Estatus',
            field: 'estatus',
            width: 100
        },
        {
            headerName: 'Fecha de Creación',
            field: 'fecha_creacion',
            width: 160
        },
        {
            headerName: 'Acción',
            cellRenderer: function (params) {
                const editButton = document.createElement('I');
                editButton.className = "fa-regular fa-pen-to-square btn btn-editar";
                editButton.title = 'Editar';

                editButton.addEventListener('click', async function () {
                    await mostrarContenedorAltas();

                    $('#departamento_id').val(params.data.departamento_id);
                    $('#nombre').val(params.data.nombre);
                    $('#estatus').val(params.data.estatus);

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
    traerDepartamentos();
}

async function traerDepartamentos() {

    try {
        const respuesta = await fetch('allDepartamentos', {
            method: 'GET',
        });
        const data = await respuesta.json();

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

async function crearDepa() {

    const nombre = $('#nombre').val();
    const estatus = $('#estatus').val();

    try {
        const datos = new FormData();
        datos.append('nombre', nombre);
        datos.append('estatus', estatus);

        const respuesta = await fetch('crear/departamento', {
            method: 'POST',
            body: datos
        });

        const data = await respuesta.json();

        if (data.exito == 1) {
            // Registro Creado Exitosamente
            SwalLoad('success', 'Éxito', 'Departamento Creado Correctamente', false);
            setTimeout(() => {
                swal.close();
                cerrarVentana('.contenedor-altas', ['#formAltas']);
                traerDepartamentos();
            }, 1500);
        } else if (data.exito == 0) {
            SwalLoad('error', 'Error en la Transacción', data.errorSMS, true);
        }
        if (data.alertas) {
            SwalToast('warning', data.alertas.error, 2500);
            cerrarVentana('.contenedor-altas', ['#formAltas']);
        }

    } catch (error) {
        console.error(error);
        SwalLoad('error', 'Error en la Conexión', 'Comunicate con el Administrador', false);
    }
}

async function actualizarDepa() {

    const departamento_id = $('#departamento_id').val();
    const nombre = $('#nombre').val();
    const estatus = $('#estatus').val();

    try {

        const datos = new FormData();
        datos.append('departamento_id', departamento_id);
        datos.append('nombre', nombre);
        datos.append('estatus', estatus);

        const respuesta = await fetch('actualizar/departamento', {
            method: 'POST',
            body: datos
        });
        const data = await respuesta.json();

        if (data.exito == 1) {
            // Registro Creado Exitosamente
            SwalLoad('success', 'Éxito', 'Departamento Actualizado Correctamente', false);
            setTimeout(() => {
                swal.close();
                cerrarVentana('.contenedor-altas', ['#formAltas']);
                traerDepartamentos();
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
