<?php

namespace Controllers;

use Model\ActiveRecord;
use Model\Producto;
use MVC\Router;

require __DIR__ . '/../vendor/autoload.php';

class ProductoController
{

    public static function producto(Router $router)
    {
        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('productos')) {
            header('Location: /dashboard');
            exit;
        }

        $router->render('catalogos/productos', [
            'titulo' => "Productos & Servicios",
        ]);
    }

    public static function productos()
    {
        if (!isAuth()) {
            header('Location: /login');
        }
        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('costear/cotizacion')) {
            header('Location: /dashboard');
            exit;
        }

        $tipo = Producto::allForeing(
            " u.*, t1.nombre as nombreCat",
            ["categorias t1" => "u.categoria_id = t1.categoria_id"]
        );

        $tipo = isset($tipo) ? (is_array($tipo) ? $tipo : array($tipo)) : '';

        echo json_encode($tipo);
    }

    public static function crear()
    {
        // Verifica que este logeado
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('productos')) {
            header('Location: /dashboard');
            exit;
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $prod = new Producto();

            $prod->sincronizar($_POST);
            $prod->fecha_creacion = date('Y-m-d H:i:s');
            $prod->user_creacion = $_SESSION["nombre_user"];
            $prod->user_modificacion = $_SESSION["nombre_user"];
            $prod->ip_user = $_SERVER['REMOTE_ADDR'];

            $resultado = $prod->guardar();

            if ($resultado == '0') {
                Producto::setAlerta('error', 'Error al guardar Producto.');
                $alertas = Producto::getAlertas();
                $respuesta['alertas']  = $alertas;
                return;
            }

            $respuesta['exito'] = 1;

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
        if (ActiveRecord::hasPermission('productos')) {
            header('Location: /dashboard');
            exit;
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {


            // Validar el ID
            $producto_id = $_POST['producto_id'];
            $producto_id = filter_var($producto_id, FILTER_VALIDATE_INT);

            if (!$producto_id) {
                header('Location: /productos');
            }

            // Obtener Cotizacion a Editar
            $cot_BD = Producto::where('producto_id', $producto_id);

            if (!$cot_BD) {
                Producto::setAlerta('error', 'El Producto no existe.');
                $alertas = Producto::getAlertas();
                $respuesta['alertas'] = $alertas;
                $respuesta['exito'] = 0;
            }

            if (empty($alertas)) {

                $prod = new Producto();

                $prod->sincronizar($_POST);
                $prod->user_modificacion = $_SESSION["nombre_user"];
                $prod->ip_user = $_SERVER['REMOTE_ADDR'];
                $prod->fecha_ult_acceso = date('Y-m-d H:i:s');
                $prod->fecha_creacion = $cot_BD->fecha_creacion;
                $prod->user_creacion = $cot_BD->user_creacion;

                $resultado = $prod->guardar();

                if ($resultado == '0') {
                    Producto::setAlerta('error', 'Error al Actualizar el Producto.');
                    $alertas = Producto::getAlertas();
                    $respuesta['alertas']  = $alertas;
                    $respuesta['exito'] = 0;
                    return;
                }
                $respuesta['exito'] = 1;
            }

            echo json_encode($respuesta);
        }
    }
}
