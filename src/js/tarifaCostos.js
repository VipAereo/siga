let gridOptions;

// Utilizando el Principio de Modularidad
$(function () {
    asignarEventos();
    inicializarPagina();
    configurarBotones();
});
function asignarEventos() {
    $('.aeronSearch').hide();
    $('.prefSearch').hide();

    document.addEventListener("keydown", e => {
        if (e.key === 'Escape') {
            resetForm();
        }
    });

    aplicarMascaraCantidad('costo_mx', 'costo_usd');

    // Lista Aeronaves
    document.getElementById("aeronave_id").addEventListener("mousedown", async function (event) {
        event.preventDefault();
        $('.aeronSearch').show();
        $('.inAeronSrch').focus()
        let data = await obtenerAeronaves();
        const listSearch = await mostrarListaSearch(data, '.aeronSearch', 'aeronave_id', 'modelo');
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
    $("#crear-tarifa").click(mostrarContenedorAltas);

    $(".btn-cancelar").click(e => {
        resetForm();
    });

    $("#btnGuardar").click(e => {
        let validar = validateInputs($('#formAltas'));
        if (validar) $('#costo_id').val() == '' ? crearTarifa() : actualizarTarifa();
    });
}
function inicializarPagina() {

    let columnDefs = [
        {
            headerName: 'id',
            field: 'costo_id',
            width: 80
        },
        {
            headerName: 'Aeronave',
            field: 'modelo',
            width: 150
        },
        {
            headerName: 'Preferencia',
            field: 'tipo_nombre',
            width: 130
        },
        {
            headerName: 'Costo Nacional',
            field: 'costo_mx',
            width: 120,
            cellStyle: { textAlign: 'right' }, // Alinea los datos a la derecha
            valueFormatter: function (params) {
                // Formatea el número con comas como separadores de miles y dos decimales
                return Number(params.value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        },
        {
            headerName: 'Costo Internacional',
            field: 'costo_usd',
            width: 120,
            cellStyle: { textAlign: 'right' }, // Alinea los datos a la derecha
            valueFormatter: function (params) {
                // Formatea el número con comas como separadores de miles y dos decimales
                return Number(params.value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        },
        {
            headerName: 'Fecha Creación',
            field: 'fecha_creacion',
            width: 130
        },
        {
            headerName: 'Acción',
            cellRenderer: function (params) {
                const editButton = document.createElement('I');
                editButton.className = "fa-regular fa-pen-to-square btn btn-editar";
                editButton.title = 'Editar';

                editButton.addEventListener('click', async function () {
                    await mostrarContenedorAltas();

                    $('#costo_id').val(params.data.costo_id);
                    $('#preferencia').val(params.data.preferencia);
                    $('#costo_mx').val(params.data.costo_mx);
                    $('#costo_usd').val(params.data.costo_usd);
                    $('#aeronave_id option').val(params.data.aeronave_id);
                    $('#aeronave_id option').text(params.data.modelo);

                    $('#aeronave_id').addClass('input-disabled');
                    $('#costo_mx').addClass('input-disabled');
                    $('#costo_usd').addClass('input-disabled');

                    $('#preferencia_id option').val(params.data.tarifa_id);
                    $('#preferencia_id option').text(params.data.tipo_nombre);
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
    traerTarifas();
}
// FUNCIONES
function resetForm() {
    cerrarVentana('.contenedor-altas', ['#formAltas']);
}
async function mostrarContenedorAltas() {
    $(".contenedor-altas").show();

    await obtenerAeronaves();
}
async function obtenerAeronaves() {
    try {
        const respuesta = await fetch('/aeronaves/activas', {
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
async function traerTarifas() {
    try {
        const respuesta = await fetch('obtener/tarifas', {
            method: 'GET',
        });
        const data = await respuesta.json();
        // console.log(data);

        let convert = verificarArray(data);
        gridApi.setGridOption('rowData', convert);

    } catch (error) {
        console.error(error);
        SwalToast('warning', 'Error al obtener los datos', 2500);
    }
}

async function crearTarifa() {

    const aeronave_id = $('#aeronave_id').val();
    const tarifa_id = $('#preferencia_id').val();
    const costo_mx = sinComa($('#costo_mx').val());
    const costo_usd = sinComa($('#costo_usd').val());

    try {

        const datos = new FormData();
        datos.append('aeronave_id', aeronave_id);
        datos.append('tarifa_id', tarifa_id);
        datos.append('costo_mx', costo_mx);
        datos.append('costo_usd', costo_usd);

        const respuesta = await fetch('crear/tarifa', {
            method: 'POST',
            body: datos
        });

        const data = await respuesta.json();

        if (data.exito == 1) {
            // Registro Creado Exitosamente
            SwalLoad('success', 'Éxito', 'Registro Creado Correctamente', false);
            setTimeout(() => {
                swal.close();
                resetForm();
                traerTarifas();
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

async function actualizarTarifa() {

    const costo_id = $('#costo_id').val();
    const aeronave_id = $('#aeronave_id').val();
    const tarifa_id = $('#preferencia_id').val();
    const costo_mx = sinComa($('#costo_mx').val());
    const costo_usd = sinComa($('#costo_usd').val());

    try {

        const datos = new FormData();
        datos.append('costo_id', costo_id);
        datos.append('aeronave_id', aeronave_id);
        datos.append('tarifa_id', tarifa_id);
        datos.append('costo_mx', costo_mx);
        datos.append('costo_usd', costo_usd);

        const respuesta = await fetch('actualizar/tarifa', {
            method: 'POST',
            body: datos
        });

        const data = await respuesta.json();
        // console.log(data);

        if (data.exito == 1) {
            // Registro Creado Exitosamente
            SwalLoad('success', 'Éxito', 'Registro Actualizado Correctamente', false);
            setTimeout(() => {
                swal.close();
                resetForm();
                traerTarifas();
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