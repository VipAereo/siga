<?php

namespace Controllers;

use Model\ActiveRecord;
use Model\Documento;
use Model\Pasajero;
use Model\Producto;
use Model\RelCotPax;
use Model\Ruta;
use Model\Servicio;
use Model\ServicioDetalle;
use Model\TasaAterrizaje;
use MVC\Router;
use Intervention\Image\ImageManagerStatic as Image;

class ServicioController
{

    public static function servicio(Router $router)
    {
        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('servicios')) {
            header('Location: /dashboard');
            exit;
        }

        $router->render('transacciones/servicio', [
            'titulo' => "Servicios",
        ]);
    }

    public static function servicios()
    {
        // Verifica que este logeado
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('servicios')) {
            header('Location: /dashboard');
            exit;
        }

        $conditions = [];
        $userNow = $_SESSION['nombre_user'];
        if ($userNow != 'admin') {
            $conditions[] = ["u.user_creacion = '$userNow'"];
        }

        $cotizar = Servicio::allJoinPerzo(
            " u.* ,t1.fecha_salida, t1.concepto,t3.siglas_empresa as nombreBrok, t3.contacto_principal, t4.nombre as nombreCli,
            t5.modelo as modeloAeronave, t6.tipo_cambio, t2.nombre as nombrePiloto
            ",
            [
                "serviciosdetalle t1" => "u.servicio_id = t1.servicio_id",
                "brokers t3" => "u.broker_id  = t3.broker_id ",
                "clientes t4" => "u.cliente_id = t4.cliente_id",
                "aeronaves t5" => "u.aeronave_id = t5.aeronave_id",
                "tiposcambio t6" => "u.tipo_cambio_id = t6.tipo_cambio_id",
                "empleados t2" => "u.piloto_id = t2.empleado_id"
            ],
            $conditions,
            [
                " INNER JOIN (
                    SELECT servicio_id, MIN(servicio_detalle_id) AS min_cot_det_id
                    FROM serviciosdetalle
                    GROUP BY servicio_id
                ) AS min_cd ON t1.servicio_id = min_cd.servicio_id AND t1.servicio_detalle_id = min_cd.min_cot_det_id
                "
            ]
        );

        $cotizar = isset($cotizar) ? (is_array($cotizar) ? $cotizar : array($cotizar)) : '';

        echo json_encode($cotizar);
    }

    public static function serviciosDet()
    {
        if (!isAuth()) {
            header('Location: /login');
        }
        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('servicios')) {
            header('Location: /dashboard');
            exit;
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $servicio = new Servicio();
            $servicio_id = $_POST['servicio_id'];

            $resultado = ServicioDetalle::allWithWhere(
                "
                    u.*,t7.municipio as origMun, t7.aeropuerto_id as origenId,
                    t8.municipio as destMun, t8.aeropuerto_id as destinoId,
                    t9.nombre as nombreCat
                ",
                [
                    "tarifa_costos t5" => "u.costo_id = t5.costo_id",
                    "rutas t6" => "u.relacion_id  = t6.ruta_id",
                    "aeropuertos t7" => "t6.origen = t7.aeropuerto_id",
                    "aeropuertos t8" => "t6.destino = t8.aeropuerto_id",
                    "categorias t9" => "u.categoria_id = t9.categoria_id",
                ],
                [
                    "u.servicio_id = '$servicio_id'"
                ]
            );

            $resultado = isset($resultado) ? (is_array($resultado) ? $resultado : array($resultado)) : '';

            echo json_encode($resultado);
        }
    }

    public static function actualizar()
    {
        // proteger vista
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('servicios')) {
            header('Location: /dashboard');
            exit;
        }

        $alertas = [];
        $servicio = new Servicio();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            // Validar el ID
            $servicio_id = $_POST['servicio_id'];
            $servicio_id = filter_var($servicio_id, FILTER_VALIDATE_INT);
            $costo_id = $_POST['costo_id'];

            if (!$servicio_id) {
                header('Location: /servicios');
            }

            // Obtener Servicio a Editar
            $cot_BD = Servicio::where('servicio_id', $servicio_id);
            $cotizar_id = $cot_BD->cotizar_id;

            if (!$cot_BD) {
                Servicio::setAlerta('error', 'El Servicio no existe.');
                $alertas = Servicio::getAlertas();
                $respuesta['alertas'] = $alertas;
            }

            if (empty($alertas)) {
                // sincronizar datos del form con el modelo 
                $servicio->sincronizar($_POST);
                // colocar datos que no se veran afectados
                $servicio->ip_user = $_SERVER['REMOTE_ADDR'];
                $servicio->user_modificacion = $_SESSION["nombre_user"];
                $servicio->fecha_creacion = $cot_BD->fecha_creacion;
                $servicio->user_creacion = $cot_BD->user_creacion;
                $servicio->cotizar_id = $cot_BD->cotizar_id;

                $resultado  = $servicio->guardar();

                if ($resultado['resultado'] == 1) {

                    $detalles = json_decode($_POST['detalles'], true);
                    if ($detalles !== null) {


                        foreach ($detalles as $key => $detruta) {
                            $serv_id = $detruta['servicio_detalle_id'];
                            $origen = $detruta['origen'];
                            $destino = $detruta['destino'];

                            // si no existe la Cotizacion detalle
                            $rutaUpd = ServicioDetalle::where('servicio_detalle_id ', $serv_id);

                            if (isset($rutaUpd)) {
                                if (is_null($rutaUpd->costo_id)) {
                                    $costoID = $costo_id;
                                } else {
                                    $costoID = $rutaUpd->costo_id;
                                }
                            } else {
                                $costoID = $costo_id;
                            }

                            // Categoria Ruta - Validar Ruta => 1
                            if ($detruta['categoria'] == '1') {
                                $existeRuta = Ruta::where('ruta_id', $detruta['relaciones_id']);
                                if (!isset($existeRuta)) {
                                    Ruta::setAlerta('error', 'La Ruta no existe.');
                                    $alertas = Ruta::getAlertas();
                                    $respuesta['alertas'] = $alertas;
                                }
                            }

                            // Categoria Pernocta - Validar Pernocta => 2
                            if ($detruta['categoria'] == '2') {
                                if (!$detruta['concepto']) {
                                    Ruta::setAlerta('error', 'Error en Pernocta.');
                                    $alertas = Ruta::getAlertas();
                                    $respuesta['alertas'] = $alertas;
                                }
                            }

                            // Categoria Aterrizaje - Validar Aterrizaje => 3 
                            if ($detruta['categoria'] == '3') {
                                $existeAterrizaje = TasaAterrizaje::where('tasa_aterrizaje_id', $detruta['relaciones_id']);
                                if (!isset($existeAterrizaje)) {
                                    TasaAterrizaje::setAlerta('error', 'Tasa Aterrizaje no existe.');
                                    $alertas = TasaAterrizaje::getAlertas();
                                    $respuesta['alertas'] = $alertas;
                                }
                            }

                            // Categoria Producto - Validar Producto 
                            if ($detruta['categoria'] == '4') {
                                $existeProducto = Producto::where('producto_id', $detruta['relaciones_id']);
                                if (!isset($existeProducto)) {
                                    Producto::setAlerta('error', 'El Producto no existe.');
                                    $alertas = Producto::getAlertas();
                                    $respuesta['alertas'] = $alertas;
                                }
                            }

                            // Que todas las categorias con sus IDs Existan
                            if (empty($alertas)) {
                                $servicioDet = new ServicioDetalle();
                                $servicioDet->sincronizar($detruta);
                                $servicioDet->fecha_creacion = $cot_BD->fecha_creacion;
                                $servicioDet->user_creacion = $cot_BD->user_creacion;
                                $servicioDet->fecha_modificacion = date('Y-m-d');
                                $servicioDet->tarifa = $detruta['tarifa'];
                                $servicioDet->servicio_id = $servicio_id;
                                $servicioDet->categoria_id = $detruta['categoria'];
                                $servicioDet->relacion_id = $detruta['relaciones_id'];
                                $servicioDet->ip_user = $_SERVER['REMOTE_ADDR'];
                                $servicioDet->user_modificacion = $_SESSION['nombre_user'];
                                if ($detruta['categoria'] == '1') {
                                    // Si la categoría es 1, establece el costo_id
                                    $servicioDet->costo_id = $costoID;
                                }

                                $objetosCotizarDet[$key] = $servicioDet;
                            }
                        } // end each

                        // Procede a Insertar el Detalle en el Modelo
                        $detalleResul = $servicioDet->guardarDetalle($objetosCotizarDet);

                        if ($detalleResul['error']) {
                            $respuesta['exito'] = $exito = 0;
                            $respuesta['errorSMS'] = $detalleResul['error'];
                        } else {

                            // Guardar los Pasajeros
                            $pasajerosDet = json_decode($_POST['pasajerosDet'], true);

                            // verificar que la decodificacion fue existosa
                            if ($pasajerosDet !== null) {
                                $pasajero = new Pasajero();
                                $docs = new Documento();
                                $relCotPax = new RelCotPax();

                                foreach ($pasajerosDet as $key => $paxDet) {
                                    $idPax = $paxDet['pasajero_id'];

                                    // Validar si el Pasajero existe
                                    $existeRelacion = Pasajero::where('pasajero_id', $idPax, []);

                                    $pasajero->sincronizar($paxDet);
                                    $pasajero->fecha_creacion = date('Y-m-d H:i:s');
                                    $pasajero->user_creacion = $_SESSION["nombre_user"];
                                    $pasajero->user_modificacion = $_SESSION["nombre_user"];
                                    $pasajero->ip_user = $_SERVER['REMOTE_ADDR'];

                                    if ($existeRelacion) $pasajero->pasajero_id = $idPax;

                                    $resPax = $pasajero->guardar();
                                    $idPasajero = intval($resPax['id']);

                                    $idPaxBusqueda = '';
                                    if (isset($existeRelacion)) {
                                        $idPaxBusqueda = $idPax;
                                    } else {
                                        $idPaxBusqueda = $idPasajero;
                                    }

                                    // DOCUMENTO 
                                    if (!empty($_FILES)) {
                                        $carpeta_pax = '../public/build/files/pax';
                                        if (!is_dir($carpeta_pax)) {
                                            mkdir($carpeta_pax, 0755, true); // 0777
                                        }

                                        $paxID = '';
                                        // Si tiene id validar el id por el ultimo digito 'archivo_'
                                        if ($paxDet['pasajero_id']) {
                                            $paxID = $paxDet['pasajero_id'];
                                        } else {
                                            // Si no hay paxID, tomar la primera letra de cada palabra
                                            $words = explode(' ', $paxDet['nombre']);
                                            foreach ($words as $word) {
                                                $paxID .= substr($word, 0, 1);
                                            }
                                        }

                                        foreach ($_FILES as $fileKey => $file) {
                                            $filename = substr($fileKey, 8);

                                            if ($filename === $paxID) {
                                                // Realizar un resize a la imagen 
                                                $imagen_webp = Image::make($_FILES[$fileKey]['tmp_name'])->fit(800, 600)->encode('webp', 80);
                                                $nombre_imagen = md5(uniqid(rand(), true));

                                                $imagen_webp->save($carpeta_pax . '/' . $nombre_imagen . ".webp");

                                                $docs->sincronizar();
                                                if (isset($existeRelacion)) {
                                                    $docs->id_pasajero = $idPax;
                                                } else {
                                                    $docs->id_pasajero = $idPasajero;
                                                }

                                                $docs->hash_doc = $nombre_imagen;
                                                $docs->nombre_doc = $file["name"];
                                                $docs->ruta = 'build/files/pax';
                                                $docs->tipo_doc = 'webp';
                                                $docs->size = $file["size"];
                                                $docs->fecha_creacion = date('Y-m-d H:i:s');

                                                $resDocs = $docs->guardar();
                                                if ($resDocs['resultado'] == 0) {
                                                    Pasajero::setAlerta('error', 'Error el cargar Documento.');
                                                    $alertas = Pasajero::getAlertas();
                                                    $respuesta['alertas'] = $alertas;
                                                }

                                                break;
                                            }
                                        }
                                    }

                                    // buscar que no exista en la BD para crear la relacion Cotizacion Pax 
                                    if (empty($alertas)) {

                                        $condiciones = ["id_pax = $idPaxBusqueda"];
                                        $relacion = RelCotPax::where('id_cot', $cotizar_id, $condiciones);

                                        if (!isset($relacion)) {
                                            // echo "existe pasajero ";
                                            $relCotPax->sincronizar();
                                            $relCotPax->id_cot = $cotizar_id;
                                            $relCotPax->id_pax = $idPaxBusqueda;

                                            $resRel = $relCotPax->guardar();
                                        }

                                        if (isset($resRel['error'])) {
                                            Pasajero::setAlerta('error', 'Error al guardar el Documento.');
                                            $alertas = Pasajero::getAlertas();
                                            $respuesta['alertas']  = $alertas;
                                        }
                                    }
                                } // end Each
                            }
                            $respuesta['exito'] = $exito = 1;
                        }
                    }
                } else {
                    $respuesta['exito'] = $exito = 0;
                }
            }
            echo json_encode($respuesta);
        }
    }

    public static function eliminarServ()
    {

        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('costear/cotizacion')) {
            header('Location: /dashboard');
            exit;
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            $servicio_id = $_POST['servicio_id'];
            $servicio_detalle_id = $_POST['servicio_detalle_id'];

            // verificar si existe 
            $cot = new Servicio();
            $condiciones = ["servicio_id = $servicio_id"];
            $existeRelacion = ServicioDetalle::where('servicio_detalle_id', $servicio_detalle_id, $condiciones);

            if (!isset($existeRelacion)) {
                ServicioDetalle::setAlerta('error', 'La relación no existe.');
                $alertas = ServicioDetalle::getAlertas();
                $respuesta['alertas']  = $alertas;
            }

            if (empty($alertas)) {
                $resultado = $existeRelacion->eliminar();
                $respuesta['exito'] = $exito = 1;
            }

            echo json_encode($respuesta);
        }
    }
}
