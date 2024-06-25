let menu = [];
let glob;
let bandera = 0;
let rutaServer;


document.addEventListener('DOMContentLoaded', function () {
    iniciarApp();
    eventos();
});

function eventos() {

    const menuPerfil = document.querySelector('.header_icon');
    let infoPerfil = document.querySelector('.header_icon_info');

    const toggleInfoPerfil = () => {
        infoPerfil.classList.toggle('ocultar');
    };

    menuPerfil.addEventListener('click', toggleInfoPerfil);

    document.addEventListener('click', (event) => {
        if (!infoPerfil.contains(event.target) && !menuPerfil.contains(event.target)) {
            infoPerfil.classList.add('ocultar');
        }
    });

}

window.addEventListener('resize', function () {

    if (window.innerWidth > 768) {
        document.getElementById("menu").classList.add("ocultar");
        document.querySelector('.menu').checked = false;
        document.querySelector(".navigation").classList.remove("ocultar");
        document.querySelector(".secciones").classList.remove("ocultar");
        document.querySelector('.navigation ul').classList.remove('show');
    } else {
        document.querySelector(".navigation").classList.add("ocultar");
        document.querySelector(".secciones").classList.add("ocultar");
    }
});

async function iniciarApp() {
    await obtenerDatos();
    await tabs(); 
}

async function obtenerDatos() {

    // obtener datos de la BD 
    try {
        // const respuesta = await fetch('http://localhost:3000/obtener/menu', {
        const respuesta = await fetch(`${location.origin}/obtener/menu`, {
            method: 'GET',
        });
        const data = await respuesta.json();
        // console.log(data);

        menu = data;
        menu.sort((a, b) => a.PadreId - b.PadreId);
        menu.sort((a, b) => a.Nivel - b.Nivel);
        // console.log(menu);

        // ver la forma de hacer esto en 1 sola función
        await crearMenuMovil(menu);
        await crearMenu(menu);

    } catch (error) {
        console.error(error);
        alert('Error al obtener datos BD');
    }
}

function tabs() {
    const botones = document.querySelectorAll('.navigation .navigation_list li');
    botones.forEach(boton => {
        boton.addEventListener('click', async function (e) {
            const seccionAnterior = document.querySelector('.actual');
            if (seccionAnterior) {
                seccionAnterior.classList.remove('actual');
            }
            paso = parseInt(e.target.dataset.paso);
            if (paso) {
                const cc = document.querySelectorAll(`[data-paso='${paso}']`);
                cc[0].classList.add('actual');
                if (bandera == paso) {
                    $(`section aside ul`).empty();
                    $(`section aside ul li`).remove();
                    $(`section article`).empty();
                    const cc = document.querySelectorAll(`[data-paso='${paso}']`);
                    cc[0].classList.remove('actual');
                    bandera = 0
                } else {
                    $(`section aside ul li`).remove();
                    $(`section article`).empty();
                    await mostrarAside(paso);
                    bandera = paso
                }
            }
        })
    });
}



// Desktop
async function crearMenu(menu) {
    let tab;
    let paso;

    // $(".navigation_list").empty();
    // document.querySelector('.secciones').innerHTML = '';

    // rutaServer = await obtenerRuta();
    rutaServer = location.origin;

    for (i in menu) {
        if (menu[i]['PadreId'] == null) {
            let className = menu[i].Nombre.replace(" ", "");

            // Creamos el elemento <a> y le asignamos la ruta si está disponible
            let link = '';

            // Ruta LVL1 
            if (menu[i]['Ruta']) {
                link = `<a href="${rutaServer + '/' + menu[i]['Ruta']}">${menu[i]['Nombre']}</a>`;
            } else {
                link = `${menu[i]['Nombre']}`;
            }

            // Agregamos el <li> con el enlace dentro
            $(".navigation_list").append(`<li>${link}</li>`); // ecma6

            document.querySelectorAll('.navigation ul li')[i].setAttribute('data-paso', menu[i]['MenuId']);
            // se repite (NO debe)
            tab = document.querySelector(`[data-paso="${menu[0]['MenuId']}"]`);
            paso = menu[0]['MenuId'];

            // CREAR SECCIONES
            const seccionMenu = document.createElement('SECTION');
            seccionMenu.setAttribute('data-paso-sec', menu[i]['MenuId']);

            const seccionAside = document.createElement('ASIDE');

            const sideUl = document.createElement('UL');

            const sideLI = document.createElement('LI');

            const article = document.createElement('ARTICLE');
            article.setAttribute('data-paso-art', menu[i]['MenuId']);

            seccionMenu.appendChild(seccionAside);
            seccionMenu.appendChild(article);
            seccionAside.appendChild(sideUl);

            document.querySelector('.secciones').appendChild(seccionMenu);
        }
    }

}

