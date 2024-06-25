<?php

namespace Controllers;

use Model\ActiveRecord;
use MVC\Router;
use Model\Programa;

class ProgramasController
{

    public static function programa(Router $router)
    {

        if (!isAuth()) {
            header('Location: /login');
            exit();
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('programas')) {
            header('Location: /dashboard');
            exit;
        }

        $router->render('userGestion/programas', [
            'titulo' => "Programas",
        ]);
    }


    public static function programas()
    {
        if (!isAuth()) {
            header('Location: /login');
            exit();
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('programas')) {
            header('Location: /dashboard');
            exit;
        }

        $rolAll = Programa::allForeing(" u.*,CONCAT(u.padre, ' - ',t1.nombre )AS nombre_padre  ", [
            "programas t1" => "u.padre = t1.programa_id"
        ]);
        $rolAll = isset($rolAll) ? (is_array($rolAll) ? $rolAll : array($rolAll)) : '';

        echo json_encode($rolAll);
    }

    public static function verificar()
    {

        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('programas')) {
            header('Location: /dashboard');
            exit;
        }

        $programa = new Programa;

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            // Validar el ID
            $progId = $_POST['progId'];
            $progId = filter_var($progId, FILTER_VALIDATE_INT);

            if (!$progId) {
                header('Location: /programas');
            }

            $user_BD = Programa::where('programa_id', $progId);

            if ($user_BD->ruta) {
                $respuesta = 1;
            } else {
                $respuesta = 0;
            }
        }
        echo json_encode($respuesta);
    }

    public static function crear()
    {

        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('programas')) {
            header('Location: /dashboard');
            exit;
        }

        $alertas = [];
        $programa = new Programa;

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $programa->sincronizar($_POST);
            $programa->fecha_creacion = date('Y-m-d H:i:s');
            $programa->user_creacion = $_SESSION["nombre_user"];

            $existeProg = Programa::where('ruta', $programa->ruta);

            if ($existeProg) {
                Programa::setAlerta('error', 'El Programa ya existe.');
                $alertas = Programa::getAlertas();
                $respuesta['alertas']  = $alertas;
            }
            if (empty($alertas)) {
                $resultado =  $programa->guardar();

                if ($resultado["resultado"] == 1) {
                    $respuesta['exito'] = $exito = 1;
                } else {
                    $respuesta['exito'] = $exito = 0;
                    $respuesta['errorSMS'] = $resultado['error'];
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
        if (ActiveRecord::hasPermission('programas')) {
            header('Location: /dashboard');
            exit;
        }

        $alertas = [];
        $programa = new Programa;

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            // Validar el ID
            $programa_id = $_POST['programa_id'];
            $programa_id = filter_var($programa_id, FILTER_VALIDATE_INT);

            if (!$programa_id) {
                header('Location: /programas');
            }

            // Obtener Usuario a Editar
            $user_BD = Programa::where('programa_id', $programa_id);

            if (!$user_BD) {
                Programa::setAlerta('error', 'El Programa no existe.');
                $alertas = Programa::getAlertas();
                $respuesta['alertas'] = $alertas;
            }

            if (empty($alertas)) {

                $postData = $_POST;
                $postData['user_modificacion'] = $_SESSION["nombre_user"];
                $postData['fecha_creacion'] = $user_BD->fecha_creacion;
                $postData['user_creacion'] = $user_BD->user_creacion;

                $programa->sincronizar($postData);
                // $programa->user_modificacion = $_SESSION["nombre_user"];
                // $programa->ip_user = $_SERVER['REMOTE_ADDR'];

                $resultado  = $programa->guardar();

                if ($resultado["resultado"] == 1) {
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
