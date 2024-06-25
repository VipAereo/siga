let gridApi;
// Define una variable global para almacenar las instancias de las tablas
const tablas = {};

function SwalToast(icon, title, timer) {
    Swal.fire({
        icon: icon,
        title: title,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: timer,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
}
function SwalLoad(icon, title, text, confirm) {
    Swal.fire({
        icon: icon,
        title: title,
        text: text,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: confirm
    });
}

// Tabla AG-Grid
function iniciarTabla(data, columnDefs, idTable) {


    const AG_GRID_LOCALE_ES = {
        // Number Filter & Text Filter
        filterOoo: 'Filtro...',
        equals: 'Igual',
        notEqual: 'No igual',
        blank: 'En blanco',
        notBlank: 'No en blanco',

        // Text Filter
        contains: 'Contiene',
        notContains: 'No contiene',
        startsWith: 'Empieza con',
        endsWith: 'Termina con',

        // Date Filter
        dateFormatOoo: 'yyyy-mm-dd',
        before: 'Antes',
        after: 'Después',
        inRange: 'Entre',

        // Filter Conditions
        andCondition: 'AND',
        orCondition: 'OR',

        // Filter Buttons
        applyFilter: 'Apply',
        resetFilter: 'Reset',
        clearFilter: 'Clear',
        cancelFilter: 'Cancel',

        // Menu
        totalRows: 'Total Rows',
        totalAndFilteredRows: 'Rows',
        more: 'More',
        to: 'a',
        of: 'de ',
        page: 'Página',
        pageLastRowUnknown: '?',
        nextPage: 'Next Page',
        lastPage: 'Last Page',
        firstPage: 'First Page',
        previousPage: 'Previous Page',
        pageSizeSelectorLabel: 'Tamaño de Páginas:',
        footerTotal: 'Total',
    }

    const minRows = 6; // Número mínimo de filas que se deben mostrar
    // Si data está vacío, llenar con 8 filas vacías
    // if (!data || data.length === 0) {
    //     data = Array.from({ length: 8 }, () => ({})); // Crea un array de 8 elementos vacíos
    // }
    if (!data || data.length < minRows) {
        const emptyRowsNeeded = minRows - (data ? data.length : 0);
        const emptyRows = Array.from({ length: emptyRowsNeeded }, () => ({}));
        data = data ? [...data, ...emptyRows] : emptyRows;
    }

    gridOptions = {
        defaultColDef: {
            resizable: true,
            filter: 'agTextColumnFilter',
            cellDataType: false,
        },
        rowSelection: 'multiple', // Permite la selección de múltiples filas
        columnDefs: columnDefs,
        rowData: data,
        pagination: true,
        onGridReady: function (params) {
            // Registra el evento cellClicked
            params.api.addEventListener('cellClicked', function (event) {
                const api = params.api;
                const rowIndex = event.rowIndex;
                const rowCount = api.getDisplayedRowCount(); // Obtiene el número de filas visibles

                if (rowIndex === rowCount - 1) {

                    const lastRowNode = api.getDisplayedRowAtIndex(rowCount - 1); // Obtiene la última fila visible
                    const lastRowData = lastRowNode && lastRowNode.data;

                    // Verifica si la última fila está vacía
                    if (lastRowData && Object.values(lastRowData).every(val => val === null || val === '')) {
                        // Agrega una nueva fila
                        const newRowData = {}; // Aquí puedes definir los valores por defecto de la nueva fila
                        api.applyTransaction({ add: [newRowData] }); // Agrega la nueva fila a la grilla
                    }
                }
            });

        },
        overlayLoadingTemplate: '<div aria-live="polite" aria-atomic="true" style="position:absolute;top:0;left:0;right:0; bottom:0; background: url(	https://ag-grid.com/images/ag-grid-loading-spinner.svg) center no-repeat" aria-label="loading"></div>',
        localeText: AG_GRID_LOCALE_ES,
    };

    let gridDiv = document.querySelector(idTable);
    gridApi = agGrid.createGrid(gridDiv, gridOptions);
    tablas[idTable] = gridApi;
}

function filtrarTabla(idTable, value) {
    const gridApi = tablas[idTable];
    if (gridApi) {
        gridApi.setGridOption('quickFilterText', value);
    }
}
// Formularios Altas
function limpiarForm(idform) {

    if ($(idform)[0]) {
        $(idform)[0].reset();
        // eliminar clases de error si es que hay
        $(`${idform} .campoRequerido, ${idform} .errorInput`).removeClass('campoRequerido errorInput');
    }
}
function resetearTabla(idTable, buscador) {
    if (tablas[idTable]) {
        // Destruir la tabla (si es necesario)
        tablas[idTable].destroy();
        $(buscador).val('');

        // Eliminar la entrada de la tabla cerrada
        delete tablas[idTable];

        // Obtener el primer grid en tablas (si existe)
        const keys = Object.keys(tablas);
        if (keys.length > 0) {
            gridApi = tablas[keys[0]]; // Asignar la referencia del primer grid
        } else {
            gridApi = null; // No hay más tablas, asignar a null
        }
    }
}
async function cerrarVentana(idVentana, idform) {
    $(idVentana).hide();
    // Restablecer cada formulario
    idform.forEach(function (formulario) {
        $(formulario).trigger("reset");
        // $(`${idform}`).find('.errorInput, .campoRequerido').removeClass('errorInput campoRequerido');
        $(formulario).find('.errorInput, .campoRequerido').removeClass('errorInput campoRequerido');

        // Restablecer el valor y el texto del primer option de cada select
        $(formulario).find('select').each(function () {
            // Obtener el primer option
            var firstOption = $(this).find('option:first');

            // Restablecer su valor y texto a una cadena vacía
            firstOption.val('');
            firstOption.text('');
        });
    });
}
// id del div padre a dejar Vacio 
function resetLista(id) {
    $(id).empty();
}
function validateInputs(form) {
    let isValid = true;

    // Itera sobre todos los inputs dentro del formulario
    form.find('label').each(function () {
        // Verifica si el input tiene la clase 'importante'
        if ($(this).hasClass('labelImportant')) {
            const inputField = $(this).parent().find('input, select');

            // Si el input es vacio agrega una clase
            if (inputField.val() === '') {
                inputField.addClass('campoRequerido');
                $(this).closest('.form-group').addClass('errorInput');
                $(this).focus();
                isValid = false;
            } else {
                inputField.removeClass('campoRequerido');
                $(this).closest('.form-group').removeClass('errorInput');
            }
        }
    });

    return isValid;
}
// Trae la informacion de la tabla Actulmente Activa
function getDataFromGrid() {
    let allData = [];
    gridApi.forEachNode(node => allData.push(node.data));
    return allData;
}
// toma como parametro el id del campo para seleccionar todo el valor
function seleccionTxt(...idCampos) {
    idCampos.forEach(id => {
        $(document).on('focus', `#${id}`, function () {
            $(`#${id}`).select();
        });
    });
}
function sinComa(valor) {
    return valor.replace(/,/g, '');
}
function conComa(valor) {
    return valor.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function verificarArray(data) {
    return Array.isArray(data) ? data : [data];
}
function aplicarMascaraCantidad(...inputSelector) {
    inputSelector.forEach(id => {
        $(`#${id}`).inputmask({
            alias: 'currency', // Puedes elegir entre diferentes alias (currency, decimal, integer, etc.)
            prefix: '', // Prefijo opcional
            suffix: '', // Sufijo opcional
            allowMinus: false, // Permitir números negativos (true/false)
            thousandsSeparator: ',', // Separador de miles
            decimalSeparator: '.', // Separador decimal
            digits: 2,
            max: 99999999.99 // L 8
        });
    });
}
function aplicarMascaraKm(...inputSelector) {
    inputSelector.forEach(id => {
        $(`#${id}`).inputmask({
            alias: 'numeric', // Usamos el alias 'numeric' para aceptar solo números
            prefix: '', // Prefijo opcional
            suffix: ' Km', // Sufijo con "Km"
            allowMinus: false, // No permitimos números negativos
            autoUnmask: true, // Desenmascaramos automáticamente al obtener el valor
            greedy: false, // No permitimos caracteres adicionales
            groupSeparator: ',', // Separador de miles
            placeholder: '0', // Valor de relleno
            rightAlign: false // Alineación a la izquierda
        });
    });
}
// ListKey
async function createDataTable(datos, columns, width, height, title) {

    return new Promise(function (resolve, reject) {
        try {
            // let listaPadre = '#padre';

            // let listaSearchOptions = document.querySelectorAll(`${listaPadre} option`);
            // listaSearchOptions.forEach(function (option) {
            //     option.textContent = '';
            //     option.value = '';
            // });

            // Crear contenedor
            let container = document.createElement("div");
            container.className = 'contenedorKey';

            // Crear Titulo TablaKey
            let titleContainer = document.createElement("div");
            titleContainer.className = 'flex-titulo';
            titleContainer.style.width = `${width}px`;

            let titleH3 = document.createElement('H3');
            titleH3.innerHTML = title;

            let icon = document.createElement('I');
            icon.className = 'fa-solid fa-xmark cerrar-tablakey';

            // Crear tabla
            var tabla = document.createElement('table');
            tabla.id = 'tableKey';
            // tabla.className = "stripe row-border order-column nowrap";
            tabla.className = "display";
            tabla.style.width = "100%";

            // Crear encabezado
            var encabezado = document.createElement('thead');
            var encabezadoFila = document.createElement('tr');

            // Obtener las claves de la primera fila para crear las columnas
            var keys = Object.keys(datos[0]);

            // Crear las columnas del encabezado
            // keys.forEach(function (key) {
            columns.forEach(function (key) {
                var th = document.createElement('th');
                th.textContent = key;
                encabezadoFila.appendChild(th);
            });

            encabezado.appendChild(encabezadoFila);
            tabla.appendChild(encabezado);

            // Crear cuerpo de la tabla
            var cuerpo = document.createElement('tbody');

            // Iterar sobre los datos para crear las filas
            datos.forEach(function (filaData) {
                var fila = document.createElement('tr');

                // Iterar sobre las propiedades de cada objeto para crear las celdas
                // keys.forEach(function (key) {
                columns.forEach(function (key) {
                    var dato = filaData[key];
                    var celda = document.createElement('td');
                    celda.textContent = dato;
                    fila.appendChild(celda);
                });

                cuerpo.appendChild(fila);
            });

            tabla.appendChild(cuerpo);

            var divTabla = document.getElementById('listKey');
            container.appendChild(titleContainer);
            titleContainer.appendChild(titleH3);
            titleContainer.appendChild(icon);
            container.appendChild(tabla);
            divTabla.appendChild(container);

            $('#tableKey').DataTable({
                fixedColumns: true,
                keys: true,
                paging: true,
                scrollCollapse: true,
                scrollY: `${height}px`, // Puedes ajustar esta altura según tus necesidades
                language: {
                    "search": "Buscar:",
                    "info": "Mostrando _END_ de _TOTAL_ Registros",
                    "infoEmpty": 'No Hay Registros',
                    "zeroRecords": 'No Se Encontraron Registros',
                    "infoFiltered": '(Filtrado de _MAX_ Registros Totales)',
                    "lengthMenu": "_MENU_ Entradas por página",
                }
            });

            var tableKeyWrapper = document.getElementById("tableKey_wrapper");
            tableKeyWrapper.style.width = `${width}px`;

            $('.cerrar-tablakey').on('click', function () {
                resetLista('#listKey');
            });

            // devuelve fila
            $('#tableKey').on('dblclick', 'tbody td', function () {
                // $(document).on('dblclick', '#tableKey tbody td', function () {
                // Obtener la fila a la que pertenece la celda
                var fila = $(this).closest('tr');

                // Obtener los datos de la fila
                var datosFila = fila.children('td').map(function () {
                    return $(this).text();
                }).get();

                // console.log(datosFila);

                // Cerrar la tabla
                resetLista('#listKey');

                resolve(datosFila);
            });

            // devuelve fila
            document.addEventListener('keydown', function (event) {

                if (event.key === 'Enter') {
                    const table = document.querySelector('#tableKey');
                    // Verifica si el evento proviene de la tabla #tableKey
                    if (table) {

                        // Encuentra la fila que contiene el elemento de destino del evento
                        const cellWithFocus = table.querySelector('td.focus');
                        if (cellWithFocus) {
                            // Encuentra la fila que contiene la celda con la clase 'focus'
                            const row = cellWithFocus.closest('tr');
                            if (row) {

                                // Se encontró la fila, ahora podemos trabajar con ella
                                // Obtén todas las celdas de la fila
                                const cells = row.querySelectorAll('td');

                                // Crea un array para almacenar los valores de las celdas
                                const cellValues = [];

                                // Itera sobre las celdas y obtén los valores de texto de cada una
                                cells.forEach(function (cell) {
                                    cellValues.push(cell.textContent.trim());
                                });

                                console.log(cellValues);
                                resetLista('#listKey');

                                // Muestra los valores de las celdas en la consola o haz lo que necesites con ellos
                                // console.log('Valores de la fila:', cellValues);

                                resolve(cellValues);
                            }
                        }
                    }
                }
            });

        } catch (error) {
            console.error('Error al obtener y mostrar los datos:', error);
            reject('error');
        }
    });
}
async function mostrarListaSearch(datos, listaSearch, valorOpt, textOpt, add) {
    return new Promise((resolve, reject) => {
        try {

            // if (datos.length < 1) reject('No hay data');

            let listaPadre = $(listaSearch);
            let inputSearch = listaPadre.find('input');
            let selectPadre = listaPadre.parent().find('select');
            let currentIndex = -1; // Variable para almacenar el índice de la opción actualmente seleccionada

            if (!inputSearch.length === 0 || !selectPadre.length === 0) {
                reject('No se encontro HTML');
            }

            filtrarDatos();

            $(inputSearch).on('input blur', function (event) {
                if (event.type === "input") {
                    filtrarDatos();
                } else if (event.type === "blur") {
                    limpiarLista();
                }
            });

            $(inputSearch).on('keydown', function (event) {

                const listaSearchOptions = listaPadre.find('option');
                // let listaSearchOptions = document.querySelectorAll(`${listaSearch} option`);

                const totalOptions = listaSearchOptions.length;

                if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    currentIndex = (currentIndex + 1) % totalOptions;
                    actualizarSeleccion();
                } else if (event.key === 'ArrowUp') {
                    event.preventDefault();
                    currentIndex = currentIndex === -1 || currentIndex === 0 ? totalOptions - 1 : (currentIndex - 1 + totalOptions) % totalOptions;
                    actualizarSeleccion();
                } else if (event.key === 'Enter' && currentIndex !== -1) {
                    event.preventDefault();
                    let option = listaSearchOptions.eq(currentIndex);
                    // Limpiar todas las opciones del select
                    selectPadre.empty();
                    if (option.val() === 'nuevo') {
                        resolve('nuevo');
                    } else {
                        // Clonar la opción seleccionada y agregarla al select
                        let selectedOption = option.clone();
                        selectPadre.append(selectedOption);
                        // Obtener el valor de la opción seleccionada
                        let selectedValue = option.val();
                        // Encontrar el objeto correspondiente a la opción seleccionada
                        let objetoSeleccionado = datos.find(objeto => objeto[valorOpt] === parseInt(selectedValue));
                        // Resolver la promesa con el objeto seleccionado
                        currentIndex = -1;
                        $(listaSearch).hide();
                        resolve(objetoSeleccionado);
                    }

                }
            });

            function actualizarSeleccion() {
                const listaSearchOptions = listaPadre.find('option');
                listaSearchOptions.removeClass('listOption');
                if (currentIndex !== -1) {
                    listaSearchOptions.eq(currentIndex).addClass('listOption');
                }
            }

            function filtrarDatos() {

                let inputText = $(inputSearch).val().trim().toLowerCase();
                let filteredNames = datos.filter(function (item) {
                    return (item[textOpt] ? item[textOpt].toLowerCase() : '').includes(inputText);
                }).slice(0, 5);

                let listaSearchOptions = document.querySelectorAll(`${listaSearch} option`);
                // Iterar sobre cada opción
                listaSearchOptions.forEach(function (option) {
                    // Eliminar cada opción
                    option.remove();
                });

                if (add) {
                    let valNuevo = { [valorOpt]: 'nuevo', [textOpt]: 'Nuevo' };
                    filteredNames.unshift(valNuevo);
                }

                if (filteredNames.length > 0) {
                    filteredNames.forEach(function (item) {

                        let option = $('<option>').val(item[valorOpt]).text(item[textOpt]);
                        listaPadre.append(option);

                        option.on('mousedown', function (event) {
                            event.preventDefault(); // Prevenir el comportamiento predeterminado
                            // eliminar option anteriores
                            selectPadre.empty();
                            if (option.val() === 'nuevo') {
                                selectPadre.append('');
                                limpiarLista();
                                resolve('nuevo');
                            } else {
                                // agregar el option seleccionado
                                selectPadre.append(option);
                                limpiarLista();
                                resolve(item);
                            }
                        });
                    });
                } else {
                    listaPadre.append('<option disabled>No se encontraron resultados</option>');
                }
            }

            function limpiarLista() {
                // Ocultar y Limpiar busqueda
                let listaSearchOptions = document.querySelectorAll(`${listaSearch} option`);
                listaSearchOptions.forEach(function (option) {
                    option.remove();
                });
                $(inputSearch).val('');
                $(listaSearch).hide();

                currentIndex = -1;
            }


        } catch (error) {
            console.error('Error al obtener y mostrar los datos:', error);
            reject('error')
        }
    });
}
// IMPORTANTE - ELIMINAR SI NO HAY ERRORES CON LOS SELECTORES
async function mostrarListaSearchs(datos, listaSearch, valorOpt, textOpt) {
    return new Promise((resolve, reject) => {
        try {

            if (datos.length < 1) reject('No hay data');

            let listaPadre = $(listaSearch);
            let inputSearch = listaPadre.find('input')
            let selectPadre = listaPadre.parent().find('select');
            let currentIndex = -1; // Variable para almacenar el índice de la opción actualmente seleccionada

            if (!inputSearch.length === 0 || !selectPadre.length === 0) {
                reject('No se encontro HTML');
            }

            filtrarDatos();

            $(inputSearch).on('input blur', function (event) {
                if (event.type === "input") {
                    filtrarDatos();
                } else if (event.type === "blur") {
                    limpiarLista();
                }
            });

            $(inputSearch).on('keydown', function (event) {

                const listaSearchOptions = listaPadre.find('option');
                // let listaSearchOptions = document.querySelectorAll(`${listaSearch} option`);

                const totalOptions = listaSearchOptions.length;

                if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    currentIndex = (currentIndex + 1) % totalOptions;
                    actualizarSeleccion();
                } else if (event.key === 'ArrowUp') {
                    event.preventDefault();
                    currentIndex = currentIndex === -1 || currentIndex === 0 ? totalOptions - 1 : (currentIndex - 1 + totalOptions) % totalOptions;
                    actualizarSeleccion();
                } else if (event.key === 'Enter' && currentIndex !== -1) {
                    event.preventDefault();
                    let option = listaSearchOptions.eq(currentIndex);
                    // Limpiar todas las opciones del select
                    selectPadre.empty();
                    // Clonar la opción seleccionada y agregarla al select
                    let selectedOption = option.clone();
                    selectPadre.append(selectedOption);
                    // Obtener el valor de la opción seleccionada
                    let selectedValue = option.val();
                    // Encontrar el objeto correspondiente a la opción seleccionada
                    let objetoSeleccionado = datos.find(objeto => objeto[valorOpt] === parseInt(selectedValue));
                    // Resolver la promesa con el objeto seleccionado
                    currentIndex = -1;
                    $(listaSearch).hide();
                    resolve(objetoSeleccionado);
                }
            });

            function actualizarSeleccion() {
                const listaSearchOptions = listaPadre.find('option');
                listaSearchOptions.removeClass('listOption');
                if (currentIndex !== -1) {
                    listaSearchOptions.eq(currentIndex).addClass('listOption');
                }
            }

            function filtrarDatos() {

                let inputText = $(inputSearch).val().trim().toLowerCase();
                let filteredNames = datos.filter(function (item) {
                    // return item[textOpt].toLowerCase().includes(inputText);
                    return (item[textOpt] ? item[textOpt].toLowerCase() : '').includes(inputText);
                }).slice(0, 5);

                let listaSearchOptions = document.querySelectorAll(`${listaSearch} option`);
                // Iterar sobre cada opción
                listaSearchOptions.forEach(function (option) {
                    // Eliminar cada opción
                    option.remove();
                });

                if (filteredNames.length > 0) {
                    filteredNames.forEach(function (item) {

                        let option = $('<option>').val(item[valorOpt]).text(item[textOpt]);
                        listaPadre.append(option);

                        option.on('mousedown', function (event) {
                            event.preventDefault(); // Prevenir el comportamiento predeterminado
                            // eliminar option anteriores
                            selectPadre.empty();
                            // agregar el option seleccionado
                            selectPadre.append(option);
                            limpiarLista();
                            resolve(item);
                        });
                    });
                } else {
                    listaPadre.append('<option disabled>No se encontraron resultados</option>');
                }
            }

            function limpiarLista() {
                // Ocultar y Limpiar busqueda
                let listaSearchOptions = document.querySelectorAll(`${listaSearch} option`);
                listaSearchOptions.forEach(function (option) {
                    option.remove();
                });
                $(inputSearch).val('');
                $(listaSearch).hide();

                currentIndex = -1;
            }

        } catch (error) {
            console.error('Error al obtener y mostrar los datos:', error);
            reject('error')
        }
    });
}

// celda, datos a buscar[id-nombre]*, div, scrolldiv
async function mostrarListaGrid(cellElement, datos, contLista, contScroll) {

    return new Promise((resolve, reject) => {
        try {

            const contFiltro = document.querySelector(contLista);

            //  QUITAR ESTO ADD SASS
            contFiltro.style.zIndex = 10;
            contFiltro.style.position = 'absolute';
            contFiltro.style.backgroundColor = 'white';
            //  QUITAR ESTO ADD SASS

            // Crear el elemento para el input de búsqueda
            const inputSearch = document.createElement('input');
            inputSearch.setAttribute('type', 'text');
            inputSearch.setAttribute('id', 'filtro_search');
            inputSearch.setAttribute('placeholder', 'Buscar...');
            inputSearch.setAttribute('autocomplete', 'off'); // Evitar el autocompletado del navegador

            // Crear el ícono de búsqueda
            const searchIcon = document.createElement('i');
            searchIcon.classList.add('fa-solid', 'fa-magnifying-glass');

            // Crear el contenedor para la lista de opciones
            const filtroList = document.createElement('div');
            filtroList.classList.add('container', 'Search');
            filtroList.setAttribute('id', 'filtro_list');

            // Agregar el input y el ícono al primer div dentro del contenedor
            const inputDiv = document.createElement('div');
            inputDiv.appendChild(inputSearch);
            inputDiv.appendChild(searchIcon);

            // Agregar los elementos al contenedor principal
            contFiltro.appendChild(inputDiv);
            contFiltro.appendChild(filtroList);


            if (!contFiltro) return; // Salir si no se encuentra el contenedor

            const updatePopupPosition = () => {
                const contenedorScroll = document.querySelector(contScroll);
                if (!contenedorScroll) return; // Salir si no se encuentra el contenedor

                // Calcular la posición de la celda en relación con el contenedor con scroll
                const cellRect = cellElement.getBoundingClientRect();
                const contenedorRect = contenedorScroll.getBoundingClientRect();
                const cellTopInContainer = cellRect.top - contenedorRect.top + contenedorScroll.scrollTop;

                // Altura del div que se mostrará encima de la celda (ajustar según tu contenido)
                const popupDivHeight = 100; // Altura del div en píxeles

                // Calcular la posición superior del div encima de la celda en el contenedor
                const popupTop = cellTopInContainer + cellElement.clientHeight;

                // Actualizar la posición del contenedor filtro
                if (contFiltro) {
                    contFiltro.style.left = `${cellRect.left}px`; // Posición izquierda de la celda
                    contFiltro.style.top = `${popupTop}px`; // Posición encima del popupDiv
                    // contFiltro.style.width = `${cellRect.width}px`; // Ancho igual al ancho de la celda
                }
            };

            const existeLista = document.querySelector('#filtro_list ul option');
            if (existeLista) return

            $(contFiltro).show();
            // Crear el div para mostrar encima de la celda clicada
            // const filtroList = document.querySelector('#filtro_list');
            const listUL = document.createElement('ul');
            if (datos.length > 0) {
                datos.forEach(function (item) {
                    let option = $('<option>').val(item.id).text(item.nombre);
                    listUL.appendChild(option[0]); // Convertir el elemento jQuery a un DOM node y añadirlo al listUL
                });
            }
            filtroList.appendChild(listUL);

            // Insertar el div en el contenedor con scroll
            const contenedorScroll = document.querySelector(contScroll);
            if (contenedorScroll) {
                contenedorScroll.appendChild(contFiltro);
                // Actualizar la posición inicial del div
                updatePopupPosition();
            }

            // Agregar un listener para cerrar el div al hacer clic fuera de él
            const closePopup = function (e) {
                if (!contFiltro.contains(e.target) && !listUL.contains(e.target) && e.target !== cellElement) {
                    // Cerrar el filtro y limpiar el listUL
                    $(contFiltro).hide();
                    $(listUL).empty();

                    limpiarLista();

                    // Eliminar el listener de clic para cerrar el popup
                    document.removeEventListener('click', closePopup);
                    contenedorScroll.removeEventListener('scroll', updatePopupPosition); // Detener el seguimiento del scroll del contenedor
                }
            };

            // Agregar un listener para cerrar el div al hacer clic fuera de él
            document.addEventListener('click', closePopup);

            // let inputSearch = $(contFiltro).find('input');
            inputSearch.focus();
            let currentIndex = -1; // Variable para almacenar el índice de la opción actualmente seleccionada

            // Navegar con Flechas
            $(inputSearch).keydown(async event => {
                const listaSearchOptions = $(listUL).find('option');
                const totalOptions = listaSearchOptions.length;
                if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    currentIndex = (currentIndex + 1) % totalOptions;
                    await actualizarSeleccion();
                } else if (event.key === 'ArrowUp') {
                    event.preventDefault();
                    currentIndex = currentIndex === -1 || currentIndex === 0 ? totalOptions - 1 : (currentIndex - 1 + totalOptions) % totalOptions;
                    actualizarSeleccion();
                } else if (event.key === 'Enter' && currentIndex !== -1) {
                    event.preventDefault();
                    let option = listaSearchOptions.eq(currentIndex);
                    let selectedOption = option.clone();
                    listUL.append(selectedOption);
                    let selectedValue = option.val();
                    let objetoSeleccionado = datos.find(objeto => objeto['id'] === parseInt(selectedValue));
                    resolve(objetoSeleccionado);
                    limpiarLista();
                }
            });

            async function actualizarSeleccion() {
                const listaSearchOptions = $(listUL).find('option');
                listaSearchOptions.removeClass('listOption');
                if (currentIndex !== -1) {
                    listaSearchOptions.eq(currentIndex).addClass('listOption');
                }
            }

            // Buscador 
            filtrarDatos();

            $(inputSearch).on('input blur', function (event) {
                if (event.type === "input") {
                    filtrarDatos();
                } else if (event.type === "blur") {
                    limpiarLista();
                }
            });

            function filtrarDatos() {
                let inputText = $(inputSearch).val().trim().toLowerCase();
                let filteredDatos = datos.filter(function (item) {
                    let nombre = (item['nombre'] || '').trim().toLowerCase();
                    return nombre.includes(inputText) && nombre.length > 0;
                }).slice(0, 6);

                // Vaciar el contenido actual del listUL antes de actualizar
                $(listUL).empty();

                if (filteredDatos.length > 0) {
                    // Crear y agregar nuevas opciones filtradas al listUL
                    filteredDatos.forEach(function (item) {
                        let option = $('<option>').val(item.id).text(item.nombre);
                        $(listUL).append(option);

                        option.on('mousedown', function (event) {
                            event.preventDefault(); // Prevenir el comportamiento predeterminado
                            // eliminar option anteriores
                            $(filtroList).empty();

                            // agregar el option seleccionado
                            listUL.append(option);
                            resolve(item);
                            limpiarLista();
                        });

                    });
                } else {
                    $(listUL).append('<option disabled>No se encontraron resultados</option>');
                }

                // Reiniciar el índice actual después de filtrar
                currentIndex = -1;
                // Actualizar la selección resaltada si es necesario
                actualizarSeleccion();
            }

            function limpiarLista() {
                $(contFiltro).hide();
                $(contFiltro).empty();
                $(listUL).empty();
                $(filtroList).empty();
                currentIndex = -1;
            }

        } catch (error) {
            console.error('Error al obtener y mostrar los datos:', error);
            reject('error')
        }
    });
}

