<?php

namespace Controllers;

use Model\ActiveRecord;
use MVC\Router;
use Model\Empleado;

class EmpleadosController
{

    public static function empleado(Router $router)
    {

        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('empleados')) {
            header('Location: /dashboard');
            exit;
        }

        $router->render('catalogos/empleados', [
            'titulo' => "Empleados",
        ]);
    }

    public static function empleados()
    {

        $empleadoAll = Empleado::allForeing(" u.*,t1.nombre as empleado_nombre,t2.nombre as nombre_departamento ", [
            "empleados t1" => "u.supervisor_id = t1.empleado_id",
            "departamentos t2" => "u.departamento_id = t2.departamento_id"
        ]);
        $empleadoAll = isset($empleadoAll) ? (is_array($empleadoAll) ? $empleadoAll : array($empleadoAll)) : '';


        echo json_encode($empleadoAll);
    }

    public static function activos()
    {
        $empleadoAll = Empleado::where("estado_laboral", "Activo");

        $empleadoAll = isset($empleadoAll) ? (is_array($empleadoAll) ? $empleadoAll : array($empleadoAll)) : '';

        echo json_encode($empleadoAll);
    }

    public static function crear()
    {
        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('empleados')) {
            header('Location: /dashboard');
            exit;
        }

        $alertas = [];
        $empleado = new Empleado();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            // sincronizar datos del form con el modelo 
            $empleado->sincronizar($_POST);
            $empleado->fecha_creacion = date('Y-m-d H:i:s');
            $empleado->user_creacion = $_SESSION["nombre_user"];
            $empleado->user_modificacion = $_SESSION["nombre_user"];
            $empleado->ip_user = $_SERVER['REMOTE_ADDR'];

            $existeEmpleado = Empleado::where('nombre', $empleado->nombre);

            if ($existeEmpleado) {
                Empleado::setAlerta('error', 'El Empleado ya esta registrado');
                $alertas = Empleado::getAlertas();
                $respuesta['alertas']  = $alertas;
            }

            if (empty($alertas)) {
                $resultado =  $empleado->guardar();
                if ($resultado['error']) {
                    $respuesta['exito'] = $exito = 0;
                    $respuesta['errorSMS'] = $resultado['error'];
                } else {
                    $respuesta['exito'] = $exito = 1;
                }
            }

            // debuguear($existeEmpleado);
        }


        echo json_encode($respuesta);
    }

    public static function actualizar()
    {
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('empleados')) {
            header('Location: /dashboard');
            exit;
        }

        $alertas = [];
        $empleado = new Empleado;

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $empleado->sincronizar($_POST);
            $empleado->user_modificacion = $_SESSION["nombre_user"];
            $empleado->ip_user = $_SERVER['REMOTE_ADDR'];
            $empleado->fecha_ult_acceso = date('Y-m-d H:i:s');

            // Validar el ID
            $empleado_id = $_POST['empleado_id'];
            $empleado_id = filter_var($empleado_id, FILTER_VALIDATE_INT);

            if (!$empleado_id) {
                header('Location: /empleados');
            }

            // Obtener Empleado a Editar
            $user_BD = Empleado::where('empleado_id', $empleado->empleado_id);


            if (!$user_BD) {
                Empleado::setAlerta('error', 'El Empleado no existe.');
                $alertas = Empleado::getAlertas();
                $respuesta['alertas'] = $alertas;
            }

            if (empty($alertas)) {
                $resultado  = $empleado->guardar();
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
