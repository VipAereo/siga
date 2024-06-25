<?php

namespace Controllers;

use Model\ActiveRecord;
use Model\Departamento;
use MVC\Router;

class DepartamentosController
{


    public static function departamento(Router $router)
    {

        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('departamentos')) {
            header('Location: /dashboard');
            exit;
        }

        $router->render('catalogos/departamentos', [
            'titulo' => "Departamentos",
        ]);
    }

    public static function activo()
    {
        // Verifica que este logeado
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('departamentos')) {
            header('Location: /dashboard');
            exit;
        }

        $resultado = Departamento::where("estatus", "Activo");
        $resultado = isset($resultado) ? (is_array($resultado) ? $resultado : array($resultado)) : '';

        echo json_encode($resultado);
    }

    public static function departamentos()
    {
        // Verifica que este logeado
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('departamentos')) {
            header('Location: /dashboard');
            exit;
        }

        $departamento = Departamento::allForeing("*", [], "ASC");
        $departamento = isset($departamento) ? (is_array($departamento) ? $departamento : array($departamento)) : '';

        echo json_encode($departamento);
    }


    public static function crear()
    {

        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('departamentos')) {
            header('Location: /dashboard');
            exit;
        }

        $alertas = [];
        $departamento = new Departamento;

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            $departamento->sincronizar($_POST);
            $departamento->fecha_creacion = date('Y-m-d H:i:s');
            $departamento->user_creacion = $_SESSION["nombre_user"];
            $departamento->user_modificacion = $_SESSION["nombre_user"];
            $departamento->ip_user = $_SERVER['REMOTE_ADDR'];

            $existeDepa = Departamento::where('nombre', $departamento->nombre);

            if ($existeDepa) {
                Departamento::setAlerta('error', 'El Departamento ya existe.');
                $alertas = Departamento::getAlertas();
                $respuesta['alertas']  = $alertas;
            }
            if (empty($alertas)) {
                $resultado =  $departamento->guardar();
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
        if (ActiveRecord::hasPermission('departamentos')) {
            header('Location: /dashboard');
            exit;
        }

        $alertas = [];
        $departamento = new Departamento;

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            // Validar el ID
            $departamento_id = $_POST['departamento_id'];
            $departamento_id = filter_var($departamento_id, FILTER_VALIDATE_INT);

            if (!$departamento_id) {
                header('Location: /programas');
            }

            // Obtener Usuario a Editar
            $user_BD = Departamento::where('departamento_id', $departamento_id);

            if (!$user_BD) {
                Departamento::setAlerta('error', 'El Departamento no existe.');
                $alertas = Departamento::getAlertas();
                $respuesta['alertas'] = $alertas;
            }

            if (empty($alertas)) {

                $postData = $_POST;
                $postData['user_modificacion'] = $_SESSION["nombre_user"];
                $postData['ip_user'] = $_SERVER['REMOTE_ADDR'];
                $postData['fecha_creacion'] = $user_BD->fecha_creacion;
                $postData['user_creacion'] = $user_BD->user_creacion;



                $departamento->sincronizar($postData);
                // $departamento->user_modificacion = $_SESSION["nombre_user"];
                // $departamento->ip_user = $_SERVER['REMOTE_ADDR'];

                $resultado  = $departamento->guardar();
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
