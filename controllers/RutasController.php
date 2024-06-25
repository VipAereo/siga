<?php

namespace Controllers;

use Model\ActiveRecord;
use Model\Ruta;
use MVC\Router;

class RutasController
{

    public static function ruta(Router $router)
    {

        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('rutas')) {
            header('Location: /dashboard');
            exit;
        }

        $router->render('catalogos/rutas', [
            'titulo' => "Rutas",
        ]);
    }

    public static function rutas()
    {
        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('rutas')) {
            header('Location: /dashboard');
            exit;
        }

        // $datos = Ruta::allForeing("*", [], "ASC");
        // $datos = TasaAterrizaje::allForeing("u.*,t1.nombre as nombre_aeropuerto, t2.modelo as nombre_aeronave", [
        //     "aeropuertos t1" => "u.aeropuerto_id = t1.aeropuerto_id",
        //     "aeronaves t2" => "u.aeronave_id = t2.aeronave_id"
        // ]);

        $datos = Ruta::allForeing(
            "
            u.*,Origenes.municipio AS nombre_origen, 
            Destinos.municipio AS nombre_destino,
            Aeropuertos.nombre AS nombre_aeropuerto,
            CONCAT(Origenes.municipio, ' - ', Destinos.municipio) AS rutas_nombre",
            [
                "aeropuertos origenes" => "u.origen = origenes.aeropuerto_id",
                "aeropuertos destinos" => "u.destino = destinos.aeropuerto_id",
                "aeropuertos aeropuertos" => "u.aeropuerto_id = aeropuertos.aeropuerto_id",
            ]
        );

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
        if (ActiveRecord::hasPermission('rutas')) {
            header('Location: /dashboard');
            exit;
        }

        $alertas = [];
        $ruta = new Ruta();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // sincronizar datos del form con el modelo 
            $ruta->sincronizar($_POST);
            $ruta->fecha_creacion = date('Y-m-d H:i:s');
            $ruta->user_creacion = $_SESSION["nombre_user"];
            $ruta->user_modificacion = $_SESSION["nombre_user"];
            $ruta->ip_user = $_SERVER['REMOTE_ADDR'];

            // $existe = TasaAterrizaje::where('licencia', $tasa->licencia);
            // $existe = Ruta::allForeing("u.*, u.origen +''+ u.destino as destinos", []);

            $condiciones = ["origen = $ruta->origen", "destino = $ruta->destino"];
            $existe = Ruta::where('aeropuerto_id', $ruta->aeropuerto_id, $condiciones);

            if ($existe) {
                Ruta::setAlerta('error', 'Ruta registrada.');
                $alertas = Ruta::getAlertas();
                $respuesta['alertas']  = $alertas;
            }

            if (empty($alertas)) {
                $resultado =  $ruta->guardar();
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
        if (ActiveRecord::hasPermission('rutas')) {
            header('Location: /dashboard');
            exit;
        }

        $alertas = [];
        $ruta = new Ruta();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Validar el ID
            $ruta_id = $_POST['ruta_id'];
            $ruta_id = filter_var($ruta_id, FILTER_VALIDATE_INT);

            if (!$ruta_id) {
                header('Location: /tasaAterrizaje');
            }

            // Obtener Dato a Editar
            $user_BD = Ruta::where('ruta_id', $ruta_id);

            if (!$user_BD) {
                Ruta::setAlerta('error', 'La Ruta no existe.');
                $alertas = Ruta::getAlertas();
                $respuesta['alertas'] = $alertas;
            }

            if (empty($alertas)) {

                $postData = $_POST;
                $postData['user_modificacion'] = $_SESSION["nombre_user"];
                $postData['ip_user'] = $_SERVER['REMOTE_ADDR'];
                $postData['fecha_creacion'] = $user_BD->fecha_creacion;
                $postData['user_creacion'] = $user_BD->user_creacion;

                // sincronizar datos del form con el modelo 
                $ruta->sincronizar($postData);

                $resultado  = $ruta->guardar();
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
