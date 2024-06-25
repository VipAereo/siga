let gridOptions;
let currentStep = 1;

// Utilizando el Principio de Modularidad
$(function () {
    asignarEventos();
    inicializarPagina();
    configurarBotones();
});

function asignarEventos() {
    // Ocultar Listados
    $('.empresaSearch').hide();
    $('.prefSearch').hide();

    document.addEventListener("keydown", e => {
        if (e.key === 'Escape') {
            resetForm();
        }
    });
 
    // Lista Preferencia
    document.getElementById("preferencia_id").addEventListener("mousedown", async function (event) {
        event.preventDefault();
        $('.prefSearch').show();
        $('.inPrefSrch').focus();
        let data = await obtenerPreferencia();
        const listSearch = await mostrarListaSearch(data, '.prefSearch', 'tipo_id', 'nombre');
    });
}

function configurarBotones() {
    $(".contenedor-altas").hide();

    $("#crear-cliente").click(mostrarContenedorAltas);

    $(".btn-next").click(function (e) {
        e.preventDefault(); // Prevenir el comportamiento predeterminado del botón  

        // validar inputs del paso 1 para poder avanzar 
        let validar;

        if (currentStep == 1) {
            validar = validateInputs($('#cliente_form-personal'));
        }

        if (currentStep == 2) {
            validar = validateInputs($('#cliente_form-contacto'));
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

    $(".btnCancel").click(e => {
        resetForm();
    });

    $("#btnGuardar").click(e => {
        let validar = validateInputs($('#cliente_form-fiscal'));

        if (validar) $('#cliente_id').val() == '' ? crearCliente() : actualizarCliente();
    });

    updateActiveClass();
    updateRemoveClass();
}

function inicializarPagina() {

    let columnDefs = [
        {
            headerName: 'id',
            field: 'cliente_id',
            width: 80
        },
        {
            headerName: 'Nombre',
            field: 'nombre',
            width: 180
        },
        {
            headerName: 'Email',
            field: 'email',
            width: 150
        },
        {
            headerName: 'Télefono',
            field: 'telefono',
            width: 150
        },
        {
            headerName: 'Rfc',
            field: 'rfc',
            width: 130
        },
        {
            headerName: 'Ciudad',
            field: 'ciudad',
            width: 120
        },
        {
            headerName: 'Tarifa',
            field: 'tipo_nombre',
            width: 120
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

                    $('#cliente_id').val(params.data.cliente_id);
                    $('#nombre').val(params.data.nombre);
                    $('#apellido').val(params.data.apellido);
                    $('#sexo').val(params.data.sexo);
                    $('#fecha_nacimiento').val(params.data.fecha_nacimiento);
                    $('#estatus').val(params.data.estatus);
                    $('#email').val(params.data.email);
                    $('#telefono').val(params.data.telefono);
                    $('#pais').val(params.data.pais);
                    $('#ciudad').val(params.data.ciudad);
                    $('#codigo_postal').val(params.data.codigo_postal);
                    $('#estado').val(params.data.estado);
                    $('#colonia').val(params.data.colonia);
                    $('#calle').val(params.data.calle);
                    $('#num_ext').val(params.data.num_ext);
                    $('#num_int').val(params.data.num_int);
                    $('#rfc').val(params.data.rfc);
                    $('#curp').val(params.data.curp);
                    $('#regimen_fiscal').val(params.data.regimen_fiscal);
                    $('#razon_social').val(params.data.razon_social);

                    $('#preferencia_id option').val(params.data.tarifa_id);
                    $('#preferencia_id option').text(params.data.tipo_nombre);
 
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
    traeClientes();
}

// FUNCIONES
function resetForm() {
    cerrarVentana('.contenedor-altas', ['#cliente_form-personal', '#cliente_form-contacto', '#cliente_form-fiscal']);
    $(".altas_pasos p").removeClass("pasoActivo circle-check");
    $("#paso1").show();
    $("#paso2").hide();
    $("#paso3").hide();
    $(".paso1 p").addClass("pasoActivo");
    currentStep = 1;
    updateRemoveClass();
    updateActiveClass();
}
async function mostrarContenedorAltas() {
    $(".contenedor-altas").show();
    await obtenerEmpresas();
}
function updateActiveClass() {
    $(".empleado_pasos p").removeClass("pasoActivo");

    if (currentStep === 1) {
        $(".paso1 p").addClass("pasoActivo");
        $(".btn-guardar").addClass("hidden");
        $(".btn-next").removeClass("hidden");
    } else if (currentStep === 2) {
        $(".paso2 p").addClass("pasoActivo");
        $(".paso1 p").addClass("circle-check");
        $(".btn-prev").removeClass("invisible");
    } else if (currentStep === 3) {
        $(".paso3 p").addClass("pasoActivo");
        $(".paso2 p").addClass("circle-check");
        $(".btn-next").addClass("hidden");
        $(".btn-guardar").removeClass("hidden");
    }
}
function updateRemoveClass() {

    $(".empleado_pasos p").removeClass("circle-check");

    if (currentStep === 1) {
        $(".paso1 p").addClass("pasoActivo");
        $(".paso2 p").removeClass("pasoActivo");
        $(".btn-prev").addClass("invisible");
    } else if (currentStep === 2) {
        $(".paso1 p").addClass("circle-check");
        $(".paso2 p").addClass("pasoActivo");
        $(".paso3 p").removeClass("pasoActivo");
        $(".btn-next").removeClass("hidden");
        $(".btn-guardar").addClass("hidden");
    }
}
async function traeClientes() {
    try {
        const respuesta = await fetch('allClientes', {
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
async function obtenerEmpresas() {
    try {
        const respuesta = await fetch('brokers/activas', {
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
async function obtenerPreferencia() {
    try {
        const respuesta = await fetch('tarifa/tipo', {
            method: 'GET'
        });
        const data = await respuesta.json();

        if (!data.length > 0) SwalToast('warning', 'No hay Tarifas disponibles.', 2500);

        return data;
    } catch (error) {
        console.error(error);
        SwalLoad('error', 'Ocurrio Un Error', 'Conección Perdida a BD.', false);
    }
}
async function crearCliente() {

    const nombre = $('#nombre').val();
    const apellido = $('#apellido').val();
    const sexo = $('#sexo').val();
    const fecha_nacimiento = $('#fecha_nacimiento').val();
    const estatus = $('#estatus').val();
    const preferencia_id = $('#preferencia_id').val();
    const email = $('#email').val();
    const telefono = $('#telefono').val();
    const pais = $('#pais').val();
    const ciudad = $('#ciudad').val();
    const codigo_postal = $('#codigo_postal').val();
    const estado = $('#estado').val();
    const colonia = $('#colonia').val();
    const calle = $('#calle').val();
    const num_ext = $('#num_ext').val();
    const num_int = $('#num_int').val();
    const rfc = $('#rfc').val();
    const curp = $('#curp').val();
    const regimen_fiscal = $('#regimen_fiscal').val();
    const razon_social = $('#razon_social').val();
 
    try {

        const datos = new FormData();
        datos.append('nombre', nombre);
        datos.append('apellido', apellido);
        datos.append('sexo', sexo);
        datos.append('fecha_nacimiento', fecha_nacimiento);
        datos.append('estatus', estatus);
        datos.append('tarifa_id', preferencia_id);
        datos.append('email', email);
        datos.append('telefono', telefono);
        datos.append('pais', pais);
        datos.append('ciudad', ciudad);
        datos.append('codigo_postal', codigo_postal);
        datos.append('estado', estado);
        datos.append('colonia', colonia);
        datos.append('calle', calle);
        datos.append('num_ext', num_ext);
        datos.append('num_int', num_int);
        datos.append('rfc', rfc);
        datos.append('curp', curp);
        datos.append('regimen_fiscal', regimen_fiscal);
        datos.append('razon_social', razon_social);
 
        const respuesta = await fetch('crear/cliente', {
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
                traeClientes();
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
async function actualizarCliente() {

    const cliente_id = $('#cliente_id').val();
    const nombre = $('#nombre').val();
    const apellido = $('#apellido').val();
    const sexo = $('#sexo').val();
    const fecha_nacimiento = $('#fecha_nacimiento').val();
    const estatus = $('#estatus').val();
    const preferencia_id = $('#preferencia_id').val();
    const email = $('#email').val();
    const telefono = $('#telefono').val();
    const pais = $('#pais').val();
    const ciudad = $('#ciudad').val();
    const codigo_postal = $('#codigo_postal').val();
    const estado = $('#estado').val();
    const colonia = $('#colonia').val();
    const calle = $('#calle').val();
    const num_ext = $('#num_ext').val();
    const num_int = $('#num_int').val();
    const rfc = $('#rfc').val();
    const curp = $('#curp').val();
    const regimen_fiscal = $('#regimen_fiscal').val();
    const razon_social = $('#razon_social').val();
 
    try {

        const datos = new FormData();
        datos.append('cliente_id', cliente_id);
        datos.append('nombre', nombre);
        datos.append('apellido', apellido);
        datos.append('sexo', sexo);
        datos.append('fecha_nacimiento', fecha_nacimiento);
        datos.append('estatus', estatus);
        datos.append('tarifa_id', preferencia_id);
        datos.append('email', email);
        datos.append('telefono', telefono);
        datos.append('pais', pais);
        datos.append('ciudad', ciudad);
        datos.append('codigo_postal', codigo_postal);
        datos.append('estado', estado);
        datos.append('colonia', colonia);
        datos.append('calle', calle);
        datos.append('num_ext', num_ext);
        datos.append('num_int', num_int);
        datos.append('rfc', rfc);
        datos.append('curp', curp);
        datos.append('regimen_fiscal', regimen_fiscal);
        datos.append('razon_social', razon_social);
 
        const respuesta = await fetch('actualizar/cliente', {
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
                traeClientes();
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