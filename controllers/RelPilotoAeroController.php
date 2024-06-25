<?php

namespace Controllers;

use Model\ActiveRecord;
use Model\PilotoAeronave;
use MVC\Router;

class RelPilotoAeroController
{

    public static function asignarAeronave(Router $router)
    {
        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('asignarAeronave')) {
            header('Location: /dashboard');
            exit;
        }

        $router->render('catalogos/relPilotoAero', [
            'titulo' => "Relación Piloto Aeronave",
        ]);
    }

    public static function allPilotoAero()
    {

        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('asignarAeronave')) {
            header('Location: /dashboard');
            exit;
        }

        $pilotoAll = PilotoAeronave::allForeing("u.*,t2.nombre as nombre_empleado, t3.modelo as modelo", [
            "pilotos t1" => "u.piloto_id = t1.piloto_id",
            "empleados t2" => "t1.empleado_id = t2.empleado_id",
            "aeronaves t3 " => "u.aeronave_id = t3.aeronave_id"
        ]);
        $pilotoAll = isset($pilotoAll) ? (is_array($pilotoAll) ? $pilotoAll : array($pilotoAll)) : '';

        echo json_encode($pilotoAll);
    }

    public static function crearPilotoAero()
    {
        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('asignarAeronave')) {
            header('Location: /dashboard');
            exit;
        }

        $alertas = [];
        $pilotoA = new PilotoAeronave();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // sincronizar datos del form con el modelo 
            $pilotoA->sincronizar($_POST);
            $pilotoA->fecha_creacion = date('Y-m-d H:i:s');
            $pilotoA->user_creacion = $_SESSION["nombre_user"];
            $pilotoA->user_modificacion = $_SESSION["nombre_user"];
            $pilotoA->ip_user = $_SERVER['REMOTE_ADDR'];

            $condiciones = ["aeronave_id = $pilotoA->aeronave_id "];
            $existeRelacion = PilotoAeronave::where('piloto_id ', $pilotoA->piloto_id, $condiciones);

            if ($existeRelacion) {
                PilotoAeronave::setAlerta('error', 'La relación ya existe.');
                $alertas = PilotoAeronave::getAlertas();
                $respuesta['alertas']  = $alertas;
            }
            if (empty($alertas)) {
                $resultado =  $pilotoA->guardar();
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


    public static function actualizarPilotoAero()
    {
        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('asignarAeronave')) {
            header('Location: /dashboard');
            exit;
        }

        $alertas = [];
        $pilotoA = new PilotoAeronave();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // sincronizar datos del form con el modelo 
            $pilotoA->sincronizar($_POST);
            $pilotoA->user_modificacion = $_SESSION["nombre_user"];
            $pilotoA->ip_user = $_SERVER['REMOTE_ADDR'];
            $pilotoA->fecha_ult_acceso = date('Y-m-d H:i:s');

            // Validar el ID
            $piloto_aero_id  = $_POST['piloto_aero_id '];
            $piloto_aero_id  = filter_var($piloto_aero_id, FILTER_VALIDATE_INT);

            // if (!$piloto_aero_id) {
            //     header('Location: /asignarAeronave');
            // }

            // Obtener Empleado a Editar
            $user_BD = PilotoAeronave::where('piloto_aero_id', $pilotoA->piloto_aero_id);

            if (!$user_BD) {
                PilotoAeronave::setAlerta('error', 'El Relación no existe.');
                $alertas = PilotoAeronave::getAlertas();
                $respuesta['alertas'] = $alertas;
            }

            if (empty($alertas)) {
                $resultado  = $pilotoA->guardar();
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