// Establecer Fecha Actual D-M-Y
function setFechaActual(id) {
    let elemento = document.getElementById(id);
    // Crear un nuevo objeto de fecha con la fecha y hora actual
    let fechaActual = new Date();
    let dia = fechaActual.getDate().toString().padStart(2, '0'); // Asegura que el día tenga dos dígitos
    let mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Asegura que el mes tenga dos dígitos
    let anio = fechaActual.getFullYear();

    // Formatear la fecha como D-M-Y
    let fechaFormateada = dia + '/' + mes + '/' + anio;

    // Asignar la fecha formateada al elemento
    elemento.value = fechaFormateada;
}
function obtenerFechaActual() {
    let fechaActual = new Date();
    let dia = fechaActual.getDate().toString().padStart(2, '0'); // Asegura que el día tenga dos dígitos
    let mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Asegura que el mes tenga dos dígitos
    let anio = fechaActual.getFullYear();

    return anio + '/' + mes + '/' + dia;
}

// Formato de Fecha a Y-M-D
function formatearFecha(fecha) {
    if (!fecha) return null; // Manejar caso de fecha vacía o nula

    // Convertir a string si no lo es (por ejemplo, si es un objeto Date)
    fecha = fecha.toString();

    // Verificar si la fecha es en formato 'YYYY-MM-DD'
    if (fecha.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // Si es 'YYYY-MM-DD', simplemente devolverla en formato 'DD/MM/YYYY'
        const [year, month, day] = fecha.split('-');
        // return `${day}/${month}/${year}`;
        return `${year}/${month}/${day}`;
    }

    // Intentar parsear la fecha
    let parsedDate = new Date(fecha);
    if (!isNaN(parsedDate.getTime())) {
        // Si el parseo fue exitoso, formatear la fecha en 'DD/MM/YYYY'
        let dia = parsedDate.getDate().toString().padStart(2, '0');
        let mes = (parsedDate.getMonth() + 1).toString().padStart(2, '0'); // Sumamos 1 porque los meses van de 0 a 11
        let año = parsedDate.getFullYear();
        // return `${dia}/${mes}/${año}`;
        return `${año}/${mes}/${dia}`;
    }

    // Si no se puede parsear la fecha, devolver null o la fecha original
    return fecha;
}
// Y/M/D
function formatearFechaYear(fecha) {
    // Si la entrada es una cadena de texto, intenta convertirla a un objeto Date
    if (typeof fecha === 'string') {
        // Verifica si la fecha ya está en el formato 'YYYY/MM/DD' o 'YYYY-MM-DD'
        if (/^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(fecha)) {
            // Si el separador es '-', reemplazarlo por '/'
            if (fecha.includes('-')) {
                fecha = fecha.replace(/-/g, '/');
            }
            return fecha; // Ya está en el formato correcto
        } else {
            // Si no, intenta parsear la fecha como una fecha estándar de JavaScript
            fecha = new Date(fecha);
        }
    } else if (!(fecha instanceof Date)) {
        return ''
    }

    // Obtener año, mes y día
    const anio = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Meses son 0-indexed
    const dia = fecha.getDate().toString().padStart(2, '0');

    // Retornar la fecha formateada
    return `${anio}/${mes}/${dia}`;
}

