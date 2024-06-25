<?php

namespace Controllers;

use Model\ActiveRecord;
use MVC\Router;
use Model\ProgramRole;
use Model\Programa;
use Model\Rol;

class ProgRoleController
{
    public static function programarol(Router $router)
    {

        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('progroles')) {
            header('Location: /dashboard');
            exit;
        }

        $router->render('userGestion/programa-roles', [
            'titulo' => "Relación Roles - Programas",
        ]);
    }

    public static function allProgramRole()
    {

        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('progroles')) {
            header('Location: /dashboard');
            exit;
        }

        $progRol = ProgramRole::allForeing(" u.rpr_id,t1.nombre_rol as rol_nombre, t2.nombre as programa_nombre", [
            "roles t1" => "u.rol_id = t1.rol_id",
            "programas t2" => " u.programa_id = t2.programa_id"
        ]);
        $progRol = isset($progRol) ? (is_array($progRol) ? $progRol : array($progRol)) : '';

        echo json_encode($progRol);
    }

    public static function programRoleRelacion()
    {

        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('progroles')) {
            header('Location: /dashboard');
            exit;
        }

        $alertas = [];
        $rol = new Rol;

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            // sincronizar datos del form con el modelo 
            $rol->sincronizar($_POST);

            $rol->user_modificacion = $_SESSION["nombre_user"];
            $rol->ip_user = $_SERVER['REMOTE_ADDR'];
            $rol->fecha_ult_acceso = date('Y-m-d H:i:s');

            // Validar el ID
            $rol_id = $_POST['rol_id'];
            $rol_id = filter_var($rol_id, FILTER_VALIDATE_INT);

            if (!$rol_id) {
                header('Location: /progroles');
            }

            // Obtener Usuario a Editar
            $user_BD = Rol::where('rol_id', $rol->rol_id);

            if (!$user_BD) {
                Rol::setAlerta('error', 'El Rol no existe.');
                $alertas = Rol::getAlertas();
                $respuesta['alertas'] = $alertas;
            }

            if (empty($alertas)) {

                $array1 = Programa::allForeing(" u.*,CONCAT(u.padre, ' - ',t1.nombre )AS nombre_padre  ", [
                    "programas t1" => "u.padre = t1.programa_id"
                ]);


                $id = $_POST['rol_id'];
                // $array2 = ProgramRole::where('rol_id', $id);

                $array2 = Programa::allWithWhere(
                    " u.*",
                    ["relprogrol t1" => "u.programa_id = t1.programa_id"],
                    ["t1.rol_id = " . $id . ""]
                );

                // Recorremos el primer array
                foreach ($array1 as $element) {
                    $relacion = false; // Por defecto, no hay relación

                    // Verificamos si hay coincidencia en el segundo array
                    foreach ($array2 as $element2) {
                        // Si el programa_nombre del primer array es igual al programa_nombre del segundo array
                        if ($element->programa_id === $element2->programa_id) {
                            $relacion = true; // Hay relación
                            break; // No necesitamos seguir buscando
                        }
                    }
                    // Creamos un nuevo array con el elemento del primer array y agregamos el campo extra
                    $elementArray = (array) $element;
                    $elementArray['relacion'] = $relacion;

                    // Agregamos este nuevo array al tercer array
                    $array3[] = $elementArray;
                }
            }
        }

        // debuguear($array3);
        echo json_encode($array3);
    }

    public static function crearprogroles(Router $router)
    {
        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('progroles')) {
            header('Location: /dashboard');
        }

        $alertas = [];
        $program = new ProgramRole;

        $datosInsertar = json_decode($_POST['datosInsertar'], true);

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            foreach ($datosInsertar as $key => $valor) {
                $program->sincronizar($_POST);
                $program->programa_id = $valor["programa_id"];
                $program->fecha_creacion = date('Y-m-d H:i:s');
                $program->user_creacion = $_SESSION["nombre_user"];
                $program->user_modificacion = $_SESSION["nombre_user"];
                $program->ip_user = $_SERVER['REMOTE_ADDR'];

                $condiciones = ["rol_id = $program->rol_id "];
                $existeRelacion = ProgramRole::where('programa_id', $program->programa_id, $condiciones);

                debuguear($existeRelacion);
                if ($existeRelacion) {
                    Rol::setAlerta('error', 'La Relación' . $existeRelacion[0]->rpr_id . ' ya existe.');
                    $alertas = Rol::getAlertas();
                    $respuesta['alertas']  = $alertas;
                }
                if (empty($alertas)) {
                    $resultado =  $program->guardar();
                    if ($resultado['error']) {
                        $respuesta['exito'] = $exito = 0;
                        $respuesta['errorSMS'] = $resultado['error'];
                    } else {
                        $respuesta['exito'] = $exito = 1;
                    }
                }
            }
        }
        echo json_encode($respuesta);
    }

    public static function eliminarProgRoles(Router $router)
    {
        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('progroles')) {
            header('Location: /dashboard');
            exit;
        }

        $alertas = [];

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            $datosEliminar = json_decode($_POST['datosEliminar'], true);

            foreach ($datosEliminar as $key => $valor) {

                $rol_id = $_POST["rol_id"];
                $programa_id = $valor["programa_id"];

                $condiciones = ["rol_id = $rol_id"];
                $existeRelacion = ProgramRole::where('programa_id', $programa_id, $condiciones);


                if (!isset($existeRelacion)) {
                    ProgramRole::setAlerta('error', 'La relación no existe.');
                    $alertas = ProgramRole::getAlertas();
                    $respuesta['alertas']  = $alertas;
                }
                if (empty($alertas)) {
                    $resultado = $existeRelacion->eliminar();
                    $respuesta['exito'] = $exito = 1;
                }
            }
        }
        echo json_encode($respuesta);
    }
}
