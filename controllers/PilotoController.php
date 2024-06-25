<?php

namespace Controllers;

use Model\ActiveRecord;
use MVC\Router;
use Model\Piloto;

class PilotoController
{

    public static function piloto(Router $router)
    {

        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('pilotos')) {
            header('Location: /dashboard');
            exit;
        }

        $router->render('catalogos/piloto', [
            'titulo' => "Pilotos",
        ]);
    }

    public static function pilotos()
    {
        // Verifica que este logeado
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('pilotos')) {
            header('Location: /dashboard');
            exit;
        }

        $pilotoAll = Piloto::allForeing("u.*, nombre as empleado_nombre", [
            "empleados t1" => "u.empleado_id = t1.empleado_id"
        ]);
        $pilotoAll = isset($pilotoAll) ? (is_array($pilotoAll) ? $pilotoAll : array($pilotoAll)) : '';

        echo json_encode($pilotoAll);
    }

    public static function activos()
    {

        // Verifica que este logeado
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('pilotos')) {
            header('Location: /dashboard');
            exit;
        }

        $pilotoAll = Piloto::allWithWhere(
            " u.*, t1.nombre as nombre_empleado",
            ["empleados t1" => "u.empleado_id = t1.empleado_id"],
            ["u.estatus = 'Activo'"]
        );
        $pilotoAll = isset($pilotoAll) ? (is_array($pilotoAll) ? $pilotoAll : array($pilotoAll)) : '';

        echo json_encode($pilotoAll);
    }

    public static function crear()
    {
        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('pilotos')) {
            header('Location: /dashboard');
            exit;
        }

        $alertas = [];
        $piloto = new Piloto();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // sincronizar datos del form con el modelo 
            $piloto->sincronizar($_POST);
            $piloto->fecha_creacion = date('Y-m-d H:i:s');
            $piloto->user_creacion = $_SESSION["nombre_user"];
            $piloto->user_modificacion = $_SESSION["nombre_user"];
            $piloto->ip_user = $_SERVER['REMOTE_ADDR'];

            $existe = Piloto::where('licencia', $piloto->licencia);

            if ($existe) {
                Piloto::setAlerta('error', 'El Piloto ya esta registrado.');
                $alertas = Piloto::getAlertas();
                $respuesta['alertas']  = $alertas;
            }

            if (empty($alertas)) {
                $resultado =  $piloto->guardar();
                if ($resultado['error']) {
                    $respuesta['exito'] = $exito = 0;
                    $respuesta['errorSMS'] = $resultado['error'];
                } else {
                    $respuesta['exito'] = $exito = 1;
                }
            }
        }
        echo json_encode($respuesta);
    }


    public static function actualizar()
    {
        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('pilotos')) {
            header('Location: /dashboard');
            exit;
        }

        $alertas = [];
        $piloto = new Piloto();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // sincronizar datos del form con el modelo 
            $piloto->sincronizar($_POST);
            $piloto->user_modificacion = $_SESSION["nombre_user"];
            $piloto->ip_user = $_SERVER['REMOTE_ADDR'];
            $piloto->fecha_ult_acceso = date('Y-m-d H:i:s');

            // Validar el ID
            $piloto_id = $_POST['piloto_id'];
            $piloto_id = filter_var($piloto_id, FILTER_VALIDATE_INT);

            if (!$piloto_id) {
                header('Location: /pilotos');
            }

            // Obtener Empleado a Editar
            $user_BD = Piloto::where('piloto_id', $piloto->piloto_id);

            if (!$user_BD) {
                Piloto::setAlerta('error', 'El Piloto no existe.');
                $alertas = Piloto::getAlertas();
                $respuesta['alertas'] = $alertas;
            }

            if (empty($alertas)) {
                $resultado  = $piloto->guardar();
                if ($resultado['error']) {
                    $respuesta['exito'] = $exito = 0;
                    $respuesta['errorSMS'] = $resultado['error'];
                } else {
                    $respuesta['exito'] = $exito = 1;
                }
            }
        }

        echo json_encode($respuesta);
    }
}
