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
    // Evento Crear Usuarios
    $(".contenedor-altas").hide();
    $("#crear-rol").click(mostrarContenedorAltas);

    $("#btnCancel").click(e => {
        limpiarForm("#formAltas");
        $(".contenedor-altas").hide();
    });
    $("#btnGuardar").click(e => {
        let validar = validateInputs($('#formAltas'));
        if (validar) $('#rol_id').val() == '' ? crearRol() : actualizarRol();
    });
}

function inicializarPagina() {
    let columnDefs = [
        {
            headerName: 'id',
            field: 'rol_id',
            width: 60
        },
        {
            headerName: 'Nombre Rol',
            field: 'nombre_rol',
            width: 200
        },
        {
            headerName: 'Descripción',
            field: 'descripcion',
            width: 200
        },
        {
            headerName: 'Estatus',
            field: 'estatus',
            width: 100
        },
        {
            headerName: 'Fecha Creacion',
            field: 'fecha_creacion',
            width: 180
        },
        {
            headerName: 'Acción',
            cellRenderer: function (params) {
                const editButton = document.createElement('I');
                editButton.className = "fa-regular fa-pen-to-square btn btn-editar";
                editButton.title = 'Editar';

                editButton.addEventListener('click', async function () {
                    await mostrarContenedorAltas();

                    $('#rol_id').val(params.data.rol_id);
                    $('#nombre_rol').val(params.data.nombre_rol);
                    $('#descripcion').val(params.data.descripcion);
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
    traerRoles();
}

/*  FUNCIONES  */
function onQuickFilterChanged() {
    var newValue = document.getElementById('quickFilter').value;
    gridApi.updateGridOptions({ quickFilterText: newValue });
}

async function traerRoles() {

    try {
        const respuesta = await fetch('allRoles', {
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

async function generarCrearUser(tipoAccion, params) {

    Swal.fire({
        title: tipoAccion + ' Rol',
        html: `
            <div class="user-contenedor">
                <div class="alertas"></div>
                <div class="form-dsg">

                    <div class="form-group">
                        <input type="text" id="nombre_rol" placeholder="">
                        <label for="nombre_rol">Nombre Rol:</label>
                    </div>
                    <div class="form-group">
                        <input type="text" id="descripcion" placeholder="">
                        <label for="descripcion">Descripción:</label>
                    </div>

                    <div class="form-group">
                        <select name="estatus" id="estatus" >
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                            
                        </select>
                        <label for="estatus">Estatus:</label>
                    </div>

                </div>
            </div>
            `,
        showDenyButton: true,
        confirmButtonText: 'Guardar',
        denyButtonText: `Cancelar`,
        customClass: "swalTitle crear-usuario",
        allowOutsideClick: false,
        preConfirm: () => {
            const nombreRol = $('#nombre_rol').val();
            const descripcion = $('#descripcion').val();
            const alertasDiv = document.querySelector('.alertas');

            alertasDiv.innerHTML = ''; // Limpiar alertas previas
            let errores = [];

            if (!nombreRol) {
                errores.push('Nombre Requerido');
            }
            if (!descripcion) {
                errores.push('Descripción Requerida');
            }

            if (errores.length > 0) {
                errores.forEach(alerta => {
                    alertasDiv.innerHTML += `<div class="alerta alerta_error" role="alert">${alerta}</div>`;
                });
                return false; // Evita que la ventana se cierre
            }
            return { nombreRol, descripcion };

        },
        didOpen: async () => {
            // ACTUALIZAR
            if (tipoAccion == 'Actualizar') {
                $('#nombre_rol').val(params.nombre_rol);
                $('#descripcion').val(params.descripcion);
                $('#estatus').val(params.estatus);
            }
        }
    }).then(async (result) => {
        console.log(result);
        if (tipoAccion == 'Crear') {
            if (result.isConfirmed) {

                const nombre_rol = $('#nombre_rol').val();
                const descripcion = $('#descripcion').val();
                const estatus = $('#estatus').val();

                const datos = new FormData();
                datos.append('nombre_rol', nombre_rol);
                datos.append('descripcion', descripcion);
                datos.append('estatus', estatus);

                try {
                    const respuesta = await fetch('crear/rol', {
                        method: 'POST',
                        body: datos
                    });

                    const data = await respuesta.json();

                    if (data.exito == 1) {
                        // Registro Creado Exitosamente
                        SwalLoad('success', 'Éxito', 'Rol Creado Correctamente', false);
                        setTimeout(() => {
                            swal.close();
                            traerRoles();
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
        } else if (tipoAccion == 'Actualizar') {
            if (result.isConfirmed) {

                const nombre_rol = $('#nombre_rol').val();
                const descripcion = $('#descripcion').val();
                const estatus = $('#estatus').val();

                const datos = new FormData();
                datos.append('rol_id', params.rol_id);
                datos.append('nombre_rol', nombre_rol);
                datos.append('descripcion', descripcion);
                datos.append('estatus', estatus);
                datos.append('fecha_creacion', params.fecha_creacion);

                try {

                    const respuesta = await fetch('actualizar/rol', {
                        method: 'POST',
                        body: datos
                    });
                    const data = await respuesta.json();

                    if (data.exito == 1) {
                        // Registro Creado Exitosamente
                        SwalLoad('success', 'Éxito', 'Rol Actualizado Correctamente', false);
                        setTimeout(() => {
                            swal.close();
                            traerRoles();
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
        } else {
            SwalToast('warning', 'Error, tipo de acción no definida.', 2500);
        }

    });
}

async function crearRol() {

    const nombre_rol = $('#nombre_rol').val();
    const descripcion = $('#descripcion').val();
    const estatus = $('#estatus').val();

    try {
        const datos = new FormData();
        datos.append('nombre_rol', nombre_rol);
        datos.append('descripcion', descripcion);
        datos.append('estatus', estatus);

        const respuesta = await fetch('crear/rol', {
            method: 'POST',
            body: datos
        });

        const data = await respuesta.json();

        if (data.exito == 1) {
            // Registro Creado Exitosamente
            SwalLoad('success', 'Éxito', 'Rol Creado Correctamente', false);
            setTimeout(() => {
                swal.close();
                cerrarVentana('.contenedor-altas', ['#formAltas']);
                traerRoles();
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

async function actualizarRol() {

    const rol_id = $('#rol_id').val();
    const nombre_rol = $('#nombre_rol').val();
    const descripcion = $('#descripcion').val();
    const estatus = $('#estatus').val();

    try {

        const datos = new FormData();
        datos.append('rol_id', rol_id);
        datos.append('nombre_rol', nombre_rol);
        datos.append('descripcion', descripcion);
        datos.append('estatus', estatus);

        const respuesta = await fetch('actualizar/rol', {
            method: 'POST',
            body: datos
        });
        const data = await respuesta.json();

        if (data.exito == 1) {
            // Registro Creado Exitosamente
            SwalLoad('success', 'Éxito', 'Rol Actualizado Correctamente', false);
            setTimeout(() => {
                swal.close();
                cerrarVentana('.contenedor-altas', ['#formAltas']);
                traerRoles();
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