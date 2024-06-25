let gridOptions;
let currentStep = 1;
configDropZone();

// Utilizando el Principio de Modularidad
$(function () {
    asignarEventos();
    inicializarPagina();
    configurarBotones();
});

function asignarEventos() {
    // Ocultar Listados
    $('.superSearch').hide();
    $('.depaSearch').hide();

    document.addEventListener("keydown", e => {
        if (e.key === 'Escape') {
            resetearFormularioEmpleados();
        }
    });
    
    // Lista Departamentos
    document.getElementById("departamento_id").addEventListener("mousedown", async function (event) {
        event.preventDefault();
        $('.depaSearch').show();
        $('.inDepaSrch').focus();
        let data = await obtenerDepartamentosAC();
        const listSearch = await mostrarListaSearch(data, '.depaSearch', 'departamento_id', 'nombre');
    });

    // Lista Supervisor
    document.getElementById("supervisor_id").addEventListener("mousedown", async function (event) {
        event.preventDefault();
        $('.superSearch').show();
        $('.inSuperSrch').focus();
        let data = await obtenerEmpleadosAC();
        const listSearch = await mostrarListaSearch(data, '.superSearch', 'empleado_id', 'nombre');
    });
}

function configurarBotones() {
    // Evento Crear Usuarios
    // Ocultar altas
    $(".contenedor-altas").hide();

    $("#crear-empleado").click(mostrarContenedorAltas);

    $(".btnCancel").click(e => {
        currentStep = 1;

        resetearFormularioEmpleados();
    });

    $(".btn-next").click(function (e) {
        e.preventDefault(); // Prevenir el comportamiento predeterminado del botón  

        // validar inputs del paso 1 para poder avanzar 
        let validar;

        if (currentStep == 1) {
            validar = validateInputs($('#empleado_formulario-personal'));
        }

        if (currentStep == 2) {
            validar = validateInputs($('#empleado_formulario-contacto'));
        }

        if (validar) {
            $("#paso" + currentStep).hide();
            currentStep++;
            $("#paso" + currentStep).show();

            updateActiveClass();
        }

    });

    $(".btn-prev").click(function (e) {
        e.preventDefault(); // Prevenir el comportamiento predeterminado del botón
        $("#paso" + currentStep).hide();
        currentStep--;
        $("#paso" + currentStep).show();
        updateRemoveClass();
    });

    $("#btnGuardar").click(e => {
        let validar = validateInputs($('#empleado_formulario-laboral'));
        if (validar) {
            $('#empleado_id').val() == '' ? crearUsuario() : actualizarUsuario();
        }
    });

    updateActiveClass();
    updateRemoveClass();
}

