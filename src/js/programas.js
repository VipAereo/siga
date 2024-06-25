let gridOptions;

// Utilizando el Principio de Modularidad
$(function () {
    asignarEventos();
    inicializarPagina();
    configurarBotones();
});

function asignarEventos() {
    $('.menuSearch').hide();

    document.addEventListener("keydown", e => {
        if (e.key === 'Escape') {
            let isList = document.querySelector('.contenedorKey');
            // existe algun listado, cerrar ese 
            if (!isList) {
                cerrarVentana('.contenedor-altas', ['#formAltas']);
            } else {
                resetLista('#listKey');
            }
        }
    });

    // Lista Search
    document.getElementById("padre").addEventListener("mousedown", async function (event) {
        event.preventDefault();
        $('.menuSearch').show();
        $('.inMenuSrch').focus()
        let data = await obtenerMenu();
        const listSearch = await mostrarListaSearch(data, '.menuSearch', 'programa_id', 'nombre');
        verificarPrograma(listSearch);
    });

    // List Key - DataTables
    $(".inMenuSrch").keydown(async (e) => {
        if (e.keyCode === 114) {
            e.preventDefault();
            const data = await obtenerMenu();
            const columns = ['programa_id', 'nombre', 'nivel'];
            // const columns = [{ 'Nombre': 'nombre' }, { 'Nivel': 'nivel' }];
            let datoKey = await createDataTable(data, columns, '600', '400', 'Menú');
            console.log(datoKey);

            if (datoKey) {
                var optionElement = document.getElementById("padre");
                optionElement.children[0].value = datoKey[0];
                optionElement.children[0].text = datoKey[1];
                await verificarPrograma(datoKey);
            }
        }
    });
}
function configurarBotones() {
    $(".contenedor-altas").hide();
    $("#crear-programa").click(mostrarContenedorAltas);
    $("#btnCancel").click(e => {
        // limpiarForm("#formAltas");
        cerrarVentana('.contenedor-altas', ['#formAltas']);
        $(".contenedor-altas").hide();
    });
    $("#btnGuardar").click(e => {
        let validar = validateInputs($('#formAltas'));
        if (validar) $('#programa_id').val() == '' ? crearPrograma() : actualizaPrograma();
    });
}
function inicializarPagina() {

    let columnDefs = [
        {
            headerName: 'id',
            field: 'programa_id',
            width: 60
        },
        {
            headerName: 'Nombre',
            field: 'nombre',
            width: 150
        },
        {
            headerName: 'Padre',
            field: 'nombre_padre',
            width: 150
        },
        {
            headerName: 'Nivel',
            field: 'nivel',
            width: 80
        },
        {
            headerName: 'Ruta',
            field: 'ruta',
            width: 150
        },
        {
            headerName: 'Fecha de Creación',
            field: 'fecha_creacion',
            width: 140
        },
        {
            headerName: 'Acción',
            cellRenderer: function (params) {
                const editButton = document.createElement('I');
                editButton.className = "fa-regular fa-pen-to-square btn btn-editar";
                editButton.title = 'Editar';

                editButton.addEventListener('click', async function () {
                    await mostrarContenedorAltas();

                    $('#programa_id').val(params.data.programa_id);
                    $('#nombre').val(params.data.nombre);
                    $('#ruta').val(params.data.ruta);
                    $('#nivel').val(params.data.nivel);

                    $('#padre option').val(params.data.padre);
                    $('#padre option').text(params.data.nombre_padre);
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
    traerProgramas();
}

/*  FUNCIONES  */
async function traerProgramas() {

    try {
        const respuesta = await fetch('allProgramas', {
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
async function mostrarContenedorAltas() {
    let tabla = $(".contenedor-altas").show();
}
async function obtenerMenu() {

    try {
        const respuesta = await fetch('/allProgramas', {
            method: 'GET'
        });
        const data = await respuesta.json();
        // console.log(data);

        if (!data.length > 0) {
            SwalToast('warning', 'No hay Programas disponibles.', 2500);
        }

        return data;
    } catch (error) {
        console.error(error);
        SwalLoad('error', 'Ocurrio Un Error', 'Conección Perdida a BD.', false);
    }
}
async function crearPrograma() {

    const nombre = $('#nombre').val();
    const ruta = $('#ruta').val();
    const padre = $('#padre').val();
    const nivel = $('#nivel').val();

    try {
        const datos = new FormData();
        datos.append('nombre', nombre);
        datos.append('ruta', ruta);
        datos.append('padre', padre);
        datos.append('nivel', nivel);

        const respuesta = await fetch('crear/programa', {
            method: 'POST',
            body: datos
        });

        const data = await respuesta.json();

        if (data.exito == 1) {
            // Registro Creado Exitosamente
            SwalLoad('success', 'Éxito', 'Programa Creado Correctamente', false);
            setTimeout(() => {
                swal.close();
                cerrarVentana('.contenedor-altas', ['#formAltas']);
                traerProgramas();
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
async function actualizaPrograma() {

    const programa_id = $('#programa_id').val();
    const nombre = $('#nombre').val();
    const ruta = $('#ruta').val();
    const padre = $('#padre').val();
    const nivel = $('#nivel').val();

    try {

        const datos = new FormData();
        datos.append('programa_id', programa_id);
        datos.append('nombre', nombre);
        datos.append('ruta', ruta);
        datos.append('padre', padre);
        datos.append('nivel', nivel);

        const respuesta = await fetch('actualizar/programa', {
            method: 'POST',
            body: datos
        });
        const data = await respuesta.json();
        // console.log(data);

        if (data.exito == 1) {
            // Registro Creado Exitosamente
            SwalLoad('success', 'Éxito', 'Programa Actualizado Correctamente', false);
            setTimeout(() => {
                swal.close();
                cerrarVentana('.contenedor-altas', ['#formAltas']);
                traerProgramas();
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
async function verificarPrograma(datos) {
    progVerificar();
    $("#nivel").val(Number(datos.nivel) ? parseInt(datos.nivel) + 1 : 1);
}
async function progVerificar() {

    let progId = $('#padre').val();

    try {
        const datos = new FormData();
        datos.append('progId', progId);

        const respuesta = await fetch('verificar/programa', {
            method: 'POST',
            body: datos
        });

        const data = await respuesta.json();

        if (data == 1) {
            SwalToast('warning', 'El Menú ya tiene una ruta.', 2500);
            $('#padre').val('');
        }

    } catch (error) {
        console.error(error);
        SwalLoad('error', 'Error en la Conexión', 'Comunicate con el Administrador', false);
    }


}
