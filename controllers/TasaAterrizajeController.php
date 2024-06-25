<?php

namespace Controllers;

use Model\ActiveRecord;
use Model\TasaAterrizaje;
use MVC\Router;

class TasaAterrizajeController
{

    public static function tasaAterrizaje(Router $router)
    {

        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('tasaAterrizaje')) {
            header('Location: /dashboard');
            exit;
        }

        $router->render('catalogos/tasa', [
            'titulo' => "Tasa de Aterrizaje",
        ]);
    }

    public static function tasas()
    {
        $datos = TasaAterrizaje::allForeing("u.*,t1.nombre as nombre_aeropuerto, t2.modelo as nombre_aeronave", [
            "aeropuertos t1" => "u.aeropuerto_id = t1.aeropuerto_id",
            "aeronaves t2" => "u.aeronave_id = t2.aeronave_id"
        ]);
        $datos = isset($datos) ? (is_array($datos) ? $datos : array($datos)) : '';

        echo json_encode($datos);
    }

    public static function crear()
    {
        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }
        
        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('tasaAterrizaje')) {
            header('Location: /dashboard');
            exit;
        }

        $alertas = [];
        $tasa = new TasaAterrizaje();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // sincronizar datos del form con el modelo 

            $tasa->sincronizar($_POST);
            $tasa->fecha_creacion = date('Y-m-d H:i:s');
            $tasa->user_creacion = $_SESSION["nombre_user"];
            $tasa->user_modificacion = $_SESSION["nombre_user"];
            $tasa->ip_user = $_SERVER['REMOTE_ADDR'];

            // $existe = TasaAterrizaje::where('licencia', $tasa->licencia);

            $condiciones = ["aeronave_id = $tasa->aeronave_id "];
            $existe = TasaAterrizaje::where('aeropuerto_id ', $tasa->aeropuerto_id, $condiciones);

            if ($existe) {
                TasaAterrizaje::setAlerta('error', 'Tasa de Aterrizaje registrada.');
                $alertas = TasaAterrizaje::getAlertas();
                $respuesta['alertas']  = $alertas;
            }

            if (empty($alertas)) {
                $resultado =  $tasa->guardar();
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
        if (ActiveRecord::hasPermission('tasaAterrizaje')) {
            header('Location: /dashboard');
            exit;
        }

        $alertas = [];
        $tasa = new TasaAterrizaje();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            // Validar el ID
            $tasa_aterrizaje_id = $_POST['tasa_aterrizaje_id'];
            $tasa_aterrizaje_id = filter_var($tasa_aterrizaje_id, FILTER_VALIDATE_INT);

            if (!$tasa_aterrizaje_id) {
                header('Location: /tasaAterrizaje');
            }

            // Obtener Dato a Editar
            $user_BD = TasaAterrizaje::where('tasa_aterrizaje_id', $tasa_aterrizaje_id);

            if (!$user_BD) {
                TasaAterrizaje::setAlerta('error', 'Tasa de Aterrizaje no existe.');
                $alertas = TasaAterrizaje::getAlertas();
                $respuesta['alertas'] = $alertas;
            }
            
            if (empty($alertas)) {

                $postData = $_POST;
                $postData['user_modificacion'] = $_SESSION["nombre_user"];
                $postData['ip_user'] = $_SERVER['REMOTE_ADDR'];
                $postData['fecha_creacion'] = $user_BD->fecha_creacion;
                $postData['user_creacion'] = $user_BD->user_creacion;

                // sincronizar datos del form con el modelo 
                $tasa->sincronizar($postData);

                $resultado  = $tasa->guardar();
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
