let gridOptions;
let ROLES_ACTIVOS = '';

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

    $("#btnCancel").click(e => {
        resetearTabla('#myGrid2', '#searchInput1');
        limpiarForm("#formAltas");
        $(".contenedor-altas").hide();
    });

    $("#btnGuardar").click(e => {
        let dataGrid = getDataFromGrid();
        let datosInsertar = ROLES_ACTIVOS.filter(function (item1) {
            let unionArrays = dataGrid.find(function (item2) {
                return item1.programa_id === item2.programa_id && item1.nombre === item2.nombre;
            });
            return unionArrays && !item1.rel && unionArrays.relacion;
        });
        let datosEliminar = ROLES_ACTIVOS.filter(function (item1) {
            let unionArrays = dataGrid.find(function (item2) {
                return item1.programa_id === item2.programa_id && item1.nombre === item2.nombre;
            });
            return unionArrays && item1.rel && !unionArrays.relacion;
        });

        if (datosInsertar.length > 0) crearRelacion(datosInsertar);
        if (datosEliminar.length > 0) eliminarRelacion(datosEliminar);

    });
}

function inicializarPagina() {

    let columnDefs = [
        {
            headerName: 'id',
            field: 'rol_id',
            width: 80
        },
        {
            headerName: 'Rol',
            field: 'nombre_rol',
            width: 400
        },
        {
            headerName: 'Acción',
            cellRenderer: function (params) {
                // Btn Editar
                const editButton = document.createElement('I');
                editButton.className = "fa-regular fa-pen-to-square btn btn-editar";
                editButton.title = 'Editar';

                editButton.addEventListener('click', async function () {
                    $("#rol-title").text(`Rol - ${params.data.nombre_rol}`);
                    $('#rol_id').val(params.data.rol_id);

                    await mostrarContenedorAltas(params.data.rol_id);

                    function keydownListener(e) {
                        if (e.key === 'Escape') {
                            resetearTabla('#myGrid2', '#searchInput1');

                            // Eliminar el event listener después de usarlo
                            document.removeEventListener("keydown", keydownListener);
                        }
                    }
                    document.addEventListener("keydown", keydownListener);
                });

                // Crea un contenedor para los botones y los agrega
                const actionContainer = document.createElement('div');
                actionContainer.classList = "btn-cont centrado";
                actionContainer.appendChild(editButton);

                return actionContainer;
            },
            width: 160,
            headerClass: 'txt-center',
            cellClass: 'custom-action-cell', // Agregar la clase CSS 'custom-action-cell' a todas las celdas en esta columna
            filter: false
        },
    ];
    let data = '';
    iniciarTabla(data, columnDefs, '#myGrid');
    traerProgRoles();
}

/*  FUNCIONES  */
async function traerProgRoles() {

    try {
        const respuesta = await fetch('roles/activos', {
            method: 'GET',
        });
        const data = await respuesta.json();
        // console.log(data);

        let convert = verificarArray(data);
        gridApi.setGridOption('rowData', convert);

    } catch (error) {
        console.error(error);
        SwalToast('warning', 'Error al obtener los usuarios', 2500);
    }
}

async function mostrarContenedorAltas(id_rol) {
    $(".contenedor-altas").show();

    let columnDefs = [
        {
            headerName: 'id',
            field: 'programa_id',
            width: 80
        },
        {
            headerName: 'nombre',
            field: 'nombre',
            width: 400
        },
        {
            headerName: 'Selección',
            field: 'relacion',
            width: 150,
            editable: true,
            cellRenderer: 'agCheckboxCellRenderer',
            cellEditor: 'agCheckboxCellEditor',
        },
    ];

    let data = '';
    iniciarTabla(data, columnDefs, '#myGrid2');
    obtenerRelaciones(id_rol);
}

async function obtenerRelaciones(id_rol) {

    try {
        const datos = new FormData();
        datos.append('rol_id', id_rol);

        const respuesta = await fetch('progRole/relaciones', {
            method: 'POST',
            body: datos
        });
        const data = await respuesta.json();
        // console.log(data);

        ROLES_ACTIVOS = data.map(item => ({
            programa_id: item.programa_id,
            nombre: item.nombre,
            relacion: item.relacion
        }));

        let convert = verificarArray(data);
        gridApi.setGridOption('rowData', convert);

    } catch (error) {
        console.error(error);
        SwalToast('warning', 'Error al obtener los usuarios', 2500);
    }

}

async function crearRelacion(datosInsertar) {

    let rol_id = $("#rol_id").val()

    try {
        const datos = new FormData();
        datos.append('rol_id', rol_id);
        datos.append('datosInsertar', JSON.stringify(datosInsertar));

        const respuesta = await fetch('crear/progRoles', {
            method: 'POST',
            body: datos
        });

        const data = await respuesta.json();
        // console.log(data);
        // Registro Creado Exitosamente
        if (data.exito == 1) {
            SwalLoad('success', 'Éxito', 'Relación Creada Correctamente', false);
            setTimeout(() => {
                swal.close();
                obtenerRelaciones(rol_id);
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

async function eliminarRelacion(datosEliminar) {

    let rol_id = $("#rol_id").val();

    try {

        const datos = new FormData();
        datos.append('rol_id', rol_id);
        datos.append('datosEliminar', JSON.stringify(datosEliminar));

        const respuesta = await fetch('eliminar/progRoles', {
            method: 'POST',
            body: datos
        });

        const data = await respuesta.json();

        if (data.exito == 1) {
            SwalLoad('success', 'Éxito', 'Relación Eliminada Correctamente', false);
            setTimeout(() => {
                swal.close();
                obtenerRelaciones(rol_id);
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