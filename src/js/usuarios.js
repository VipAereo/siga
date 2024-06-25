
let gridOptions;

// Utilizando el Principio de Modularidad
$(function () {
    asignarEventos();
    inicializarPagina();
    configurarBotones();
});

function asignarEventos() {
    // Ocultar Listados
    $('.empleadoSearch').hide();
    $('.rolSearch').hide();

    document.addEventListener("keydown", e => {
        if (e.key === 'Escape') {
            cerrarVentana('.contenedor-altas', ['#formAltas']);
        }
    });

    // Lista Search
    document.getElementById("empleado_user").addEventListener("mousedown", async function (event) {
        event.preventDefault();
        $('.empleadoSearch').show();
        $('.inEmplSrch').focus()
        let data = await obtenerEmpleados();
        const listSearch = await mostrarListaSearch(data, '.empleadoSearch', 'empleado_id', 'nombre');
    });

    // Lista Roles
    document.getElementById("rol_user").addEventListener("mousedown", async function (event) {
        event.preventDefault();
        $('.rolSearch').show();
        $('.inRollSrch').focus()
        let data = await obtenerRoles();
        const listSearch = await mostrarListaSearch(data, '.rolSearch', 'rol_id', 'nombre_rol');
    });

}

function configurarBotones() {
    // Ocultar altas
    $(".contenedor-altas").hide();
    $("#crear-usuario").click(mostrarContenedorAltas);

    $("#btnCancel").click(e => {
        limpiarForm("#formAltas");
        $(".contenedor-altas").hide();
    });

    $("#btnGuardar").click(e => {
        let validar = validateInputs($('#formAltas'));
        if (validar) $('#usuario_id').val() == '' ? crearUsuario() : actualizarUsuario();
    });

}

