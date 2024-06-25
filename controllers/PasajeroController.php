<?php

namespace Controllers;

use Model\ActiveRecord;
use Model\Pasajero;
use MVC\Router;
use Intervention\Image\ImageManagerStatic as Image;
use Model\Documento;

class PasajeroController
{
    public static function pasajero(Router $router)
    {
        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('pasajeros')) {
            header('Location: /dashboard');
            exit;
        }

        $router->render('catalogos/pasajero', [
            'titulo' => "Pasajeros",
        ]);
    }

    public static function test(Router $router)
    {
        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('pasajeros')) {
            header('Location: /dashboard');
            exit;
        }

        $router->render('catalogos/test', [
            'titulo' => "Pasajeros",
        ]);
    }

    public static function pasajeros()
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

        $datos = Pasajero::allForeing("*", [], "ASC");

        $datos = isset($datos) ? (is_array($datos) ? $datos : array($datos)) : '';

        echo json_encode($datos);
    }

    public static function pasajerosDocs()
    {
        if (!isAuth()) {
            header('Location: /login');
        }
        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('pasajeros')) {
            header('Location: /dashboard');
            exit;
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            $pasajero_id = $_POST['pasajero_id'];
            $pasajero = new Pasajero();

            $resDocs = Documento::where('id_pasajero', $pasajero_id, []);

            $resDocs = isset($resDocs) ? (is_array($resDocs) ? $resDocs : array($resDocs)) : '';

            echo json_encode($resDocs);
        }
    }

    public static function crear()
    {

        // Verifica que este logeado
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('pasajeros')) {
            header('Location: /dashboard');
            exit;
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $pax = new Pasajero();

            $pax->sincronizar($_POST);
            $pax->fecha_creacion = date('Y-m-d H:i:s');
            $pax->user_creacion = $_SESSION["nombre_user"];
            $pax->user_modificacion = $_SESSION["nombre_user"];
            $pax->ip_user = $_SERVER['REMOTE_ADDR'];

            $resultado = $pax->guardar();
            $idPax = intval($resultado['id']);

            if ($resultado == '0') {
                Pasajero::setAlerta('error', 'Error al guardar Pasajero.');
                $alertas = Pasajero::getAlertas();
                $respuesta['alertas']  = $alertas;
                return;
            }

            $respuesta['exito'] = 1;

            // DOCUMENTO 
            if (!empty($_FILES)) {
                $docs = new Documento();

                $carpeta_pax = '../public/build/files/pax';
                // Crear la carpeta si no existe
                if (!is_dir($carpeta_pax)) {
                    mkdir($carpeta_pax, 0755, true); // 0777
                }

                $imagen_webp = Image::make($_FILES['archivo']['tmp_name'])->fit(800, 600)->encode('webp', 80);
                $nombre_imagen = md5(uniqid(rand(), true));

                $imagen_webp->save($carpeta_pax . '/' . $nombre_imagen . ".webp");

                $docs->sincronizar();
                $docs->hash_doc = $nombre_imagen;
                $docs->nombre_doc = $_FILES["archivo"]["name"];
                $docs->id_pasajero = $idPax;
                $docs->ruta = 'build/files/pax';
                $docs->tipo_doc = 'webp';
                $docs->size = $_FILES["archivo"]["size"];
                $docs->fecha_creacion = date('Y-m-d H:i:s');

                $resDocs = $docs->guardar();

                if ($resDocs['resultado'] == 0) {
                    Pasajero::setAlerta('error', 'Error el cargar Documento.');
                    $alertas = Pasajero::getAlertas();
                    $respuesta['alertas'] = $alertas;
                    $respuesta['exito'] = 0;
                }
                $respuesta['exito'] = 1;
            }
            echo json_encode($respuesta);
        }
    }

    public static function actualizar()
    {

        // Verifica que este logeado
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('pasajeros')) {
            header('Location: /dashboard');
            exit;
        }


        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $pax = new Pasajero();

            $pax->sincronizar($_POST);
            $pax->user_modificacion = $_SESSION["nombre_user"];
            $pax->ip_user = $_SERVER['REMOTE_ADDR'];
            $pax->fecha_ult_acceso = date('Y-m-d H:i:s');

            // Validar el ID
            $pasajero_id = $_POST['pasajero_id'];
            $pasajero_id = filter_var($pasajero_id, FILTER_VALIDATE_INT);

            if (!$pasajero_id) {
                header('Location: /pasajeros');
            }

            // Obtener Empleado a Editar
            $user_BD = Pasajero::where('pasajero_id', $pax->pasajero_id);

            if (!$user_BD) {
                Pasajero::setAlerta('error', 'El Pasajero no existe.');
                $alertas = Pasajero::getAlertas();
                $respuesta['alertas'] = $alertas;
            }

            if (empty($alertas)) {
                $resultado = $pax->guardar();

                if ($resultado == '0') {
                    Pasajero::setAlerta('error', 'Error al guardar Pasajero.');
                    $alertas = Pasajero::getAlertas();
                    $respuesta['alertas']  = $alertas;
                    return;
                }
            }
            $respuesta['exito'] = 1;

            // Add DOCUMENTO 
            if (!empty($_FILES) && $resultado != '0') {
                $docs = new Documento();

                $carpeta_pax = '../public/build/files/pax';
                // Crear la carpeta si no existe
                if (!is_dir($carpeta_pax)) {
                    mkdir($carpeta_pax, 0755, true); // 0777
                }

                $imagen_webp = Image::make($_FILES['archivo']['tmp_name'])->fit(800, 600)->encode('webp', 80);
                $nombre_imagen = md5(uniqid(rand(), true));

                $imagen_webp->save($carpeta_pax . '/' . $nombre_imagen . ".webp");

                // Guardar la imagen temporalmente
                $tempPath = "../public/build/files/pax" . $nombre_imagen;
                $imagen_webp->save($tempPath);

                // Obtener el tamaño del archivo
                $tamaño = filesize($tempPath);
                $tamaño = $tamaño / 1024;
                $size = strval($tamaño);

                // Eliminar el archivo temporal después de que ya no sea necesario
                unlink($tempPath);

                $docs->sincronizar();
                $docs->hash_doc = $nombre_imagen;
                $docs->nombre_doc = $_FILES["archivo"]["name"];
                $docs->id_pasajero = $pasajero_id;
                $docs->ruta = 'build/files/pax';
                $docs->tipo_doc = 'webp';
                $docs->size = $size;
                $docs->fecha_creacion = date('Y-m-d H:i:s');

                $resDocs = $docs->guardar();

                if ($resDocs['resultado'] == 0) {
                    Pasajero::setAlerta('error', 'Error el cargar Documento.');
                    $alertas = Pasajero::getAlertas();
                    $respuesta['alertas'] = $alertas;
                    $respuesta['exito'] = 0;
                }
                $respuesta['exito'] = 1;
            }

            echo json_encode($respuesta);
        }
    }
}
