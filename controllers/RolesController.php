<?php

namespace Controllers;

use Model\ActiveRecord;
use MVC\Router;
use Model\Rol;

class RolesController
{

    public static function rol(Router $router)
    {

        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('roles')) {
            header('Location: /dashboard');
            exit;
        }

        $router->render('userGestion/roles', [
            'titulo' => "Roles",
        ]);
    }

    public static function roles()
    {
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('roles')) {
            header('Location: /dashboard');
            exit;
        }

        $rolAll = Rol::allForeing("*", [], "ASC");
        $rolAll = isset($rolAll) ? (is_array($rolAll) ? $rolAll : array($rolAll)) : '';

        echo json_encode($rolAll);
    }

    public static function activo()
    {

        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('roles')) {
            header('Location: /dashboard');
            exit;
        }

        $rolAll = Rol::where("estatus", "Activo");
        $rolAll = isset($rolAll) ? (is_array($rolAll) ? $rolAll : array($rolAll)) : '';

        echo json_encode($rolAll);
    }

    public static function crear(Router $router)
    {

        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('roles')) {
            header('Location: /dashboard');
            exit;
        }

        $alertas = [];
        $rol = new Rol;

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            $rol->sincronizar($_POST);
            $rol->fecha_creacion = date('Y-m-d H:i:s');
            $rol->user_creacion = $_SESSION["nombre_user"];
            $rol->user_modificacion = $_SESSION["nombre_user"];
            $rol->ip_user = $_SERVER['REMOTE_ADDR'];

            $existeRol = Rol::where('nombre_rol', $rol->nombre_rol);

            if ($existeRol) {
                Rol::setAlerta('error', 'El Rol ya existe.');
                $alertas = Rol::getAlertas();
                $respuesta['alertas']  = $alertas;
            }
            if (empty($alertas)) {
                $resultado =  $rol->guardar();

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
        if (ActiveRecord::hasPermission('roles')) {
            header('Location: /dashboard');
            exit;
        }

        $alertas = [];
        $rol = new Rol;

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // sincronizar datos del form con el modelo 
            $rol->sincronizar($_POST);

            // Validar el ID
            $rol_id = $_POST['rol_id'];
            $rol_id = filter_var($rol_id, FILTER_VALIDATE_INT);

            if (!$rol_id) {
                header('Location: /roles');
            }

            // Obtener Usuario a Editar
            $user_BD = Rol::where('rol_id', $rol->rol_id);

            if (!$user_BD) {
                Rol::setAlerta('error', 'El Rol no existe.');
                $alertas = Rol::getAlertas();
                $respuesta['alertas'] = $alertas;
            }

            if (empty($alertas)) {
                $rol->fecha_creacion = $user_BD->fecha_creacion;
                $rol->user_creacion = $user_BD->user_creacion;
                // $rol->user_modificacion = $_SESSION["nombre_user"];
                // $rol->ip_user = $_SERVER['REMOTE_ADDR'];

                $resultado  = $rol->guardar();

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
            header('Location: /roles');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('roles')) {
            header('Location: /dashboard');
            exit;
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            $id = $_POST['rol_id'];
            $rol = Rol::where('rol_id', $id);

            if (!isset($rol)) {
                Rol::setAlerta('error', 'El Rol no existe');
                $alertas = Rol::getAlertas();
                $respuesta['alertas'] = $alertas;
            }

            if (empty($alertas)) {
                // $resultado = $rol->eliminar();
                $respuesta['exito'] = $exito = 1;
            }
        }

        echo json_encode($respuesta);
    }
}