function inicializarPagina() {

    let columnDefs = [
        {
            headerName: 'id',
            field: 'usuario_id',
            width: 60
        },
        {
            headerName: 'Nombre Completo',
            field: 'nombre_completo',
            width: 150
        },
        {
            headerName: 'Usuario',
            field: 'nombre_user',
            width: 100,
        },
        {
            headerName: 'Empleado',
            field: 'empleado_nombre',
            width: 100
        },
        {
            headerName: 'Rol',
            field: 'rol_nombre',
            width: 120
        },
        {
            headerName: 'Estatus',
            field: 'estatus',
            width: 80
        },
        {
            headerName: 'Fecha Creación',
            field: 'fecha_creacion',
            width: 102,
            filter: 'agDateColumnFilter',

        },
        {
            headerName: 'Acción',
            cellRenderer: function (params) {
                // const editButton = document.createElement('button');
                const editButton = document.createElement('I');
                editButton.className = "fa-regular fa-pen-to-square btn btn-editar";
                editButton.title = 'Editar';

                editButton.addEventListener('click', async function () {
                    await mostrarContenedorAltas();

                    $('#usuario_id').val(params.data.usuario_id);
                    $('#nombre_completo').val(params.data.nombre_completo);
                    $('#nombre_user').val(params.data.nombre_user);
                    $('#password').val('none');
                    $('#estatus_user').val(params.data.estatus);

                    $('#rol_user option').val(params.data.rol_id);
                    $('#rol_user option').text(params.data.rol_nombre);

                    $('#empleado_user option').val(params.data.empleado_id);
                    $('#empleado_user option').text(params.data.empleado_nombre);
                    // console.log(params.data);
                });

                // Crea el botón de eliminación
                // const deleteButton = document.createElement('I');
                // deleteButton.className = "fa-regular fa-trash-can btn btnA-eliminar";
                // deleteButton.title = 'Eliminar';

                // deleteButton.addEventListener('click', function () {
                //     // Lógica para eliminar el usuario
                //     // console.log('Eliminar usuario', params.data);

                //     Swal.fire({
                //         title: 'Eliminar Registro?',
                //         text: "Los datos seran borrados permanentemente.",
                //         icon: 'warning',
                //         showCancelButton: true,
                //         confirmButtonColor: '#3085d6',
                //         cancelButtonColor: '#d33',
                //         cancelButtonText: 'Eliminar',
                //         confirmButtonText: 'Cancelar',
                //         allowOutsideClick: false,
                //         allowEscapeKey: false,
                //     }).then((result) => {
                //         console.log(result);
                //         if (result.isDismissed) {
                //             eliminarUser(params.data);
                //         }
                //     });
                // });

                // Crea un contenedor para los botones y los agrega
                const actionContainer = document.createElement('div');
                actionContainer.classList = "btn-cont centrado";
                actionContainer.appendChild(editButton);
                // actionContainer.appendChild(deleteButton);

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
    traerUsuarios();
}

/*  FUNCIONES  */
function onQuickFilterChanged() {
    var newValue = document.getElementById('quickFilter').value;
    gridApi.updateGridOptions({ quickFilterText: newValue });
}

async function traerUsuarios() {

    try {
        const respuesta = await fetch('/obtener/usuarios', {
            method: 'GET',
        });
        const data = await respuesta.json();
        // console.log(data);

        const nombresUsuarios = data.map(usuario => {
            return { nombre_user: usuario.nombre_user };
        });

        let convert = verificarArray (data);
        gridApi.setGridOption('rowData', convert);

        // Inicializar DataTable
        // $('#myTable').DataTable({
        //     data: nombresUsuarios,
        //     columns: [
        //         { title: 'id',data: 'nombre_user' },
        //         { title: 'Nombre de Usuario',data: 'nombre_user' },
        //         { title: 'Nombre Completo',data: 'nombre_user' },
        //         { title: 'Empleado',data: 'nombre_user' },
        //         { title: 'Contraseña',data: 'nombre_user' },
        //         { title: 'Estatus',data: 'nombre_user' },
        //         { title: 'Rol',data: 'nombre_user' },
        //     ]
        // });

    } catch (error) {
        console.error(error);
        SwalToast('warning', 'Error al obtener los usuarios', 2500);
    }
}

async function mostrarContenedorAltas() {
    $(".contenedor-altas").show();
    await obtenerEmpleados();
    await obtenerRoles();
}

async function crearUsuario() {

    const nombre_completo = $('#nombre_completo').val();
    const nombre_user = $('#nombre_user').val();
    const password = $('#password').val();
    const estatus = $('#estatus_user').val();
    const empleado_id = $('#empleado_user').val();
    const rol_id = $('#rol_user').val();

    // CREAR REGISTRO
    try {
        const datos = new FormData();
        datos.append('nombre_completo', nombre_completo);
        datos.append('nombre_user', nombre_user);
        datos.append('password', password);
        datos.append('estatus', estatus);
        datos.append('empleado_id', empleado_id);
        datos.append('rol_id', rol_id);

        const respuesta = await fetch('crear/usuario', {
            method: 'POST',
            body: datos
        });

        const data = await respuesta.json();

        if (data.exito == 1) {
            // Registro Creado Exitosamente
            SwalLoad('success', 'Éxito', 'Usuario Creado Correctamente', false);
            setTimeout(() => {
                swal.close();
                cerrarVentana('.contenedor-altas', ['#formAltas']);
                traerUsuarios();
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

async function actualizarUsuario() {

    const userId = $('#usuario_id').val();
    const nombre_completo = $('#nombre_completo').val();
    const nombre_user = $('#nombre_user').val();
    const password = $('#password').val();
    const estatus = $('#estatus_user').val();
    const empleadoId = $('#empleado_user').val();
    const rolId = $('#rol_user').val();


    try {

        const datos = new FormData();
        datos.append('usuario_id', userId);
        datos.append('nombre_completo', nombre_completo);
        datos.append('nombre_user', nombre_user);
        datos.append('password', password);
        datos.append('estatus', estatus);
        datos.append('empleado_id', empleadoId);
        datos.append('rol_id', rolId);

        const respuesta = await fetch('actualizar/usuario', {
            method: 'POST',
            body: datos
        });
        const data = await respuesta.json();

        if (data.exito == 1) {
            // Registro Creado Actualizado
            SwalLoad('success', 'Éxito', 'Usuario Actualizado Correctamente', false);
            setTimeout(() => {
                swal.close();
                cerrarVentana('.contenedor-altas', ['#formAltas']);
                traerUsuarios();
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
        SwalLoad('error', 'Ocurrio Un Error', 'Conección Perdida a BD.', false);
    }
}

async function obtenerEmpleados() {

    try {
        const respuesta = await fetch('empleados/activos', {
            method: 'GET'
        });
        const data = await respuesta.json();
        // console.log(data);

        if (!data.length > 0) SwalToast('warning', 'No hay Empleados disponibles.', 2500);

        return data;
    } catch (error) {
        console.error(error);
        SwalLoad('error', 'Ocurrio Un Error', 'Conección Perdida a BD.', false);
    }
}

async function obtenerRoles() {
    try {
        const respuesta = await fetch('roles/activos', {
            method: 'GET'
        });
        const data = await respuesta.json();
        // console.log(data);

        if (!data.length > 0) SwalToast('warning', 'No hay Roles disponibles.', 2500);

        return data;
    } catch (error) {
        console.error(error);
        SwalLoad('error', 'Ocurrio Un Error', 'Conección Perdida a BD.', false);
    }
}

async function eliminarUser(params) {

    try {

        const datos = new FormData();
        datos.append('usuario_id', params.usuario_id);

        const respuesta = await fetch('eliminar/usuario', {
            method: 'POST',
            body: datos
        });
        const data = await respuesta.json();

        if (data.exito == 1) {
            // Registro Creado Exitosamente
            SwalLoad('success', 'Eliminado', 'Registro Eliminado Correctamente', false);
            setTimeout(() => {
                swal.close();
                traerUsuarios();
            }, 1500);
        }
        if (data.alertas) {
            SwalToast('warning', data.alertas.error, 2500);
        }

    } catch (error) {
        console.error(error);
        SwalLoad('error', 'Ocurrio Un Error', 'Conección Perdida a BD.', false);
    }

}
