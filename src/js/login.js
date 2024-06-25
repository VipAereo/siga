
// Utilizando el Principio de Modularidad
$(function () {
    configurarBotones();
});

function configurarBotones() {

    document.addEventListener("keydown", e => {
        if (e.key === 'Enter') {
            validarInputs();
        }
    });

    $("#logeo").click(e => {
        validarInputs();
    });
}

function validarInputs() {
    const nombre_user = $('#nombre_user').val();
    const password = $('#password').val();

    if (!nombre_user) {
        $('#nombre_user').addClass('campoRequerido');
        $('.login-user').addClass('errorInput');
    } else {
        $('#nombre_user').removeClass('campoRequerido');
        $('.login-user').removeClass('errorInput');
    }

    if (!password) {
        $('#password').addClass('campoRequerido');
        $('.login-pass').addClass('errorInput');
    } else {
        $('#password').removeClass('campoRequerido');
        $('.login-pass').removeClass('errorInput');
    }

    if (nombre_user && password) iniciarSesion();

}

async function iniciarSesion() {

    const nombre_user = $('#nombre_user').val();
    const password = $('#password').val();

    const datos = new FormData();
    datos.append('nombre_user', nombre_user);
    datos.append('password', password);

    try {
        const respuesta = await fetch('logeo', {
            method: 'POST',
            body: datos
        });
        const data = await respuesta.json();
        // console.log(data);

        if (data.exito == 1) {
            // aqui falta la ruta Server 
            window.location.href = '/';
        }

        if (data.userNoExist) {
            SwalToast('warning', data.userNoExist, 2500);
            $('#nombre_user').val('');
            $('#password').val('');
        }

        if (data.userAct) {
            SwalToast('warning', data.userAct, 2500);
            $('#nombre_user').val('');
            $('#password').val('');
        }

        if (data.pass) {
            SwalToast('warning', data.pass, 2500);
            $('#password').val('');
        }

    } catch (error) {
        console.error(error);
        SwalToast('warning', 'Error al obtener los usuarios', 2500);
    }

}