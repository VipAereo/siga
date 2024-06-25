<?php

namespace Controllers;

use Model\ActiveRecord;
use Model\Broker;
use Model\Cliente;
use Model\Ruta;
use Model\Tarifa;
use MVC\Router;

class TarifasController
{

    public static function tarifa(Router $router)
    {
        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('tarifas')) {
            header('Location: /dashboard');
            exit;
        }

        $router->render('catalogos/tarifaCostos', [
            'titulo' => "Tarifas",
        ]);
    }

    public static function tarifas()
    {
        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('tarifas')) {
            header('Location: /dashboard');
            exit;
        }

        $datos = Tarifa::allForeing(
            "u.*, t1.modelo, t2.nombre as tipo_nombre",
            [
                "aeronaves t1" => "t1.aeronave_id = u.aeronave_id",
                "tarifatipo t2" => "u.tarifa_id = t2.tipo_id"
            ]
        );

        $datos = isset($datos) ? (is_array($datos) ? $datos : array($datos)) : '';

        echo json_encode($datos);
    }


    public static function preferencias()
    {
        // Verifica que este logeado
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('clientes')) {
            header('Location: /dashboard');
            exit;
        }

        $datos = Tarifa::allForeing(
            " u.*, t2.nombre as tipo_nombre",
            [
                "tarifatipo t2" => "u.tarifa_id = t2.tipo_id"
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
        if (ActiveRecord::hasPermission('tarifas')) {
            header('Location: /dashboard');
            exit;
        }

        $respuesta = [];
        $alertas = [];
        $tarifa = new Tarifa();


        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // sincronizar datos del form con el modelo 
            $tarifa->sincronizar($_POST);
            $tarifa->fecha_creacion = date('Y-m-d H:i:s');
            $tarifa->user_creacion = $_SESSION["nombre_user"];
            $tarifa->user_modificacion = $_SESSION["nombre_user"];
            $tarifa->ip_user = $_SERVER['REMOTE_ADDR'];


            $condiciones = ["tarifa_id = '$tarifa->tarifa_id'"];
            $existe = Tarifa::where('aeronave_id', $tarifa->aeronave_id, $condiciones);

            if ($existe) {
                Ruta::setAlerta('error', 'Ruta registrada.');
                $alertas = Ruta::getAlertas();
                $respuesta['alertas']  = $alertas;
            }

            if (empty($alertas)) {
                $resultado =  $tarifa->guardar();
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
        if (ActiveRecord::hasPermission('tarifas')) {
            header('Location: /catalogos/tarifaCostos');
            exit;
        }

        $respuesta = [];
        $alertas = [];
        $tarifa = new Tarifa();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Validar el ID
            $costo_id = $_POST['costo_id'];
            $costo_id = filter_var($costo_id, FILTER_VALIDATE_INT);

            if (!$costo_id) {
                header('Location: /tasaAterrizaje');
            }

            // Obtener Dato a Editar
            $user_BD = Tarifa::where('costo_id', $costo_id);

            if (!$user_BD) {
                Tarifa::setAlerta('error', 'La Tarifa no existe.');
                $alertas = Tarifa::getAlertas();
                $respuesta['alertas'] = $alertas;
            }

            if (empty($alertas)) {

                $tarifa->sincronizar($_POST);
                $tarifa->user_modificacion = $_SESSION["nombre_user"];
                $tarifa->ip_user = $_SERVER['REMOTE_ADDR'];
                $tarifa->fecha_creacion = $user_BD->fecha_creacion;
                $tarifa->user_creacion = $user_BD->user_creacion;

                // sincronizar datos del form con el modelo 
                $tarifa->sincronizar($tarifa);

                $resultado  = $tarifa->guardar();
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

    public static function costos()
    {

        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('tarifas')) {
            header('Location: /catalogos/tarifaCostos');
            exit;
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            $aeronave = $_POST['aeronave'];
            $broker_id = $_POST['broker_id'];
            $cliente_id = $_POST['cliente_id'];

            if ($cliente_id && !$broker_id) {
                // busca cliente preferencia
                $existePref = Cliente::where('cliente_id', $cliente_id);
            } else if (!$cliente_id && $broker_id) {
                // busca broker preferencia
                $existePref = Broker::where('broker_id', $broker_id);
            }

            $preferencia = $existePref->tarifa_id;

            // validar si tiene tipo de tarifa
            if (!$preferencia) {
                Ruta::setAlerta('error', 'Falta Tipo Tarifa.');
                $alertas = Ruta::getAlertas();
                $respuesta['alertas'] = $alertas;
            }

            if (empty($alertas)) {
                $conditions = ["tarifa_id = $preferencia "];
                $existeTarifa = Tarifa::where('aeronave_id', $aeronave, $conditions);
            }

            if (!$existeTarifa) {
                Tarifa::setAlerta('error', 'La Tarifa no existe.');
                $alertas = Tarifa::getAlertas();
                $respuesta = $alertas;
            } else {
                $respuesta['tarifa'] = $existeTarifa;
            }

            echo json_encode($respuesta);
        }
    }
}