function obtenerDia(fecha) {
    if (!fecha) return null; // Manejar caso de fecha vacía o nula

    // Asumir que la fecha viene en formato 'DD/MM/YYYY'
    const partes = fecha.split('/');

    // Verificar que la fecha tiene 3 partes (día, mes, año)
    if (partes.length === 3) {
        const [año, mes, dia] = partes;
        return dia; // Devolver el día
    }

    return null; // Devolver null si el formato no es válido
}
// D/M/Y
function formatearFechaCompleta(fechaCompleta) {
    // Crear un objeto de fecha
    let fecha = new Date(fechaCompleta);

    // Verificar si la fecha es válida
    if (isNaN(fecha.getTime())) {
        return null; // Devuelve null si la fecha no es válida
    }

    // Obtener los componentes de la fecha
    let dia = fecha.getDate();
    let mes = fecha.getMonth() + 1; // Los meses van de 0 a 11, sumamos 1 para obtener el mes correcto
    let año = fecha.getFullYear();

    // Formatear la fecha en Día/Mes/Año
    return `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${año}`;
}

function convertirAFecha(fechaStr) {
    if (!fechaStr) return null; // Manejar caso de fecha vacía o nula

    // if(fechaStr != Number) return new Date('Y-m-d');
    const partes = fechaStr.split('/');
    const año = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1; // Los meses en JavaScript van de 0 a 11
    const dia = parseInt(partes[2], 10);
    return new Date(año, mes, dia);
}
function calcularDiferenciaDias(fecha1, fecha2) {
    if(!fecha1 || !fecha2) return null
    const fechaInicio = convertirAFecha(fecha1);
    const fechaFin = convertirAFecha(fecha2);

    const diferenciaTiempo = fechaFin.getTime() - fechaInicio.getTime();
    // const diferenciaTiempo = fechaFin - fechaInicio;
    const diferenciaDias = diferenciaTiempo / (1000 * 60 * 60 * 24); // Convertir de milisegundos a días
    return diferenciaDias;
}

