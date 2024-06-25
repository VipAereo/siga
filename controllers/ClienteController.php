<?php

namespace Controllers;

use Model\ActiveRecord;
use MVC\Router;
use Model\Cliente;
use Model\Tarifa;
use Model\TarifaTipo;

class ClienteController
{

    public static function cliente(Router $router)
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

        $router->render('catalogos/clientes', [
            'titulo' => "Clientes",
        ]);
    }

    public static function clientes()
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

        $aeropuertoAll = Cliente::allForeing(
            " u.*, t2.nombre as tipo_nombre",
            [
                "tarifatipo t2" => "u.tarifa_id = t2.tipo_id"
            ]
        );

        $aeropuertoAll = isset($aeropuertoAll) ? (is_array($aeropuertoAll) ? $aeropuertoAll : array($aeropuertoAll)) : '';

        echo json_encode($aeropuertoAll);
    }

    public static function tipo()
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

        $aeropuertoAll = TarifaTipo::allForeing("u.*",[]);

        $aeropuertoAll = isset($aeropuertoAll) ? (is_array($aeropuertoAll) ? $aeropuertoAll : array($aeropuertoAll)) : '';

        echo json_encode($aeropuertoAll);
    }

    public static function crear()
    {
        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('clientes')) {
            header('Location: /dashboard');
            exit;
        }

        $alertas = [];
        $cliente = new Cliente();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // sincronizar datos del form con el modelo 
            $cliente->sincronizar($_POST);
            $cliente->fecha_creacion = date('Y-m-d H:i:s');
            $cliente->user_creacion = $_SESSION["nombre_user"];
            $cliente->user_modificacion = $_SESSION["nombre_user"];
            $cliente->ip_user = $_SERVER['REMOTE_ADDR'];

            $existe = Cliente::where('nombre', $cliente->nombre);

            if ($existe) {
                Cliente::setAlerta('error', 'El Cliente ya esta registrado.');
                $alertas = Cliente::getAlertas();
                $respuesta['alertas']  = $alertas;
            }

            if (empty($alertas)) {
                $resultado =  $cliente->guardar();
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
        if (ActiveRecord::hasPermission('clientes')) {
            header('Location: /dashboard');
            exit;
        }

        $alertas = [];
        $cliente = new Cliente();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // sincronizar datos del form con el modelo 
            $cliente->sincronizar($_POST);
            $cliente->user_modificacion = $_SESSION["nombre_user"];
            $cliente->ip_user = $_SERVER['REMOTE_ADDR'];
            $cliente->fecha_ult_acceso = date('Y-m-d H:i:s');

            // Validar el ID
            $cliente_id = $_POST['cliente_id'];
            $cliente_id = filter_var($cliente_id, FILTER_VALIDATE_INT);

            if (!$cliente_id) {
                header('Location: /clientes');
            }

            // Obtener Empleado a Editar
            $user_BD = Cliente::where('cliente_id', $cliente->cliente_id);

            if (!$user_BD) {
                Cliente::setAlerta('error', 'El Cliente no existe.');
                $alertas = Cliente::getAlertas();
                $respuesta['alertas'] = $alertas;
            }

            if (empty($alertas)) {
                $resultado  = $cliente->guardar();
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
