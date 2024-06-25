<?php

namespace Controllers;

use Model\ActiveRecord;
use Model\Aeronave;
use MVC\Router;

class AeronaveController
{

    public static function aeronave(Router $router)
    {

        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('aeronaves')) {
            header('Location: /dashboard');
            exit;
        }

        $router->render('catalogos/aeronaves', [
            'titulo' => "Aeronaves",
        ]);
    }

    public static function aeronaves(Router $router)
    {
        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('aeronaves')) {
            header('Location: /dashboard');
            exit;
        }

        $aeronaveAll = Aeronave::allForeing("*", [], "ASC");
        $aeronaveAll = isset($aeronaveAll) ? (is_array($aeronaveAll) ? $aeronaveAll : array($aeronaveAll)) : '';

        echo json_encode($aeronaveAll);
    }

    public static function activas()
    {

        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('aeronaves')) {
            header('Location: /dashboard');
            exit;
        }

        $pilotoAll = Aeronave::allWithWhere(
            " u.*, t1.modelo as nombre_modelo",
            ["aeronaves t1" => "u.aeronave_id = t1.aeronave_id"],
            ["u.estado_actual = 'Activo'"]
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
        if (ActiveRecord::hasPermission('aeronaves')) {
            header('Location: /dashboard');
            exit;
        }

        $alertas = [];
        $aeronave = new Aeronave();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // sincronizar datos del form con el modelo 
            $aeronave->sincronizar($_POST);
            $aeronave->fecha_creacion = date('Y-m-d H:i:s');
            $aeronave->user_creacion = $_SESSION["nombre_user"];
            $aeronave->user_modificacion = $_SESSION["nombre_user"];
            $aeronave->ip_user = $_SERVER['REMOTE_ADDR'];

            $existeAeronave = Aeronave::where('matricula', $aeronave->matricula);

            if ($existeAeronave) {
                Aeronave::setAlerta('error', 'La Aeronave ya esta registrada');
                $alertas = Aeronave::getAlertas();
                $respuesta['alertas']  = $alertas;
            }

            if (empty($alertas)) {
                $resultado =  $aeronave->guardar();
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
        if (ActiveRecord::hasPermission('aeronaves')) {
            header('Location: /dashboard');
            exit;
        }

        $alertas = [];
        $aeronave = new Aeronave();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            $aeronave->sincronizar($_POST);
            $aeronave->user_modificacion = $_SESSION["nombre_user"];
            $aeronave->ip_user = $_SERVER['REMOTE_ADDR'];
            $aeronave->fecha_ult_acceso = date('Y-m-d H:i:s');

            // Validar el ID
            $aeronave_id = $_POST['aeronave_id'];
            $aeronave_id = filter_var($aeronave_id, FILTER_VALIDATE_INT);

            if (!$aeronave_id) {
                header('Location: /aeronave');
            }

            // Obtener Empleado a Editar
            $user_BD = Aeronave::where('aeronave_id', $aeronave->aeronave_id);

            if (!$user_BD) {
                Aeronave::setAlerta('error', 'El Aeronave no existe.');
                $alertas = Aeronave::getAlertas();
                $respuesta['alertas'] = $alertas;
            }

            if (empty($alertas)) {
                $resultado  = $aeronave->guardar();
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

    public static function aeronaveId()
    {
        // Validar el ID
        $aeronave_id = $_POST['aeronave_id'];
        $aeronave_id = filter_var($aeronave_id, FILTER_VALIDATE_INT);

        if (!$aeronave_id) {
            header('Location: /servicios');
        }

        $resultado = Aeronave::where('aeronave_id', $aeronave_id);


        $resultado = isset($resultado) ? $resultado : '';

        echo json_encode($resultado);
    }
}
