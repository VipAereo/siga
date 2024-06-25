<?php

namespace Controllers;

use Model\ActiveRecord;
use MVC\Router;
use Model\Broker;

class BrokerController
{
    public static function broker(Router $router)
    {

        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('brokers')) {
            header('Location: /dashboard');
            exit;
        }

        $router->render('catalogos/brokers', [
            'titulo' => "Brokers",
        ]);
    }

    public static function brokers(Router $router)
    {
        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('brokers')) {
            header('Location: /dashboard');
            exit;
        }

        $brokerAll = Broker::allForeing(
            " u.*, t2.nombre as tipo_nombre",
            [
                "tarifatipo t2" => "u.tarifa_id = t2.tipo_id"
            ]
        );
        $brokerAll = isset($brokerAll) ? (is_array($brokerAll) ? $brokerAll : array($brokerAll)) : '';

        echo json_encode($brokerAll);
    }

    public static function activas(Router $router)
    {
        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('brokers')) {
            header('Location: /dashboard');
            exit;
        }

        $brokerAll = Broker::where("estatus", "Activo");
        $brokerAll = isset($brokerAll) ? (is_array($brokerAll) ? $brokerAll : array($brokerAll)) : '';

        echo json_encode($brokerAll);
    }

    public static function crear()
    {

        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('brokers')) {
            header('Location: /dashboard');
            exit;
        }

        $alertas = [];
        $broker = new Broker();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // sincronizar datos del form con el modelo 
            $broker->sincronizar($_POST);
            $broker->fecha_creacion = date('Y-m-d H:i:s');
            $broker->user_creacion = $_SESSION["nombre_user"];
            $broker->user_modificacion = $_SESSION["nombre_user"];
            $broker->ip_user = $_SERVER['REMOTE_ADDR'];

            $existeEmpresa = Broker::where('nombre', $broker->nombre);

            if ($existeEmpresa) {
                Broker::setAlerta('error', 'El Broker ya esta registrado');
                $alertas = Broker::getAlertas();
                $respuesta['alertas']  = $alertas;
            }

            if (empty($alertas)) {

                $resultado =  $broker->guardar();
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

        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('brokers')) {
            header('Location: /dashboard');
            exit;
        }

        $alertas = [];
        $broker = new Broker();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $broker->sincronizar($_POST);
            $broker->user_modificacion = $_SESSION["nombre_user"];
            $broker->ip_user = $_SERVER['REMOTE_ADDR'];
            $broker->fecha_ult_acceso = date('Y-m-d H:i:s');

            // Validar el ID
            $broker_id = $_POST['broker_id'];
            $broker_id = filter_var($broker_id, FILTER_VALIDATE_INT);

            if (!$broker_id) {
                header('Location: /empresa');
            }

            // Obtener Empleado a Editar
            $user_BD = Broker::where('broker_id', $broker->broker_id);

            if (!$user_BD) {
                Broker::setAlerta('error', 'El broker no existe.');
                $alertas = Broker::getAlertas();
                $respuesta['alertas'] = $alertas;
            }

            if (empty($alertas)) {
                $resultado  = $broker->guardar();

                if ($resultado['resultado']) {
                    $respuesta['exito'] = $exito = 1;
                } else {
                    $respuesta['exito'] = $exito = 0;
                    $respuesta['errorSMS'] = $resultado['error'];
                }
                
            }
        }
        echo json_encode($respuesta);
    }
}
