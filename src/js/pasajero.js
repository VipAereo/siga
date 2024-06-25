let gridOptions;

// Utilizando el Principio de Modularidad
$(function () {
    asignarEventos();
    inicializarPagina();
    configurarBotones();
});
function asignarEventos() {
    $(".contenedor-altas").hide();

    // Esc Cerrar
    document.addEventListener("keydown", e => {
        if (e.key === 'Escape') {
            // Limpiar Ruta
            resetForm();
        }
    });

}
function configurarBotones() {
    $("#crear-pax").click(mostrarContenedorAltas);

    $(".btn-cancelar").click(e => {
        resetForm();
    });

    $("#btnGuardar").click(e => {
        let validar = validateInputs($('#formAltas'));
        if (validar) $('#pasajero_id').val() == '' ? crearPax() : actualizarPax();
    });
}

// Ag-Grid 
async function inicializarPagina() {


    let columnDefs = [
        {
            headerName: 'id',
            field: 'pasajero_id',
            width: 80
        },
        {
            headerName: 'Nombre',
            field: 'nombre',
            width: 250
        },
        {
            headerName: 'Nacionalidad',
            field: 'nacionalidad',
            width: 150,
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
        // {
        //     headerName: 'Documento',
        //     field: 'ver doc..',
        //     width: 140
        // },
        {
            headerName: 'Acción',
            width: 155,
            headerClass: 'txt-center',
            cellClass: 'custom-action-cell', // Agregar la clase CSS 'custom-action-cell' a todas las celdas en esta columna
            filter: false,
            cellRenderer: function (params) {
                const editButton = document.createElement('I');
                editButton.className = "fa-regular fa-pen-to-square btn btn-editar";
                editButton.title = 'Editar';

                // Datos a Editar
                editButton.addEventListener('click', async function () {
                    await mostrarContenedorAltas();

                    $('#pasajero_id').val(params.data.pasajero_id);
                    $('#nombre').val(params.data.nombre);
                    $('#nacionalidad').val(params.data.nacionalidad);

                    const docs = await obtenerDocsbyPax(params.data.pasajero_id);
                    const container = document.getElementById('contenedor-docs');

                    if (docs.length > 0) { const elementoDocumento = crearElementoDocumento(docs, container); }

                });

                const actionContainer = document.createElement('div');
                actionContainer.classList = "btn-cont centrado";
                actionContainer.appendChild(editButton);

                return actionContainer;
            }
        }
    ];

    let data = '';
    await iniciarTabla(data, columnDefs, '#myGrid');
    traerPasajeros();
}

// Funciones
async function mostrarContenedorAltas() {
    $(".contenedor-altas").show();
}
function resetForm() {
    $('#contenedor-docs').empty();
    cerrarVentana('.contenedor-altas', ['#formAltas']);
}
// Función para crear un elemento HTML representando un documento
function crearElementoDocumento(docs, container) {
    docs.forEach(doc => {

        const enlace = document.createElement('a');
        enlace.classList.add('thumbnail');
        enlace.href = `/${doc.ruta}/${doc.hash_doc}.${doc.tipo_doc}`;
        enlace.setAttribute('target', '_blank'); // Abre el enlace en una nueva pestaña

        const divIcon = document.createElement('DIV');
        divIcon.classList.add('fileicon');

        const icon = document.createElement('I');
        icon.classList.add('fa-regular', 'fa-file');

        const divName = document.createElement('DIV');
        divName.classList.add('filename');

        const name = document.createElement('P');
        name.textContent = `${doc.nombre_doc}`;

        divIcon.appendChild(icon);
        divName.appendChild(name);
        enlace.appendChild(divIcon);
        enlace.appendChild(divName);

        container.appendChild(enlace);
    });
}

// Fetch 
async function traerPasajeros() {
    try {
        const respuesta = await fetch('obtener/pasajeros', {
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
async function obtenerDocsbyPax(id) {

    try {

        const datos = new FormData();
        datos.append('pasajero_id', id);

        const respuesta = await fetch('obtener/pasajerosDocs', {
            method: 'POST',
            body: datos
        });

        const data = await respuesta.json();
        // if (!data.length > 0) SwalToast('warning', 'No hay Documentos disponibles.', 2500);

        return data
    } catch (error) {
        console.error(error);
        SwalLoad('error', 'Error en la Conexión', 'Comunicate con el Administrador', false);
    }
}
async function crearPax() {

    try {
        const nombre = $('#nombre').val();
        const nacionalidad = $('#nacionalidad').val();
        const docPax = $('#docPax')[0].files[0];  // Asegurarse de obtener el archivo correctamente

        const datos = new FormData();
        datos.append('nombre', nombre);
        datos.append('nacionalidad', nacionalidad);
        datos.append(`archivo`, docPax);

        const respuesta = await fetch('crear/pax', {
            method: 'POST',
            body: datos
        });

        const data = await respuesta.json();

        if (data.exito == 1) {
            SwalLoad('success', 'Éxito', 'Registro Creado Correctamente', false);
            setTimeout(() => {
                swal.close();
                resetForm();
                traerPasajeros();
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
async function actualizarPax() {

    try {
        const pasajero_id = $('#pasajero_id').val();
        const nombre = $('#nombre').val();
        const nacionalidad = $('#nacionalidad').val();
        const docPax = $('#docPax')[0].files[0];

        const datos = new FormData();
        datos.append('pasajero_id', pasajero_id);
        datos.append('nombre', nombre);
        datos.append('nacionalidad', nacionalidad);
        datos.append(`archivo`, docPax);

        const respuesta = await fetch('actualizar/pax', {
            method: 'POST',
            body: datos
        });

        const data = await respuesta.json();

        if (data.exito == 1) {
            SwalLoad('success', 'Éxito', 'Registro Actualizado Correctamente', false);
            setTimeout(() => {
                swal.close();
                resetForm();
                traerPasajeros();
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
