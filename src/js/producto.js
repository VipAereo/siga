let gridOptions;
// Utilizando el Principio de Modularidad
$(function () {
    asignarEventos();
    inicializarPagina();
    configurarBotones();
});
function asignarEventos() {
    $(".contenedor-altas").hide();
    $('.categSearch').hide();

    aplicarMascaraCantidad('precio');

    // Esc Cerrar
    document.addEventListener("keydown", e => {
        if (e.key === 'Escape') {
            // Limpiar Ruta
            resetForm();
        }
    });

    // Lista Categorias
    document.getElementById("categoria_id").addEventListener("mousedown", async function (event) {
        event.preventDefault();
        $('.categSearch').show();
        $('.inCategSrch').focus()
        let data = await obtenerCategorias();
        data = data.filter(cat =>
            cat.nombre !== "Ruta" &&
            cat.nombre !== "Pernocta" &&
            cat.nombre !== "Aterrizaje" &&
            cat.nombre !== "Tua"
        );
        const listSearch = await mostrarListaSearch(data, '.categSearch', 'categoria_id', 'nombre');

    });

}
function configurarBotones() {
    $("#crear-prod").click(mostrarContenedorAltas);

    $(".btn-cancelar").click(e => {
        resetForm();
    });

    $("#btnGuardar").click(e => {
        let validar = validateInputs($('#formAltas'));
        if (validar) $('#producto_id').val() == '' ? crearProd() : actualizarProd();
    });

}

// Ag-Grid 
async function inicializarPagina() {

    let categoria = await obtenerCategorias();
    let categoriasMap = {};
    categoria.forEach(cat => {
        categoriasMap[cat.categoria_id] = cat.nombre;
    });

    let columnDefs = [
        {
            headerName: 'id',
            field: 'producto_id',
            width: 80
        },
        {
            headerName: 'Nombre',
            field: 'nombre',
            width: 180
        },
        {
            headerName: 'Descripción',
            field: 'descripcion',
            width: 200
        },
        {
            headerName: 'Categoría',
            field: 'categoria_id',
            width: 120,
            valueFormatter: function (params) {
                let idCat = params.data.categoria_id;
                return categoriasMap[idCat] || '';
            },
        },
        {
            headerName: 'Precio',
            field: 'precio',
            width: 140,
            cellStyle: { textAlign: 'right' }, // Alinea los datos a la derecha
            valueFormatter: function (params) {
                // Formatea el número con comas como separadores de miles y dos decimales
                return Number(params.value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        },
        {
            headerName: 'Acción',
            width: 148,
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

                    $('#producto_id').val(params.data.producto_id);
                    $('#nombre').val(params.data.nombre);
                    $('#descripcion').val(params.data.descripcion);
                    $('#precio').val(params.data.precio);
                    $('#categoria_id option').val(params.data.categoria_id);
                    $('#categoria_id option').text(params.data.nombreCat);

                    $("#categoria_id").addClass('event-none input-disabled');

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
    obtenerProductos();
}


// Funciones
async function mostrarContenedorAltas() {
    $(".contenedor-altas").show();
}
function resetForm() {
    $('#contenedor-docs').empty();
    cerrarVentana('.contenedor-altas', ['#formAltas']);
    $("#categoria_id").removeClass('event-none input-disabled');
}

// Fetch 
async function obtenerProductos() {
    try {
        const respuesta = await fetch('obtener/productos', {
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
async function obtenerCategorias() {
    try {
        const respuesta = await fetch('../obtener/categorias', {
            method: 'GET'
        });
        const data = await respuesta.json();
        if (!data.length > 0) {
            SwalToast('warning', 'No hay Categorias disponibles.', 2500);
        }

        return data;
    } catch (error) {
        console.error(error);
        SwalLoad('error', 'Ocurrio Un Error', 'Conección Perdida a BD.', false);
    }
}
async function crearProd() {

    try {

        const nombre = $('#nombre').val();
        const categoria_id = $('#categoria_id').val();
        const descripcion = $('#descripcion').val();
        const precio = sinComa($('#precio').val());

        const datos = new FormData();
        datos.append('nombre', nombre);
        datos.append('categoria_id', categoria_id);
        datos.append('descripcion', descripcion);
        datos.append('precio', precio);

        const respuesta = await fetch('crear/producto', {
            method: 'POST',
            body: datos
        });

        const data = await respuesta.json();

        if (data.exito == 1) {
            SwalLoad('success', 'Éxito', 'Registro Creado Correctamente', false);
            setTimeout(() => {
                swal.close();
                resetForm();
                obtenerProductos();
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
async function actualizarProd() {

    try {

        const producto_id = $('#producto_id').val();
        const nombre = $('#nombre').val();
        const categoria_id = $('#categoria_id').val();
        const descripcion = $('#descripcion').val();
        const precio = sinComa($('#precio').val());

        const datos = new FormData();
        datos.append('producto_id', producto_id);
        datos.append('nombre', nombre);
        datos.append('categoria_id', categoria_id);
        datos.append('descripcion', descripcion);
        datos.append('precio', precio);

        const respuesta = await fetch('actualizar/producto', {
            method: 'POST',
            body: datos
        });

        const data = await respuesta.json();

        if (data.exito == 1) {
            SwalLoad('success', 'Éxito', 'Registro Actualizado Correctamente', false);
            setTimeout(() => {
                swal.close();
                resetForm();
                obtenerProductos();
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