let gridOptions;
let currentStep = 1;

// Utilizando el Principio de Modularidad
$(function () {
    asignarEventos();
    inicializarPagina();
    configurarBotones();
});

function asignarEventos() {

    $('.prefSearch').hide();

    document.addEventListener("keydown", e => {
        if (e.key === 'Escape') {
            resetearFormularioBrokers();
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
    $("#crear-broker").click(mostrarContenedorAltas);

    $(".btn-next").click(function (e) {
        e.preventDefault(); // Prevenir el comportamiento predeterminado del botón  

        // validar inputs del paso 1 para poder avanzar 
        let validar;

        if (currentStep == 1) {
            validar = validateInputs($('#broker_formulario-broker'));
        }

        if (currentStep == 2) {
            validar = validateInputs($('#broker_formulario-contacto'));
        }

        if (validar) {
            $("#paso" + currentStep).hide();
            currentStep++;
            $("#paso" + currentStep).show();

            updateActiveClass();
        }

    });

    $(".btnCancel").click(e => {
        currentStep = 1;
        resetearFormularioBrokers();
    });

    $(".btn-prev").click(function (e) {
        e.preventDefault(); // Prevenir el comportamiento predeterminado del botón
        $("#paso" + currentStep).hide();
        currentStep--;
        $("#paso" + currentStep).show();
        updateRemoveClass();
    });

    $("#btnGuardar").click(e => {
        // let validar = validateInputs($('#altas-secciones'));
        let validar = validateInputs($('#broker_formulario-broker'));

        if (validar) {
            $('#broker_id').val() == '' ? crearBroker() : actualizarBroker();
        }
    });

    $('#comision').on("change", function () {
        $('.input-empr-desc').toggleClass("hidden", !this.checked);
        $('#descuento').val('');
    });

    updateActiveClass();
    updateRemoveClass();
}

// FUNCIONES
function inicializarPagina() {

    let columnDefs = [
        {
            headerName: 'id',
            field: 'broker_id',
            width: 60
        },
        {
            headerName: 'Siglas',
            field: 'siglas_empresa',
            width: 100
        },
        {
            headerName: 'Nombre',
            field: 'nombre',
            width: 150
        },
        {
            headerName: 'Teléfono',
            field: 'telefono',
            width: 120
        },
        {
            headerName: 'Email',
            field: 'email',
            width: 120
        },
        {
            headerName: 'Contacto',
            field: 'contacto_principal',
            width: 150
        },
        {
            headerName: 'Razón Social',
            field: 'razon_social',
            width: 120
        },
        {
            headerName: 'Dirección',
            field: 'calle',
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
                    $('#broker_id').val(params.data.broker_id);
                    $('#nombre').val(params.data.nombre);
                    $('#siglas_empresa').val(params.data.siglas_empresa);
                    $('#telefono').val(params.data.telefono);
                    $('#email').val(params.data.email);
                    $('#sitio_web').val(params.data.sitio_web);
                    $('#contacto_principal').val(params.data.contacto_principal);
                    $('#calle').val(params.data.calle);
                    $('#num_ext').val(params.data.num_ext);
                    $('#num_int').val(params.data.num_int);
                    $('#ciudad').val(params.data.ciudad);
                    $('#estado').val(params.data.estado);
                    $('#municipio').val(params.data.municipio);
                    $('#codigo_postal').val(params.data.codigo_postal);
                    $('#colonia').val(params.data.colonia);
                    $('#pais').val(params.data.pais);
                    $('#rfc').val(params.data.rfc);
                    $('#razon_social').val(params.data.razon_social);
                    $('#regimen_fiscal').val(params.data.regimen_fiscal);
                    $('#giro_comercial').val(params.data.giro_comercial);
                    $('#estatus').val(params.data.estatus);
                    if (params.data.ischecked == 1) {
                        $('#comision').prop('checked', true);
                        $('.input-empr-desc').removeClass("hidden");
                    } else {
                        $('#comision').prop('checked', false);
                    }
                    $('#descuento').val(params.data.descuento);

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
    traerBrokers();
}
async function mostrarContenedorAltas() {
    $(".contenedor-altas").show();
    aplicarMascaraCantidad('descuento');
}
async function traerBrokers() {
    try {
        const respuesta = await fetch('obtener/brokers', {
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
function resetearFormularioBrokers() {
    cerrarVentana('.contenedor-altas', ['#broker_formulario-broker', '#broker_formulario-contacto', '#broker_formulario-fiscal']);
    $(".altas_pasos p").removeClass("pasoActivo circle-check");
    $("#paso1").show();
    $("#paso2").hide();
    $("#paso3").hide();
    $(".paso1 p").addClass("pasoActivo");
    $('.input-empr-desc').addClass("hidden");
    currentStep = 1;
    updateRemoveClass();
    updateActiveClass();
}
async function crearBroker() {

    const nombre = $('#nombre').val();
    const siglas_empresa = $('#siglas_empresa').val();
    const telefono = $('#telefono').val();
    const email = $('#email').val();
    const sitio_web = $('#sitio_web').val();
    const contacto_principal = $('#contacto_principal').val();
    const calle = $('#calle').val();
    const num_ext = $('#num_ext').val();
    const num_int = $('#num_int').val();
    const ciudad = $('#ciudad').val();
    const estado = $('#estado').val();
    const municipio = $('#municipio').val();
    const codigo_postal = $('#codigo_postal').val();
    const colonia = $('#colonia').val();
    const pais = $('#pais').val();
    const rfc = $('#rfc').val();
    const razon_social = $('#razon_social').val();
    const regimen_fiscal = $('#regimen_fiscal').val();
    const giro_comercial = $('#giro_comercial').val();
    const estatus = $('#estatus').val();
    let comision = $('#comision').prop('checked') ? 1 : 0;
    const descuento = sinComa($('#descuento').val());
    const preferencia_id = $('#preferencia_id').val();
    

    try {
        const datos = new FormData();
        datos.append('nombre', nombre);
        datos.append('siglas_empresa', siglas_empresa);
        datos.append('telefono', telefono);
        datos.append('email', email);
        datos.append('sitio_web', sitio_web);
        datos.append('contacto_principal', contacto_principal);
        datos.append('calle', calle);
        datos.append('num_ext', num_ext);
        datos.append('num_int', num_int);
        datos.append('ciudad', ciudad);
        datos.append('estado', estado);
        datos.append('municipio', municipio);
        datos.append('codigo_postal', codigo_postal);
        datos.append('colonia', colonia);
        datos.append('pais', pais);
        datos.append('rfc', rfc);
        datos.append('razon_social', razon_social);
        datos.append('regimen_fiscal', regimen_fiscal);
        datos.append('giro_comercial', giro_comercial);
        datos.append('estatus', estatus);
        datos.append('ischecked', comision);
        datos.append('descuento', descuento);
        datos.append('tarifa_id', preferencia_id);

        const respuesta = await fetch('crear/broker', {
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
                resetearFormularioBrokers();
                traerBrokers();
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
async function actualizarBroker() {

    const broker_id = $('#broker_id').val();
    const nombre = $('#nombre').val();
    const siglas_empresa = $('#siglas_empresa').val();
    const telefono = $('#telefono').val();
    const email = $('#email').val();
    const sitio_web = $('#sitio_web').val();
    const contacto_principal = $('#contacto_principal').val();
    const calle = $('#calle').val();
    const num_ext = $('#num_ext').val();
    const num_int = $('#num_int').val();
    const ciudad = $('#ciudad').val();
    const estado = $('#estado').val();
    const municipio = $('#municipio').val();
    const codigo_postal = $('#codigo_postal').val();
    const colonia = $('#colonia').val();
    const pais = $('#pais').val();
    const rfc = $('#rfc').val();
    const razon_social = $('#razon_social').val();
    const regimen_fiscal = $('#regimen_fiscal').val();
    const giro_comercial = $('#giro_comercial').val();
    const estatus = $('#estatus').val();
    let comision = $('#comision').prop('checked') ? 1 : 0;
    const descuento = sinComa($('#descuento').val());
    const preferencia_id = $('#preferencia_id').val();

    try {

        const datos = new FormData();
        datos.append('broker_id', broker_id);
        datos.append('nombre', nombre);
        datos.append('siglas_empresa', siglas_empresa);
        datos.append('telefono', telefono);
        datos.append('email', email);
        datos.append('sitio_web', sitio_web);
        datos.append('contacto_principal', contacto_principal);
        datos.append('calle', calle);
        datos.append('num_ext', num_ext);
        datos.append('num_int', num_int);
        datos.append('ciudad', ciudad);
        datos.append('estado', estado);
        datos.append('municipio', municipio);
        datos.append('codigo_postal', codigo_postal);
        datos.append('colonia', colonia);
        datos.append('pais', pais);
        datos.append('rfc', rfc);
        datos.append('razon_social', razon_social);
        datos.append('regimen_fiscal', regimen_fiscal);
        datos.append('giro_comercial', giro_comercial);
        datos.append('estatus', estatus);
        datos.append('ischecked', comision);
        datos.append('descuento', descuento);
        datos.append('tarifa_id', preferencia_id);
        
        const respuesta = await fetch('actualizar/broker', {
            method: 'POST',
            body: datos
        });
        const data = await respuesta.json();

        if (data.exito == 1) {
            // Registro Creado Exitosamente
            SwalLoad('success', 'Éxito', 'Registro Actualizado Correctamente', false);
            setTimeout(() => {
                swal.close();
                resetearFormularioBrokers();
                traerBrokers();
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