<?php

function debuguear($variable): string
{
    echo "<pre>";
    var_dump($variable);
    echo "</pre>";
    exit;
}

// sanitizar entrada de datos 
function s($html): string
{
    // $s = htmlspecialchars($html);
    // return $s;

    return htmlspecialchars($html, ENT_QUOTES, 'UTF-8');
}

// Revisa que el usuario este autenticado 
function isAuth(): bool
{

    if (!isset($_SESSION)) {
        session_start();
    }

    // Verificar si la sesión es válida
    if (
        !isset($_SESSION['id']) ||
        $_SESSION['user_agent'] !== $_SERVER['HTTP_USER_AGENT'] ||
        $_SESSION['user_ip'] !== $_SERVER['REMOTE_ADDR']
    ) {
        return false;
    }

    // Verificar inactividad
    $timeout = 1800; // 30 minutos
    if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY'] > $timeout)) {
        session_unset();
        session_destroy();
        return false;
    }
    $_SESSION['LAST_ACTIVITY'] = time();

    return true;
    // return isset($_SESSION['id']) && !empty($_SESSION);
}

// function fechaMX($fecha)
// {
//     // Separar la fecha en partes (año, mes, día)
//     list($año, $mes, $dia) = explode('/', $fecha);

//     return "$dia/$mes/$año";
// }

function fechaMX($fecha)
{
    // Intentar separar la fecha por guiones
    $partes = explode('-', $fecha);
    
    // Si no se pudo separar por guiones, intentar por barras
    if (count($partes) !== 3) {
        $partes = explode('/', $fecha);
    }

    // Verificar si se obtuvieron las tres partes (año, mes, día)
    if (count($partes) === 3) {
        $año = $partes[0];
        $mes = $partes[1];
        $dia = $partes[2];

        return "$dia/$mes/$año";
    } else {
        // En caso de que no se puedan separar correctamente, puedes manejar el error o devolver la fecha original
        return $fecha;
    }
}


function formatoComa($dato)
{
    return $num_formateado = number_format($dato, 2, '.', ',');
}

function generateCsrfToken()
{
    if (!isset($_SESSION)) {
        session_start();
    }

    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }

    return $_SESSION['csrf_token'];
}
function verifyCsrfToken($token)
{
    if (!isset($_SESSION)) {
        session_start();
    }

    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}