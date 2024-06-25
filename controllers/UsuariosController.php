<?php

namespace Controllers;

use Model\ActiveRecord;
use MVC\Router;
use Model\Usuario;

class UsuariosController
{
    // static para no crear una nueva instancia 
    // y le pasamos el router ya creado 
    public static function usuario(Router $router)
    {

        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('usuarios')) {
            header('Location: /dashboard');
            exit;
        }

        $router->render('userGestion/usuarios', [
            'titulo' => "Usuarios",
        ]);
    }

    public static function usuarios()
    {

        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('usuarios')) {
            header('Location: /dashboard');
            exit;
        }

        $userAll = Usuario::allForeing("u.*,t1.nombre as empleado_nombre, t2.nombre_rol as rol_nombre", [
            "empleados t1" => "u.empleado_id = t1.empleado_id",
            "roles t2" => "u.rol_id = t2.rol_id"
        ]);
        $userAll = isset($userAll) ? (is_array($userAll) ? $userAll : array($userAll)) : '';

        echo json_encode($userAll);
    }

    public static function activos()
    {

        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('usuarios')) {
            header('Location: /dashboard');
            exit;
        }

        $rolAll = Usuario::where("estatus", "Activo");
        $rolAll = isset($rolAll) ? (is_array($rolAll) ? $rolAll : array($rolAll)) : '';

        echo json_encode($rolAll);
    }

    public static function crear()
    {

        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('usuarios')) {
            header('Location: /dashboard');
            exit;
        }

        $alertas = [];
        $usuario = new Usuario;

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            // sincronizar datos del form con el modelo 
            $usuario->sincronizar($_POST);
            $usuario->fecha_creacion = date('Y-m-d H:i:s');
            $usuario->user_creacion = $_SESSION["nombre_user"];
            $usuario->user_modificacion = $_SESSION["nombre_user"];
            $usuario->ip_user = $_SERVER['REMOTE_ADDR'];

            $existeUsuario = Usuario::where('nombre_completo', $usuario->nombre_completo);

            if ($existeUsuario) {
                Usuario::setAlerta('error', 'El Usuario ya esta registrado');
                $alertas = Usuario::getAlertas();
                $respuesta['alertas']  = $alertas;
            }
            if (empty($alertas)) {

                // Hashear el password
                $usuario->hashPassword();

                // Eliminar password2
                unset($usuario->password2);

                // Generar el Token
                // Crear un nuevo usuario
                $resultado =  $usuario->guardar();
                if ($resultado["resultado"] == 1) {
                    $respuesta['exito'] = $exito = 1;
                } else {
                    $respuesta['exito'] = $exito = 0;
                    $respuesta['errorSMS'] = $resultado['error'];
                }
            }
        }

        echo json_encode($respuesta);
    }

    public static function actualizar()
    {
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('usuarios')) {
            header('Location: /dashboard');
            exit;
        }

        $alertas = [];
        $usuario = new Usuario;

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            // sincronizar datos del form con el modelo 
            $usuario->sincronizar($_POST);
            $usuario->user_modificacion = $_SESSION["nombre_user"];
            $usuario->ip_user = $_SERVER['REMOTE_ADDR'];
            $usuario->fecha_ult_acceso = date('Y-m-d H:i:s');

            // Validar el ID
            $usuario_id = $_POST['usuario_id'];
            $usuario_id = filter_var($usuario_id, FILTER_VALIDATE_INT);

            if (!$usuario_id) {
                header('Location: /usuarios');
            }

            // Obtener Usuario a Editar
            $user_BD = Usuario::where('usuario_id', $usuario->usuario_id);


            if (!$user_BD) {
                Usuario::setAlerta('error', 'El Usuario no esta registrado');
                $alertas = Usuario::getAlertas();
                $respuesta['alertas']  = $alertas;
            }
            if (empty($alertas)) {

                // Hashear el nuevo password
                $usuario->hashPassword();

                if ($_POST["password"] == 'none') {
                    $usuario->password = $user_BD->password;
                }
                // if ($user_BD->password == $_POST["password"]) {}

                $resultado = $usuario->guardar();
                

                if ($resultado["resultado"] == 1) {
                    $respuesta['exito'] = $exito = 1;
                } else {
                    $respuesta['exito'] = $exito = 0;
                    $respuesta['errorSMS'] = $resultado['error'];
                }
            }
        }

        echo json_encode($respuesta);
    }

    public static function eliminar()
    {

        $alertas = [];

        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('usuarios')) {
            header('Location: /dashboard');
            exit;
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            $id = $_POST['usuario_id'];
            $usuario = Usuario::where('usuario_id', $id);

            if (!isset($usuario)) {
                Usuario::setAlerta('error', 'El Usuario cno existe');
                $alertas = Usuario::getAlertas();
                $respuesta['alertas']  = $alertas;
            }

            if (empty($alertas)) {
                // $resultado = $usuario->eliminar();
                $respuesta['exito'] = $exito = 1;
            }
        }

        echo json_encode($respuesta);
    }
}
