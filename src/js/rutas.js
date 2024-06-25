let gridOptions;
let AEROPUERTOS;

// Utilizando el Principio de Modularidad
$(function () {
    asignarEventos();
    inicializarPagina();
    configurarBotones();
});
function asignarEventos() {
    // Ocultar Listados
    $('.aeropSearch').hide();
    $('.origenSearch').hide();
    $('.destinoSearch').hide();

    aplicarMascaraKm('distancia');

    document.addEventListener("keydown", e => {
        if (e.key === 'Escape') {
            resetForm();
        }
    });

    // Lista Aeropuertos
    document.getElementById("aeropuerto_id").addEventListener("mousedown", async function (event) {
        event.preventDefault();
        $('.aeropSearch').show();
        $('.inAeropSrch').focus();
        let data = await obtenerAeropuertos();
        const listSearch = await mostrarListaSearch(data, '.aeropSearch', 'aeropuerto_id', 'municipio');
    });

    // Lista Origen
    document.getElementById("origen").addEventListener("mousedown", async function (event) {
        event.preventDefault();
        $('.origenSearch').show();
        $('.inOrigenSrch').focus();
        let data = await obtenerAeropuertos();
        const listSearch = await mostrarListaSearch(data, '.origenSearch', 'aeropuerto_id', 'municipio');
        calcualarDistancia();
    });

    // Lista Destino
    document.getElementById("destino").addEventListener("mousedown", async function (event) {
        event.preventDefault();
        $('.destinoSearch').show();
        $('.inDestinoSrch').focus();
        let data = await obtenerAeropuertos();
        const listSearch = await mostrarListaSearch(data, '.destinoSearch', 'aeropuerto_id', 'municipio');
        calcualarDistancia();
    });

}
function configurarBotones() {
    $(".contenedor-altas").hide();
    $("#crear-ruta").click(mostrarContenedorAltas);

    $(".btn-cancelar").click(e => {
        resetForm();
    });

    $("#btnGuardar").click(e => {
        let validar = validateInputs($('#formAltas'));
        if (validar) $('#ruta_id').val() == '' ? crearRuta() : actualizarRuta();
    });
}
function inicializarPagina() {
    let columnDefs = [
        {
            headerName: 'id',
            field: 'ruta_id',
            width: 80
        },
        {
            headerName: 'Aeropuerto',
            field: 'nombre_aeropuerto',
            width: 250
        },
        {
            headerName: 'Origen',
            field: 'nombre_origen',
            width: 170
        },
        {
            headerName: 'Destino',
            field: 'nombre_destino',
            width: 170
        },
        {
            headerName: 'Tipo de Vuelo',
            field: 'tipo_vuelo',
            width: 120,
            cellEditor: 'agSelectCellEditor',
            cellRenderer: function (params) {
                if (params.value === 'N') {
                    return 'Nacional';
                } else if (params.value === 'I') {
                    return 'Internacional';
                } else {
                    return params.value; // Mantener el valor original si no es 'N' ni 'I'
                }
            }
        },
        {
            headerName: 'Distancia',
            field: 'distancia',
            width: 120
        },
        {
            headerName: 'Estatus',
            field: 'estado_ruta',
            width: 120
        },
        {
            headerName: 'Acción',
            cellRenderer: function (params) {
                const editButton = document.createElement('I');
                editButton.className = "fa-regular fa-pen-to-square btn btn-editar";
                editButton.title = 'Editar';

                editButton.addEventListener('click', async function () {
                    await mostrarContenedorAltas();

                    $('#ruta_id').val(params.data.ruta_id);
                    $('#distancia').val(params.data.distancia);
                    $('#estado_ruta').val(params.data.estado_ruta);

                    $('#aeropuerto_id option').val(params.data.aeropuerto_id);
                    $('#aeropuerto_id option').text(params.data.nombre_aeropuerto);

                    $('#origen option').val(params.data.origen);
                    $('#origen option').text(params.data.nombre_origen);

                    $('#destino option').val(params.data.destino);
                    $('#destino option').text(params.data.nombre_destino);

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
    traeRutas();
}

// FUNCIONES
function resetForm() {
    cerrarVentana('.contenedor-altas', ['#formAltas']);
}
function calcualarDistancia() {
    let origen = $('#origen').val();
    let destino = $('#destino').val();

    if (origen && destino) {

        const origenLatLong = AEROPUERTOS.find(aeropuerto => aeropuerto.aeropuerto_id == origen);

        let latOrigen = origenLatLong.latitud;
        let lonOrigen = origenLatLong.longitud;

        const destLatLong = AEROPUERTOS.find(aeropuerto => aeropuerto.aeropuerto_id == destino);
        let latDest = destLatLong.latitud;
        let lonDest = destLatLong.longitud;

        const valores = { latOrigen, lonOrigen, latDest, lonDest };

        let distancia = obtenerDistancia(valores);
        $('#distancia').val(distancia);
    }
}
async function mostrarContenedorAltas() {
    $(".contenedor-altas").show();
    await obtenerAeropuertos();
}
async function traeRutas() {
    try {
        const respuesta = await fetch('obtener/rutas', {
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
async function obtenerAeropuertos() {
    try {
        const respuesta = await fetch('allAeropuertos', {
            method: 'GET'
        });
        const data = await respuesta.json();
        AEROPUERTOS = data;
        // console.log(data);

        // let selectAeropuerto = document.getElementById('aeropuerto_id');
        // let selectOrigen = document.getElementById('origen');
        // let selectDestino = document.getElementById('destino');
        // selectAeropuerto.innerHTML = '';
        // selectOrigen.innerHTML = '';
        // selectDestino.innerHTML = '';

        // // Añadir la opción en blanco como la primera opción
        // selectAeropuerto.insertBefore(new Option('', ''), selectAeropuerto.firstChild);
        // selectOrigen.insertBefore(new Option('', ''), selectOrigen.firstChild);
        // selectDestino.insertBefore(new Option('', ''), selectDestino.firstChild);

        // data.length > 0 ? data.forEach(valor => {

        //     let option = document.createElement('option');
        //     option.value = valor.aeropuerto_id;
        //     option.textContent = valor.municipio;
        //     selectOrigen.appendChild(option);

        //     let option2 = document.createElement('option');
        //     option2.value = valor.aeropuerto_id;
        //     option2.textContent = valor.municipio;
        //     selectDestino.appendChild(option2);

        //     let option3 = document.createElement('option');
        //     option3.value = valor.aeropuerto_id;
        //     option3.textContent = valor.nombre;
        //     selectAeropuerto.appendChild(option3);

        // }) : SwalToast('warning', 'No hay Aeropuertos disponibles.', 2500);

        return data;
    } catch (error) {
        console.error(error);
        SwalLoad('error', 'Ocurrio Un Error', 'Conección Perdida a BD.', false);
    }
}
async function crearRuta() {

    const origen = $('#origen').val();
    const destino = $('#destino').val();
    const distancia = $('#distancia').val();
    const estado_ruta = $('#estado_ruta').val();
    const aeropuerto_id = $('#aeropuerto_id').val();

    try {

        const datos = new FormData();
        datos.append('origen', origen);
        datos.append('destino', destino);
        datos.append('distancia', distancia);
        datos.append('estado_ruta', estado_ruta);
        datos.append('aeropuerto_id', aeropuerto_id);

        const respuesta = await fetch('crear/ruta', {
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
                traeRutas();
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
async function actualizarRuta() {

    const ruta_id = $('#ruta_id').val();
    const origen = $('#origen').val();
    const destino = $('#destino').val();
    const distancia = $('#distancia').val();
    const estado_ruta = $('#estado_ruta').val();
    const aeropuerto_id = $('#aeropuerto_id').val();

    try {

        const datos = new FormData();
        datos.append('ruta_id', ruta_id);
        datos.append('origen', origen);
        datos.append('destino', destino);
        datos.append('distancia', distancia);
        datos.append('estado_ruta', estado_ruta);
        datos.append('aeropuerto_id', aeropuerto_id);

        const respuesta = await fetch('actualizar/ruta', {
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
                traeRutas();
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
function obtenerDistancia(valores) {

    const { latDest, latOrigen, lonDest, lonOrigen } = valores;

    // let latOrigen = 21.042216;
    // let lon1 = -86.87361;
    // let lat2 = 19.43630;
    // let lon2 = -99.07210;
    var radio_tierra = 6371; // Radio medio de la Tierra en kilómetros

    // Convertir grados a radianes
    var lat1_rad = degToRad(latOrigen);
    var lon1_rad = degToRad(lonOrigen);
    var lat2_rad = degToRad(latDest);
    var lon2_rad = degToRad(lonDest);

    // Diferencia de coordenadas
    var d_lat = lat2_rad - lat1_rad;
    var d_lon = lon2_rad - lon1_rad;

    // Fórmula de Haversine
    var a = Math.sin(d_lat / 2) * Math.sin(d_lat / 2) + Math.cos(lat1_rad) * Math.cos(lat2_rad) * Math.sin(d_lon / 2) * Math.sin(d_lon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Calcular la distancia
    var distancia = (radio_tierra * c).toFixed(2) + ' Km';

    return distancia;
}
function degToRad(deg) {
    return deg * (Math.PI / 180);
}