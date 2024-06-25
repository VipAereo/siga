<?php

namespace Controllers;

use MVC\Router;
use Model\Usuario;
// proteger vista 

class AuthController
{
    // static para no crear una nueva instancia 
    // y le pasamos el router ya creado 
    public static function login(Router $router)
    {
        // si ya inicio sesion
        if (isAuth()) {
            header('Location: /login');
        }

        // validar que tenga permiso en la ruta actual

        // debemos indicar la carpeta y el nombre del archivo
        $router->render('auth/login', [
            'titulo' => "Iniciar"
        ]);
    }

    // public static function loginS(Router $router)
    // {
    //     // si ya inicio sesion
    //     if (isAuth()) {
    //         header('Location: /dashboard');
    //     }

    //     $alertas = [];


    //     if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    //         $usuario = new Usuario($_POST);

    //         $alertas = $usuario->validarLogin();
    //     }

    //     if (empty($alertas)) {
    //         // Verificar quel el usuario exista

    //         $usuario = Usuario::where('nombre_user', $usuario->nombre_user);

    //         if (!$usuario) {
    //             Usuario::setAlerta('error', 'El Usuario No Existe.');
    //         } else {
    //             // El Usuario existe
    //             if ($_POST['password'] == $usuario->password) {
    //                 // Iniciar la sesión
    //                 session_start();
    //                 $_SESSION['id'] = $usuario->usuario_id;
    //                 $_SESSION['nombre_user'] = $usuario->nombre_user;

    //                 // Redirección 
    //                 header('Location: /dashboard');
    //             } else {
    //                 Usuario::setAlerta('error', 'Password Incorrecto');
    //             }
    //         }
    //     }

    //     $alertas = Usuario::getAlertas();

    //     $router->render('auth/login', [
    //         'titulo' => 'Iniciar Sesión',
    //         'alertas' => $alertas
    //     ]);
    // }

    public static function entrar()
    {

        // si ya inicio sesion
        if (isAuth()) {
            header('Location: /login');
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            $usuario = new Usuario($_POST);

            $alertas = $usuario->validarLogin();

            // si no hay errores 
            if (empty($alertas)) {
                // verificar que el usuario exista
                $user = Usuario::where('nombre_user', $usuario->nombre_user);

                if (!$user) {
                    $respuesta['userNoExist'] = ['El Usuario No Existe.'];
                } elseif ($user->estatus == 'Inactivo') {
                    $respuesta['userAct'] = ['Usuario No Activo'];
                } else {

                    // El Usuario existe y validar la contraseña
                    if (password_verify($_POST['password'], $user->password)) {

                        // Iniciar la sesión
                        session_start();

                        // Regenerar ID de sesión para prevenir fijación de sesión
                        session_regenerate_id(true);

                        // Configurar los parámetros de la cookie de sesión
                        session_set_cookie_params([
                            'httponly' => true, // No accesible via JS
                            'secure' => true,   // solo en conexciones HTTPS
                            'semesite' => 'Strict' // Prevenir CSRF
                        ]);

                        $_SESSION['id'] = $user->usuario_id;
                        $_SESSION['nombre_user'] = $user->nombre_user;
                        $_SESSION['user_agent'] = $_SERVER['HTTP_USER_AGENT'];
                        $_SESSION['user_ip'] = $_SERVER['REMOTE_ADDR'];
                        $_SESSION['LAST_ACTIVITY'] = time(); // Tiempo de última actividad

                        $respuesta['exito'] = 1;
                    } else {
                        $respuesta['pass'] = ['Contraseña Incorrecta.'];
                    }
                }
            } else {
                $respuesta = $alertas; // Si hay alertas, las pasamos directamente a la respuesta
            }
            echo json_encode($respuesta);
        }
    }

    public static function index(Router $router)
    {
        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // $router->render('admin/dashboard/index', [
        //     'titulo' => "Iniciar",
        // ]);
    }
    public static function logout()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            session_start();
            $_SESSION = [];
            header('Location: /login');
        }
    }

    // funcion para recuperar contraseña sin pedirla al administrador
    public static function olvide()
    {
    }
}