function crearSubMenu(menu) {
    for (var i = 0; i < menu.length; i++) {
        //obtenemos la class que le dimos en la function pasada para 
        //agregar el  submenu
        var className = menu[i].cMenu.replace(" ", "");
        if (i == 0) {
            //agregamos un <ul> el cual va hacer el contenedor del submenu
            $("." + className).append('<ul class="subNav"></ul>')
        }
        //y por ultimo agregamos los item al submenu
        $("." + className + " ul").append("<li   class=" + className + ">" + menu[i].cSubMenu + "</li>")
    }
}

async function mostrarAside(paso) {

    const menuAside = document.querySelector(`[data-paso-sec="${paso}"]`);

    for (i in menu) {
        if (menu[i]['PadreId'] == paso) {
            // console.log(menu[i]['Ruta']);
            // validamos aqui si tiene ruta 
            $(`[data-paso-sec="${paso}"] aside ul`).append(`<li><a data-submenu='${menu[i]['MenuId']}' ${menu[i]['Ruta'] ? `href='${rutaServer + '/' + menu[i]['Ruta']}'` : ''}>${menu[i]['Nombre']}</a></li>`);
        }
    }

    const ss = document.querySelectorAll(`[data-paso-sec="${paso}"] aside ul li a`);
    const treeElement = document.querySelector(`[data-paso-art="${paso}"]`);

    ss.forEach(boton => {
        boton.addEventListener('click', function (e) {



            $(`[data-paso-art="${paso}"]`).empty();
            let nuevo = parseInt(e.target.dataset.submenu);
            // quitar clase a los demas li 
            const cc = document.querySelectorAll(`.asideActivo`);
            if (cc.length > 0) {

                // console.log(cc[0].classList.remove(`asideActivo`));
            }

            boton.parentNode.classList.add('asideActivo')

            mostrarArticulo(treeElement, menu, nuevo);
        })
    });

}

async function obtenerRuta() {

    try {
        const respuesta = await fetch(`${location.origin}/ruta`, {
            method: 'get',
        });
        const data = await respuesta.json();
        return data;
    } catch (error) {

    }

}

function mostrarArticulo(parentElement, data, parentId) {

    const secciones = document.querySelectorAll(`[data-Nivel='3'] [data-Nivel] `);

    secciones.forEach(boton => {
        boton.addEventListener('click', function (e) {
            // console.log(boton);
            boton.classList.add('test');
        })
    });

    const children = data.filter(item => item.PadreId === parentId);
    // aqui se creea el 3er nivel +
    if (children.length > 0) {

        const ul = document.createElement('ul');
        parentElement.appendChild(ul);
        ul.classList.add('mostrar');

        children.forEach(child => {

            const li = document.createElement('li');

            ul.appendChild(li);
            ul.setAttribute('data-Nivel', child.Nivel);

            const span = document.createElement('span');
            span.setAttribute('data-menu', child.MenuId);
            span.textContent = child.Nombre;

            let link = document.createElement('A');
            link.setAttribute('data-menu', child.MenuId);
            link.textContent = child.Nombre;
            // Agregar clase si tiene una propiedad 'Ruta'
            if (child.Ruta) {
                li.classList.add('conRuta');
                // console.log(rutaServer);
                link.setAttribute('href', child.Ruta);
            }

            link.addEventListener('click', function (e) {

                if (child.Ruta) {
                    // window.open(child.Ruta, '_blank');
                    // window.open(child.Ruta);
                } else {

                    const submenu = $(li).children('ul');
                    // console.log(li);
                    // console.log('AQUI PUEDE IR EL CONTEO');
                    if (submenu.length > 0) {
                        submenu.slideToggle();
                    } else {
                        // console.log('mas hijos');
                        mostrarArticulo(li, data, child.MenuId);
                    }
                }
            });

            // li.appendChild(span);
            li.appendChild(link);
        });
    }


}

