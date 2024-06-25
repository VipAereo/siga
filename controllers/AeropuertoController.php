<?php

namespace Controllers;

use Model\ActiveRecord;
use MVC\Router;
use Model\Aeropuerto;

class AeropuertoController
{

    public static function aeropuerto(Router $router)
    {

        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('aeropuerto')) {
            header('Location: /dashboard');
            exit;
        }

        $router->render('catalogos/aeropuerto', [
            'titulo' => "Aeropuertos",
        ]);
    }

    public static function aeropuertos()
    {
        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('aeropuerto')) {
            header('Location: /dashboard');
            exit;
        }

        $aeropuertoAll = Aeropuerto::allForeing("*", [], "ASC");
        $aeropuertoAll = isset($aeropuertoAll) ? (is_array($aeropuertoAll) ? $aeropuertoAll : array($aeropuertoAll)) : '';

        echo json_encode($aeropuertoAll);
    }

    public static function activos()
    {
        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('aeropuerto')) {
            header('Location: /dashboard');
            exit;
        }

        $resultado = Aeropuerto::where("estatus", "Activo");
        $resultado = isset($resultado) ? (is_array($resultado) ? $resultado : array($resultado)) : '';

        echo json_encode($resultado);
    }

    public static function crear()
    {
        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('aeropuerto')) {
            header('Location: /dashboard');
            exit;
        }

        $alertas = [];
        $aeropuerto = new Aeropuerto();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // sincronizar datos del form con el modelo 
            $aeropuerto->sincronizar($_POST);
            $aeropuerto->fecha_creacion = date('Y-m-d H:i:s');
            $aeropuerto->user_creacion = $_SESSION["nombre_user"];
            $aeropuerto->user_modificacion = $_SESSION["nombre_user"];
            $aeropuerto->ip_user = $_SERVER['REMOTE_ADDR'];

            $existe = Aeropuerto::where('nombre', $aeropuerto->nombre);

            if ($existe) {
                Aeropuerto::setAlerta('error', 'La Aeropuerto ya esta registrada');
                $alertas = Aeropuerto::getAlertas();
                $respuesta['alertas']  = $alertas;
            }

            if (empty($alertas)) {
                $resultado =  $aeropuerto->guardar();
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
        if (ActiveRecord::hasPermission('aeropuerto')) {
            header('Location: /dashboard');
            exit;
        }

        $alertas = [];
        $aeropuerto = new Aeropuerto();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // sincronizar datos del form con el modelo 
            $aeropuerto->sincronizar($_POST);
            $aeropuerto->user_modificacion = $_SESSION["nombre_user"];
            $aeropuerto->ip_user = $_SERVER['REMOTE_ADDR'];
            $aeropuerto->fecha_ult_acceso = date('Y-m-d H:i:s');

            // Validar el ID
            $aeropuerto_id = $_POST['aeropuerto_id'];
            $aeropuerto_id = filter_var($aeropuerto_id, FILTER_VALIDATE_INT);

            if (!$aeropuerto_id) {
                header('Location: /aeropuerto');
            }

            // Obtener Empleado a Editar
            $user_BD = Aeropuerto::where('aeropuerto_id', $aeropuerto->aeropuerto_id);

            if (!$user_BD) {
                Aeropuerto::setAlerta('error', 'El Aeropuerto no existe.');
                $alertas = Aeropuerto::getAlertas();
                $respuesta['alertas'] = $alertas;
            }

            if (empty($alertas)) {
                
                $resultado  = $aeropuerto->guardar();

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