function formatearHoraFloat(valor) {
    // Expresión regular para encontrar el patrón de hora
    const patron = /(\d+):(\d+)/;
    const match = valor.match(patron);

    if (match) {
        const horas = parseInt(match[1]);
        const minutos = parseInt(match[2]);
        const totalMinutos = horas * 60 + minutos;
        // Convertir los minutos a un número flotante
        const resultado = totalMinutos / 60.0;
        return resultado.toFixed(2);
    } else {
        return null;
    }
}
// Formato hora con ':'
async function formatoHora(hora) {

    let horas = 0;
    let minutos = 0;
    if (hora) {
        if (hora.includes(':')) {
            const partes = hora.split(':');

            horas = partes[0];
            minutos = partes[1];
        } else {
            horas = hora;
        }
    } else {
        horas = hora;
    }
    // Convertir el valor numérico a horas y minutos
    const hrsNum = parseFloat(horas);
    const minNum = parseFloat(minutos);

    const horaFormateada = `${hrsNum.toString().padStart(2, '0')}:${minNum.toString().padStart(2, '0')}`;
    const horaRegex = /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;

    if (horaRegex.test(horaFormateada)) {
        return horaFormateada; // Devolver la hora formateada si es válida
    } else {
        return '00:00'; // Devolver un valor por defecto si el formato no es válido
    }
}

function limpiarRuta(id) {
    let form = document.getElementById(id);

    // Obtener todos los elementos select dentro del formulario
    let selects = form.querySelectorAll('select');

    // Iterar sobre cada elemento select
    selects.forEach(function (select) {
        let selectId = select.id;
        // Obtener el primer option del select
        let firstOption = select.querySelector('option');

        if (selectId.includes('origen')) {
            firstOption.text = 'Origen';
        } else if (selectId.includes('destino')) {
            firstOption.text = 'Destino';
        } else {
            console.log('No se reconoce el tipo')
        }
    });
}
// Pasar idForm, quitar o poner
async function deshabilitarElemento(...elementoId) {
    elementoId.forEach(id => {
        const elemento = document.getElementById(id);
        elemento.classList.add('disabled-element'); // Agregar clase para deshabilitar estilos
        // elemento.disabled = true;
    });

}
async function habilitarElemento(...elementoId) {
    elementoId.forEach(id => {
        const elemento = document.getElementById(id);
        elemento.classList.remove('disabled-element'); // Agregar clase para deshabilitar estilos
        // elemento.disabled = false;
    });

}