// Menu Movil
async function crearMenuMovil(menu) {
    const menuArbol = construirArbol(menu);

    // console.log(menuArbol);
    document.getElementById('menu').innerHTML = generateMenu(menuArbol);

    var menuItems = document.querySelectorAll('#menu li');
    var menuItemsLvl1 = document.querySelectorAll('#menu > li');

    menuItemsLvl1.forEach(function (item) {
        // icono activo 
        item.addEventListener('click', function (e) {
            let valorClass = item.children[0];
            // Verifica si este icono tiene la clase 'activa'
            var isActive = valorClass.classList.contains("activa");
            // Elimina la clase 'activa' de todos los elementos
            for (var j = 0; j < menuItemsLvl1.length; j++) {
                menuItemsLvl1[j].children[0].classList.remove("menu-activo");
            }
            // Si este icono no tenía la clase 'activa', agrégasela
            if (!isActive) {
                valorClass.classList.add("menu-activo");
            }
        });
    });

    menuItems.forEach(function (item) {

        var parentLink = item.querySelector('.parent');

        parentLink.addEventListener('click', function (e) {
            var submenu = item.querySelector('.submenu');

            e.preventDefault();
            if (submenu) {
                submenu.style.display = (submenu.style.display === 'block') ? 'none' : 'block';
            } else {
                var href = parentLink.getAttribute('href');
                // console.log(href);
                if (href) {
                    window.location.href = href;
                }
            }
        });

    });
}
function toggleMenu() {
    // let navBr = document.getElementById("menu");
    let navBr = document.getElementById("menu");
    navBr.classList.toggle('ocultar');
    navBr.classList.toggle('mostrar');
}

function generateMenu(menuData, parentElement) {
    var menuHtml = '';
    for (var key in menuData) {
        var item = menuData[key];
        var submenuHtml = '';
        var hasSubmenu = item.submenu && Object.keys(item.submenu).length > 0; // Verifica si hay submenú

        if (hasSubmenu) {
            let val = parseInt(item.Nivel) + 1;
            submenuHtml = '<ul class="submenu" data-nivel="' + val + '">' + generateMenu(item.submenu) + '</ul>';
        }

        menuHtml += '<li class="menu-item' + (hasSubmenu ? ' has-submenu' : '') + '">' +
            '<a ' + (item.Ruta ? 'href="' + `${location.origin}/` + item.Ruta + '" ' : '') + ' class="parent" ' + (item.Ruta ? 'target="_self"' : '') + '>' +
            item.Nombre +
            (hasSubmenu ? '<span class="arrow-down"></span>' : '') + // Agrega un icono si hay submenú
            '</a>' +
            submenuHtml +
            '</li>';
    }
    return menuHtml;
}
function construirArbol(menuData, parentId = null) {
    const menuItems = menuData.filter(item => item.PadreId === parentId);

    if (menuItems.length === 0) {
        return null;
    }

    const menu = {};

    menuItems.forEach(item => {
        const submenu = construirArbol(menuData, item.MenuId);
        if (submenu) {
            item.submenu = submenu;
        }
        menu[item.MenuId] = item;
    });

    return menu;
}



// // FUNCION PARA CONTROLAR  EL MENU MOVIL CON FLECHAS
// $(document).on("click", ".menu-item a", e => {

//     var icon = e.target.children[0];
//     if (icon) {

//         if (icon.tagName.toLowerCase() === 'span') {

//             if (icon.classList.contains('arrow-down')) {
//                 icon.classList.add('arrow-up');
//                 icon.classList.remove('arrow-down');
//             } else {
//                 icon.classList.remove('arrow-up');
//                 icon.classList.add('arrow-down');
//             }
//         }
//     }
// });


// FUNCION PARA CONTROLAR  EL MENU MOVIL CON FLECHAS
$(document).on("click", ".menu-item a", function () {
    var icon = $(this).find('span.arrow-down, span.arrow-up');
    if (icon.length) {
        icon.toggleClass('arrow-down arrow-up');
    }
});