function inicializarPagina() {
    let columnDefs = [
        {
            headerName: 'id',
            field: 'empleado_id',
            width: 60
        },
        {
            headerName: 'No. Empleado',
            field: 'num_identificacion',
            width: 120
        },
        {
            headerName: 'Nombre',
            field: 'nombre',
            width: 130
        },
        {
            headerName: 'Apellido Paterno',
            field: 'apellido_paterno',
            width: 140
        },
        {
            headerName: 'Departamento',
            field: 'nombre_departamento',
            width: 130
        },
        {
            headerName: 'Estatus',
            field: 'estado_laboral',
            width: 100
        },
        {
            headerName: 'Correo',
            field: 'email',
            width: 150
        },
        {
            headerName: 'Teléfono Principal',
            field: 'tel_principal',
            width: 150
        },
        {
            headerName: 'Estado',
            field: 'estado',
            width: 150
        },
        {
            headerName: 'Fecha de Creación',
            field: 'fecha_creacion',
            width: 150
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

                    $('#empleado_id').val(params.data.empleado_id);
                    $('#nombre').val(params.data.nombre);
                    $('#apellido_paterno').val(params.data.apellido_paterno);
                    $('#apellido_materno').val(params.data.apellido_materno);
                    $('#fecha_nacimiento').val(params.data.fecha_nacimiento);
                    $('#sexo').val(params.data.sexo);
                    $('#curp').val(params.data.curp);
                    $('#rfc').val(params.data.rfc);
                    $('#email').val(params.data.email);
                    $('#tel_principal').val(params.data.tel_principal);
                    $('#tel_secundario').val(params.data.tel_secundario);
                    $('#estado').val(params.data.estado);
                    $('#municipio').val(params.data.municipio);
                    $('#colonia').val(params.data.colonia);
                    $('#calle').val(params.data.calle);
                    $('#num_exterior').val(params.data.num_exterior);
                    $('#num_interior').val(params.data.num_interior);
                    $('#codigo_postal').val(params.data.codigo_postal);
                    $('#estado_laboral').val(params.data.estado_laboral);
                    $('#num_identificacion').val(params.data.num_identificacion);
                    $('#nivel_academico').val(params.data.nivel_academico);

                    $('#departamento_id option').val(params.data.departamento_id);
                    $('#departamento_id option').text(params.data.nombre_departamento);

                    $('#supervisor_id option').val(params.data.supervisor_id);
                    $('#supervisor_id option').text(params.data.empleado_nombre);
                    // console.log(params.data);
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
    traerEmpleados();
}

/*  FUNCIONES  */
function onQuickFilterChanged() {
    var newValue = document.getElementById('quickFilter').value;
    gridApi.updateGridOptions({ quickFilterText: newValue });
}

function resetearFormularioEmpleados() {
    cerrarVentana('.contenedor-altas', ['#empleado_formulario-personal', '#empleado_formulario-contacto', '#empleado_formulario-laboral']);
    $(".altas_pasos p").removeClass("pasoActivo circle-check");
    $("#paso1").show();
    $("#paso2").hide();
    $("#paso3").hide();
    $(".paso1 p").addClass("pasoActivo");
    currentStep = 1;
}

async function mostrarContenedorAltas() {
    $(".contenedor-altas").show();
    await obtenerEmpleadosAC();
    await obtenerDepartamentosAC();
}

async function traerEmpleados() {
    try {
        const respuesta = await fetch('allEmpleados', {
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

async function obtenerEmpleadosAC() {
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
async function obtenerDepartamentosAC() {
    try {
        const respuesta = await fetch('departamentos/activos', {
            method: 'GET'
        });
        const data = await respuesta.json();
        // console.log(data);

        // let empleadoSelect = document.getElementById('departamento_id');
        // empleadoSelect.innerHTML = '';
        // // Añadir la opción en blanco como la primera opción
        // empleadoSelect.insertBefore(new Option('', ''), empleadoSelect.firstChild);

        // data.length > 0 ? data.forEach(empleado => {
        //     let option = document.createElement('option');
        //     option.value = empleado.departamento_id;
        //     option.textContent = empleado.nombre;
        //     empleadoSelect.appendChild(option);
        // }) : SwalToast('warning', 'No hay Departamentos disponibles.', 2500);

        if (!data.length > 0) SwalToast('warning', 'No hay Departamentos disponibles.', 2500);

        return data;
    } catch (error) {
        console.error(error);
        SwalLoad('error', 'Ocurrio Un Error', 'Conección Perdida a BD.', false);
    }
}
function updateActiveClass() {
    $(".empleado_pasos p").removeClass("pasoActivo");

    if (currentStep === 1) {
        $(".paso1 p").addClass("pasoActivo");
    } else if (currentStep === 2) {
        $(".paso2 p").addClass("pasoActivo");
        $(".paso1 p").addClass("circle-check");
    } else if (currentStep === 3) {
        $(".paso3 p").addClass("pasoActivo");
        $(".paso2 p").addClass("circle-check");
    }
}

function updateRemoveClass() {

    $(".empleado_pasos p").removeClass("circle-check");

    if (currentStep === 1) {
        $(".paso1 p").addClass("pasoActivo");
        $(".paso2 p").removeClass("pasoActivo");
    } else if (currentStep === 2) {
        $(".paso1 p").addClass("circle-check");
        $(".paso2 p").addClass("pasoActivo");
        $(".paso3 p").removeClass("pasoActivo");
    }
}

function configDropZone() {
    Dropzone.options.testing = {
        paramName: "file", // El nombre que se usará para transferir el archivo
        maxFiles: 1, // Limitar a una sola imagen
        maxFilesize: 6, // MB
        acceptedFiles: 'image/*', // Solo permitir archivos de tipo imagen
        init: function () {
            this.on("addedfile", function (file) {

                if (file.size > 6 * 1024 * 1024) { // Verificar si el tamaño del archivo supera 6MB
                    this.removeFile(file); // Eliminar el archivo del Dropzone
                }
                if (this.files.length > 1) {
                    this.removeFile(this.files[0]); // Si se añade más de un archivo, eliminar el primero
                }
                if (!file.type.startsWith('image/')) {
                    alert("Solo se admiten imágenes"); // Mostrar alerta si el archivo no es una imagen
                    this.removeFile(file); // Eliminar el archivo del Dropzone
                }
            });
        }
    };
}

async function crearUsuario() {

    const nombre = $('#nombre').val();
    const apellido_paterno = $('#apellido_paterno').val();
    const apellido_materno = $('#apellido_materno').val();
    const fecha_nacimiento = $('#fecha_nacimiento').val();
    const sexo = $('#sexo').val();
    const curp = $('#curp').val();
    const rfc = $('#rfc').val();
    const email = $('#email').val();
    const tel_principal = $('#tel_principal').val();
    const tel_secundario = $('#tel_secundario').val();
    const estado = $('#estado').val();
    const municipio = $('#municipio').val();
    const colonia = $('#colonia').val();
    const calle = $('#calle').val();
    const num_exterior = $('#num_exterior').val();
    const num_interior = $('#num_interior').val();
    const codigo_postal = $('#codigo_postal').val();
    const estado_laboral = $('#estado_laboral').val();
    const num_identificacion = $('#num_identificacion').val();
    const nivel_academico = $('#nivel_academico').val();
    const supervisor_id = $('#supervisor_id').val();
    const departamento_id = $('#departamento_id').val();
    const testing = $('#testing').val();
    

    try {

        const datos = new FormData();
        datos.append('nombre', nombre);
        datos.append('apellido_paterno', apellido_paterno);
        datos.append('apellido_materno', apellido_materno);
        datos.append('fecha_nacimiento', fecha_nacimiento);
        datos.append('sexo', sexo);
        datos.append('curp', curp);
        datos.append('rfc', rfc);
        datos.append('email', email);
        datos.append('tel_principal', tel_principal);
        datos.append('tel_secundario', tel_secundario);
        datos.append('estado', estado);
        datos.append('municipio', municipio);
        datos.append('colonia', colonia);
        datos.append('calle', calle);
        datos.append('num_exterior', num_exterior);
        datos.append('num_interior', num_interior);
        datos.append('codigo_postal', codigo_postal);
        datos.append('estado_laboral', estado_laboral);
        datos.append('num_identificacion', num_identificacion);
        datos.append('nivel_academico', nivel_academico);
        datos.append('supervisor_id', supervisor_id);
        datos.append('departamento_id', departamento_id);
        datos.append('testing', testing);

        const respuesta = await fetch('crear/empleado', {
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
                resetearFormularioEmpleados();
                traerEmpleados();
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

async function actualizarUsuario() {


    const empleado_id = $('#empleado_id').val();
    const nombre = $('#nombre').val();
    const apellido_paterno = $('#apellido_paterno').val();
    const apellido_materno = $('#apellido_materno').val();
    const fecha_nacimiento = $('#fecha_nacimiento').val();
    const sexo = $('#sexo').val();
    const curp = $('#curp').val();
    const rfc = $('#rfc').val();
    const email = $('#email').val();
    const tel_principal = $('#tel_principal').val();
    const tel_secundario = $('#tel_secundario').val();
    const estado = $('#estado').val();
    const municipio = $('#municipio').val();
    const colonia = $('#colonia').val();
    const calle = $('#calle').val();
    const num_exterior = $('#num_exterior').val();
    const num_interior = $('#num_interior').val();
    const codigo_postal = $('#codigo_postal').val();
    const estado_laboral = $('#estado_laboral').val();
    const num_identificacion = $('#num_identificacion').val();
    const nivel_academico = $('#nivel_academico').val();
    const supervisor_id = $('#supervisor_id').val();
    const departamento_id = $('#departamento_id').val();

    try {

        const datos = new FormData();
        datos.append('empleado_id', empleado_id);
        datos.append('nombre', nombre);
        datos.append('apellido_paterno', apellido_paterno);
        datos.append('apellido_materno', apellido_materno);
        datos.append('fecha_nacimiento', fecha_nacimiento);
        datos.append('sexo', sexo);
        datos.append('curp', curp);
        datos.append('rfc', rfc);
        datos.append('email', email);
        datos.append('tel_principal', tel_principal);
        datos.append('tel_secundario', tel_secundario);
        datos.append('estado', estado);
        datos.append('municipio', municipio);
        datos.append('colonia', colonia);
        datos.append('calle', calle);
        datos.append('num_exterior', num_exterior);
        datos.append('num_interior', num_interior);
        datos.append('codigo_postal', codigo_postal);
        datos.append('estado_laboral', estado_laboral);
        datos.append('num_identificacion', num_identificacion);
        datos.append('nivel_academico', nivel_academico);
        datos.append('supervisor_id', supervisor_id);
        datos.append('departamento_id', departamento_id);

        const respuesta = await fetch('actualizar/empleado', {
            method: 'POST',
            body: datos
        });
        const data = await respuesta.json();

        if (data.exito == 1) {
            // Registro Creado Exitosamente
            SwalLoad('success', 'Éxito', 'Registro Actualizado Correctamente', false);
            setTimeout(() => {
                swal.close();
                resetearFormularioEmpleados();
                traerEmpleados();
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