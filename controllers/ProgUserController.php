<?php

namespace Controllers;

use Model\ActiveRecord;
use MVC\Router;
use Model\Usuario;
use Model\Programa;
use Model\ProgramUsuario;

class ProgUserController
{

    public static function programaUser(Router $router)
    {

        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('progUser')) {
            header('Location: /dashboard');
            exit;
        }

        $router->render('userGestion/programa-usuarios', [
            'titulo' => "Relación Usuarios - Programas",
        ]);
    }

    public static function programUsuarioRelacion()
    {

        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('progUser')) {
            header('Location: /dashboard');
            exit;
        }

        $alertas = [];
        $usuario = new Usuario();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            // sincronizar datos del form con el modelo 
            $usuario->sincronizar($_POST);

            $usuario->user_modificacion = $_SESSION["nombre_user"];
            $usuario->ip_user = $_SERVER['REMOTE_ADDR'];
            $usuario->fecha_ult_acceso = date('Y-m-d H:i:s');

            // Validar el ID
            $usuario_id = $_POST['usuario_id'];
            $usuario_id = filter_var($usuario_id, FILTER_VALIDATE_INT);

            if (!$usuario_id) {
                header('Location: /progUser');
            }

            // Obtener Usuario a Editar
            $user_BD = Usuario::where('usuario_id', $usuario->usuario_id);

            if (!$user_BD) {
                Usuario::setAlerta('error', 'El Usuario no existe.');
                $alertas = Usuario::getAlertas();
                $respuesta['alertas'] = $alertas;
            }

            if (empty($alertas)) {

                $array1 = Programa::allForeing(" u.*,CONCAT(u.padre, ' - ',t1.nombre )AS nombre_padre  ", [
                    "programas t1" => "u.padre = t1.programa_id"
                ]);


                $id = $_POST['usuario_id'];

                $array2 = Programa::allWithWhere(
                    " u.*",
                    ["relproguser t1" => "u.programa_id = t1.programa_id"],
                    ["t1.usuario_id = " . $id . ""]
                );

                foreach ($array1 as $key => $objeto) {
                    if ($objeto->ruta === NULL) {
                        unset($array1[$key]);
                    }
                }

                
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

        echo json_encode($array3);
    }

    public static function crearProgUsuarios()
    {
        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('progUser')) {
            header('Location: /dashboard');
            exit;
        }

        $alertas = [];
        $program = new ProgramUsuario;

        $datosInsertar = json_decode($_POST['datosInsertar'], true);

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            foreach ($datosInsertar as $key => $valor) {
                $program->sincronizar($_POST);
                $program->programa_id = $valor["programa_id"];
                $program->fecha_creacion = date('Y-m-d H:i:s');
                $program->user_creacion = $_SESSION["nombre_user"];
                $program->user_modificacion = $_SESSION["nombre_user"];
                $program->ip_user = $_SERVER['REMOTE_ADDR'];

                // debuguear($program);

                $condiciones = ["usuario_id = $program->usuario_id "];
                $existeRelacion = ProgramUsuario::where('programa_id', $program->programa_id, $condiciones);

                

                if ($existeRelacion) {
                    ProgramUsuario::setAlerta('error', 'La Relación' . $existeRelacion[0]->rpu_id . ' ya existe.');
                    $alertas = ProgramUsuario::getAlertas();
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

    public static function eliminarProgUsuarios()
    {
        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('progUser')) {
            header('Location: /dashboard');
            exit;
        }
        
        $alertas = [];

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            $datosEliminar = json_decode($_POST['datosEliminar'], true);

            foreach ($datosEliminar as $key => $valor) {

                $usuario_id = $_POST["usuario_id"];
                $programa_id = $valor["programa_id"];

                $condiciones = ["usuario_id = $usuario_id"];
                $existeRelacion = ProgramUsuario::where('programa_id', $programa_id, $condiciones);

                if (!isset($existeRelacion)) {
                    ProgramUsuario::setAlerta('error', 'La relación no existe.');
                    $alertas = ProgramUsuario::getAlertas();
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
