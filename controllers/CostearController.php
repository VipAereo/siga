<?php

namespace Controllers;

require __DIR__ . '/../vendor/autoload.php';

use DateTime;
use DateTimeZone;
use tFPDF;

use Model\ActiveRecord;
use Model\Aeropuerto;
use Model\Broker;
use Model\Cliente;
use MVC\Router;
use Model\Cotizar;
use Model\CotizarDetalle;
use Model\Pasajero;
use Model\Documento;
use Model\Producto;
use Model\RelCotPax;
use Model\Ruta;
use Model\Servicio;
use Model\ServicioDetalle;
use Model\Tarifa;
use Model\TasaAterrizaje;
use Model\TipoCambio;
use Intervention\Image\ImageManagerStatic as Image;
use Model\Aeronave;
use Model\RelCotPaxRuta;

class CostearController
{

    public static function costear(Router $router)
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

        $router->render('transacciones/costear', [
            'titulo' => "Estimación de Costos",
        ]);
    }
    public static function validaRuta()
    {
        // Verifica que este logeado
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('costear/cotizacion')) {
            header('Location: /dashboard');
            exit;
        }

        $origen = $_POST['origen'];
        $destino = $_POST['destino'];
        $cliente_id = $_POST['cliente_id'];
        $broker_id = $_POST['broker_id'];
        $aeronaveID = $_POST['aeronave_id'];

        $condiciones = ["origen = $origen", "destino = $destino"];
        $existeRelacion = Ruta::where('aeropuerto_id', $origen, $condiciones);

        // si existe la ruta guardar el ID 
        if (!isset($existeRelacion)) {
            Ruta::setAlerta('error', 'La ruta no existe.');
            $alertas = Ruta::getAlertas();
            $respuesta['alertas'] = $alertas;
            $respuesta['exito'] = $exito = 0;
        }

        if (empty($alertas)) {

            if ($cliente_id && !$broker_id) {
                // busca cliente preferencia
                $existePref = Cliente::where('cliente_id', $cliente_id);
            } else if (!$cliente_id && $broker_id) {
                // busca broker preferencia
                $existePref = Broker::where('broker_id', $broker_id);
            }

            $preferencia = $existePref->tarifa_id;

            // validar si tiene tipo de tarifa
            if (!$preferencia) {
                Ruta::setAlerta('error', 'Falta Tipo Tarifa.');
                $alertas = Ruta::getAlertas();
                $respuesta['alertas'] = $alertas;
                $respuesta['exito'] = $exito = 0;
            }

            if (empty($alertas)) {
                $conditions = ["tarifa_id = $preferencia "];
                $existeTarifa = Tarifa::where('aeronave_id', $aeronaveID, $conditions);
            }

            if (!$existeTarifa) {
                Tarifa::setAlerta('error', 'La Tarifa no existe.');
                $alertas = Tarifa::getAlertas();
                $respuesta['alertas'] = $alertas;
                $respuesta['exito'] = $exito = 0;
            } else {
                $respuesta['exito'] = $exito = 1;
                $respuesta['ruta'] = $existeRelacion;
                $respuesta['tarifa'] = $existeTarifa;
            }
        }
        echo json_encode($respuesta);
    }
    public static function tasaAterrizaje()
    {
        // Verifica que este logeado
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('costear/cotizacion')) {
            header('Location: /dashboard');
            exit;
        }

        $origen = $_POST['origen'];
        $aeronave = $_POST['aeronave_id'];

        $condiciones = ["aeronave_id = $aeronave"];
        $existeTarifa = TasaAterrizaje::where('aeropuerto_id', $origen, $condiciones);

        if ($existeTarifa) {
            $respuesta['exito'] = $exito = 1;
            $respuesta['aterrizaje'] = $existeTarifa;
        } else {
            $respuesta['exito'] = $exito = 0;
        }
        echo json_encode($respuesta);
    }
    public static function cambio()
    {
        $tipo = TipoCambio::allForeing("*", [], "ASC");
        $tipo = isset($tipo) ? (is_array($tipo) ? $tipo : array($tipo)) : '';
        $primer_elemento = $tipo[0];
        echo json_encode($primer_elemento);
    }
    public static function pdf()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $datos = $_POST;

            $aeronave_id = $_POST['aeronave_id'];
            $existe = Aeronave::where('aeronave_id', $aeronave_id);
            $datos['matricula'] = $existe->matricula;
            $datos['aeronaveName'] = $existe->modelo;
            $datos['asientos'] = $existe->asientos;

            $pdfGenerator = self::generarPDF($datos);
        }
    }
    public static function crear()
    {
        // Verifica que este logeado
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('costear/cotizacion')) {
            header('Location: /dashboard');
            exit;
        }

        $respuesta = [];
        $cotizar = new Cotizar();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            $existe = Cotizar::ultimoRegistro('cotizar_id'); // Consultar el ultimo Folio
            if ($existe) {
                $ultimoFolio = intval($existe->folio_cotizar);
            } else {
                $ultimoFolio = 9999; // Si no hay registros previos, iniciar desde 9999
            }

            // $folioActual = $existe->folio_cotizar;
            // $nuevoFolioNumero = intval($folioActual) + 1; // Convertir el folio actual a un número entero y sumarle 1
            $nuevoFolioNumero = $ultimoFolio + 1; // Incrementar el último folio en 1
            $nuevoFolio = str_pad($nuevoFolioNumero, 5, '0', STR_PAD_LEFT); // Ajustar el nuevo folio a 5 dígitos
            $existeNewFolio = Cotizar::where('folio_cotizar', $cotizar->folio_cotizar);
            // sincronizar datos del form con el modelo 
            $cotizar->sincronizar($_POST);
            $cotizar->fecha_creacion = date('Y-m-d');
            $cotizar->user_creacion = $_SESSION["nombre_user"];
            $cotizar->user_modificacion = $_SESSION["nombre_user"];
            $cotizar->ip_user = $_SERVER['REMOTE_ADDR'];
            $cotizar->folio_cotizar = $nuevoFolio;

            if ($_POST['total'] != '') {
                $cotizar->estatus = 'CTZ';
            } else {
                $cotizar->estatus = 'PND';
            }

            $detalleRutas = json_decode($_POST['detalles'], true);

            if (empty($detalleRutas)) {
                Cotizar::setAlerta('error', 'No hay Rutas.');
                $alertas = Cotizar::getAlertas();
                $respuesta['alertas']  = $alertas;
            }

            if ($existeNewFolio) {
                Cotizar::setAlerta('error', 'El Folio ya esta registrado.');
                $alertas = Cotizar::getAlertas();
                $respuesta['alertas']  = $alertas;
            }

            if (empty($alertas)) {
                // INSERTAR ENCABEZADO

                $resultadoCoti = $cotizar->guardar();
                $aeronaveID = $_POST['aeronave_id'];
                $costo_id = $_POST['costo_id'];

                if ($resultadoCoti['resultado'] == 1) {

                    try {
                        $cotizarID = $resultadoCoti['id'];
                        // Verificar si la decodificación fue exitosa
                        if ($detalleRutas !== null) {

                            // VALIDAR DATOS A PRO-CESAR
                            foreach ($detalleRutas as $key => $detruta) {

                                $detalleCotizar = new CotizarDetalle();
                                $detalleCotizar->sincronizar($detruta);
                                $cotizarID = $cotizarID;

                                // Categoria Ruta - Validar Ruta => 1
                                if ($detruta['categoria'] == '1') {
                                    // Existe en la tabla Ruta?

                                    $existeRuta = Ruta::where('ruta_id', $detruta['relaciones_id']);
                                    $rutaID = $existeRuta->ruta_id;
                                    if (!isset($existeRuta)) {
                                        Cotizar::setAlerta('error', 'La Ruta no existe.');
                                        $alertas = Cotizar::getAlertas();
                                        $respuesta['alertas'] = $alertas;
                                    }
                                }

                                // Categoria Pernocta - Validar Pernocta => 2
                                if ($detruta['categoria'] == '2') {
                                    if (!$detruta['concepto']) {
                                        Cotizar::setAlerta('error', 'Error en Pernocta.');
                                        $alertas = Cotizar::getAlertas();
                                        $respuesta['alertas'] = $alertas;
                                    }
                                }

                                // Categoria Aterrizaje - Validar Aterrizaje => 3 
                                if ($detruta['categoria'] == '3') {
                                    $existeAterrizaje = tasaAterrizaje::where('tasa_aterrizaje_id', $detruta['relaciones_id']);
                                    $aterrizajeID = $existeAterrizaje->tasa_aterrizaje_id;

                                    if (!isset($existeAterrizaje)) {
                                        Cotizar::setAlerta('error', 'Tasa Aterrizaje no existe.');
                                        $alertas = Cotizar::getAlertas();
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

                                if (empty($alertas)) {

                                    $detalleCotizar->sincronizar($detruta);
                                    $detalleCotizar->fecha_creacion = date('Y-m-d H:i:s');
                                    $detalleCotizar->user_creacion = $_SESSION["nombre_user"];
                                    $detalleCotizar->user_modificacion = $_SESSION["nombre_user"];
                                    $detalleCotizar->ip_user = $_SERVER['REMOTE_ADDR'];
                                    $detalleCotizar->categoria_id = $detruta['categoria'];
                                    $detalleCotizar->cotizar_id = $cotizarID;
                                    $detalleCotizar->relacion_id = $detruta['relaciones_id'];

                                    if ($detruta['categoria'] == '1') {
                                        // Si la categoría es 1, establece el costo_id
                                        $detalleCotizar->costo_id = $costo_id;
                                    }

                                    $objetosCotizarDet[$key] = $detalleCotizar;
                                }
                            } // End Each

                            // Procede a Insertar el Detalle en el Modelo
                            $detalleResul = $detalleCotizar->guardarDetalle($objetosCotizarDet);


                            if (isset($detalleResul['error'])) {
                                // eliminar encabezado
                                $cotDelete = Cotizar::where('cotizar_id', $cotizarID);
                                $resultDelete = $cotDelete->eliminar();

                                $respuesta['exito'] = $exito = 0;
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

                                        $existeRelacion = Pasajero::where('pasajero_id', $idPax, []);

                                        $pasajero = new Pasajero();
                                        $pasajero->sincronizar($paxDet);
                                        $pasajero->fecha_creacion = date('Y-m-d H:i:s');
                                        $pasajero->user_creacion = $_SESSION["nombre_user"];
                                        $pasajero->user_modificacion = $_SESSION["nombre_user"];
                                        $pasajero->ip_user = $_SERVER['REMOTE_ADDR'];
                                        $pasajero->cotizar_id = $cotizarID;
                                        if ($idPax) $pasajero->pasajero_id = $idPax;

                                        $resultadoCoti = $pasajero->guardar();
                                        $idPasajero = intval($resultadoCoti['id']);

                                        if ($resultadoCoti == '0') {
                                            Pasajero::setAlerta('error', 'Error al guardar Pasajero.');
                                            $alertas = Pasajero::getAlertas();
                                            $respuesta['alertas']  = $alertas;
                                            return;
                                        }

                                        $idPaxBusqueda = '';
                                        if (isset($existeRelacion)) {
                                            $idPaxBusqueda = $idPax;
                                        } else {
                                            $idPaxBusqueda = $idPasajero;
                                        }


                                        // DOCUMENTO 
                                        if (!empty($_FILES)) {
                                            $carpeta_pax = '../public/build/files/pax';
                                            // Crear la carpeta si no existe
                                            if (!is_dir($carpeta_pax)) {
                                                mkdir($carpeta_pax, 0755, true); // 0777
                                            }

                                            $paxID = '';

                                            // Si no hay paxID, tomar la primera letra de cada palabra
                                            $words = explode(' ', $paxDet['nombre']);
                                            foreach ($words as $word) {
                                                $paxID .= substr($word, 0, 1);
                                            }

                                            foreach ($_FILES as $fileKey => $file) {
                                                $filename = substr($fileKey, 8);

                                                if ($filename === $paxID) {
                                                    // Realizar un resize a la imagen 
                                                    $imagen_webp = Image::make($_FILES[$fileKey]['tmp_name'])->fit(800, 600)->encode('webp', 80);
                                                    $nombre_imagen = md5(uniqid(rand(), true));

                                                    $imagen_webp->save($carpeta_pax . '/' . $nombre_imagen . ".webp");

                                                    $docs->sincronizar();

                                                    $docs->hash_doc = $nombre_imagen;
                                                    $docs->nombre_doc = $file["name"];
                                                    $docs->id_pasajero = $idPax;
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

                                        if (empty($alertas)) {

                                            // RELACIONAR NUEVO PASAJERO

                                            $relCotPax->sincronizar();
                                            $relCotPax->id_cot = $cotizarID;
                                            $relCotPax->id_pax = $idPaxBusqueda;

                                            $resRel = $relCotPax->guardar();

                                            if (isset($resRel['error'])) {
                                                Pasajero::setAlerta('error', 'Error al guardar Relación Pasajero.');
                                                $alertas = Pasajero::getAlertas();
                                                $respuesta['alertas']  = $alertas;
                                            }
                                        }
                                    }

                                    if (isset($paxResult['error'])) {
                                        Pasajero::setAlerta('error', 'Error al guardar Pasajero.');
                                        $alertas = Pasajero::getAlertas();
                                        $respuesta['alertas']  = $alertas;
                                    }
                                }
                                $respuesta['exito'] = $exito = 1;
                            }
                        }
                    } catch (\Throwable $th) {
                        $cotDelete = Cotizar::where('cotizar_id', $cotizarID);
                        $resultDelete = $cotDelete->eliminar();

                        $respuesta = [];
                        $respuesta['exito'] = $exito = 0;
                    }
                } else {
                    $respuesta['exito'] = $exito = 0;
                }
            }
            echo json_encode($respuesta);
        }
    }
    public static function actualizar()
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

        $alertas = [];
        $cotizar = new Cotizar();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            // Validar el ID
            $cotizar_id = $_POST['cotizar_id'];
            $cotizar_id = filter_var($cotizar_id, FILTER_VALIDATE_INT);
            $costo_id = $_POST['costo_id'];


            if (!$cotizar_id) {
                header('Location: /costear/cotizacion');
            }

            // Obtener Cotizacion a Editar
            $cot_BD = Cotizar::where('cotizar_id', $cotizar_id);

            if (!$cot_BD) {
                Cotizar::setAlerta('error', 'La cotización no existe.');
                $alertas = Cotizar::getAlertas();
                $respuesta['alertas'] = $alertas;
            }

            if (empty($alertas)) {
                // sincronizar datos del form con el modelo 
                $cotizar->sincronizar($_POST);
                $cotizar->ip_user = $_SERVER['REMOTE_ADDR'];
                $cotizar->user_modificacion = $_SESSION["nombre_user"];
                $cotizar->fecha_creacion = $cot_BD->fecha_creacion;
                $cotizar->user_creacion = $cot_BD->user_creacion;
                $cotizar->folio_cotizar = $cot_BD->folio_cotizar;

                if ($_POST['total'] != '') {
                    $cotizar->estatus = 'CTZ';
                } else {
                    $cotizar->estatus = 'PND';
                }

                $resultado  = $cotizar->guardar();

                if ($resultado['resultado'] == 1) {

                    $detalles = json_decode($_POST['detalles'], true);
                    if ($detalles !== null) {

                        foreach ($detalles as $key => $detruta) {

                            $det_id = $detruta['cot_det_id'];
                            $origen = $detruta['origen'];
                            $destino = $detruta['destino'];

                            // si no existe la Cotizacion detalle
                            $rutaUpd = CotizarDetalle::where('cot_det_id ', $det_id);

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
                                    Cotizar::setAlerta('error', 'La Ruta no existe.');
                                    $alertas = Cotizar::getAlertas();
                                    $respuesta['alertas'] = $alertas;
                                }
                            }

                            // Categoria Pernocta - Validar Pernocta => 2
                            if ($detruta['categoria'] == '2') {
                                if (!$detruta['concepto']) {
                                    Cotizar::setAlerta('error', 'Error en Pernocta.');
                                    $alertas = Cotizar::getAlertas();
                                    $respuesta['alertas'] = $alertas;
                                }
                            }

                            // Categoria Aterrizaje - Validar Aterrizaje => 3 
                            if ($detruta['categoria'] == '3') {
                                $existeAterrizaje = tasaAterrizaje::where('tasa_aterrizaje_id', $detruta['relaciones_id']);
                                if (!isset($existeAterrizaje)) {
                                    Cotizar::setAlerta('error', 'Tasa Aterrizaje no existe.');
                                    $alertas = Cotizar::getAlertas();
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
                                $cotizarDet = new CotizarDetalle();
                                $cotizarDet->sincronizar($detruta);
                                $cotizarDet->fecha_creacion = $cot_BD->fecha_creacion;
                                $cotizarDet->user_creacion = $cot_BD->user_creacion;
                                $cotizarDet->fecha_modificacion = date('Y-m-d');
                                $cotizarDet->tarifa = $detruta['tarifa'];
                                $cotizarDet->cotizar_id = $cotizar_id;
                                $cotizarDet->categoria_id = $detruta['categoria'];
                                $cotizarDet->relacion_id = $detruta['relaciones_id'];
                                $cotizarDet->ip_user = $_SERVER['REMOTE_ADDR'];
                                $cotizarDet->user_modificacion = $_SESSION['nombre_user'];

                                if ($detruta['categoria'] == '1') {
                                    // Si la categoría es 1, establece el costo_id
                                    $cotizarDet->costo_id = $costoID;
                                }

                                $objetosCotizarDet[$key] = $cotizarDet;
                            }
                        } // end Each

                        // debuguear($objetosCotizarDet);
                        // Procede a Insertar el Detalle en el Modelo
                        $detalleResul = $cotizarDet->guardarDetalle($objetosCotizarDet);

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

                                    $existeRelacion = Pasajero::where('pasajero_id', $idPax, []);

                                    $pasajero = new Pasajero();
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
                                        // Crear la carpeta si no existe
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

                                    if (empty($alertas)) {

                                        // RELACIONAR NUEVO PASAJERO
                                        // Buscar que no exista en la BD para crear la relacion Cotizacion Pax 
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
    public static function actualizarRutaPax()
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

        $alertas = [];
        $pax = new Pasajero();
        $relCot = new RelCotPaxRuta();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            // Verificar el token CSRF
            $csrfToken = $_POST['csrf_token'] ?? '';
            if (!verifyCsrfToken($csrfToken)) {
                $respuesta['csrf'] = ['Solicitud inválida. Por favor, inténtalo de nuevo.'];
                echo json_encode($respuesta);
                exit;
            }

            $cotizar_id = $_POST['id_cot'];

            $detalleRelPax = json_decode($_POST['relRutaPax'], true);

            foreach ($detalleRelPax as $key => $detruta) {

                $ruta_id = $detruta['ruta_id'];
                $pasajero_id = $detruta['pasajero_id'];

                $condiciones = ["ruta_id = $ruta_id", "pasajero_id = $pasajero_id"];
                $rel = RelCotPaxRuta::where('cotizacion_id', $cotizar_id, $condiciones);

                if (!isset($rel)) {
                    $relCot->sincronizar($detruta);
                    $relCot->cotizacion_id = $cotizar_id;

                    $resPaxRuta = $relCot->guardar();

                    if ($resPaxRuta['error']) {
                        RelCotPaxRuta::setAlerta('error', 'Error al guardar relación.');
                        $alertas = RelCotPaxRuta::getAlertas();
                        $respuesta['alertas']  = $alertas;
                        break;
                    }
                }
            }

            if (empty($alertas)) {
                $respuesta['exito'] = $exito = 1;
            }

            echo json_encode($respuesta);
        }
    }
    public static function eliminarRutaPax()
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

        $alertas = [];
        $pax = new Pasajero();
        $relCot = new RelCotPaxRuta();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            $cotizar_id = $_POST['id_cot'];

            $detalleRelPax = json_decode($_POST['relRutaPax'], true);

            foreach ($detalleRelPax as $key => $detruta) {
                $ruta_id = $detruta['ruta_id'];
                $pasajero_id = $detruta['pasajero_id'];

                $condiciones = ["ruta_id = $ruta_id", "pasajero_id = $pasajero_id"];
                $rel = RelCotPaxRuta::where('cotizacion_id', $cotizar_id, $condiciones);

                if (isset($rel)) {
                    $resultado = $rel->eliminarRel();

                    if ($resultado['error']) {
                        RelCotPaxRuta::setAlerta('error', 'Error al eliminar relación.');
                        $alertas = RelCotPaxRuta::getAlertas();
                        $respuesta['alertas']  = $alertas;
                        break;
                    }
                }
            }

            if (empty($alertas)) {
                $respuesta['exito'] = $exito = 1;
            }

            echo json_encode($respuesta);
        }
    }
    public static function eliminar()
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
            $cotizar_id = $_POST['cotizar_id'];
            $cot_det_id = $_POST['cot_det_id'];

            // verificar si existe 
            $cot = new Cotizar();
            $condiciones = ["cotizar_id = $cotizar_id"];
            $existeRelacion = CotizarDetalle::where('cot_det_id', $cot_det_id, $condiciones);

            if (!isset($existeRelacion)) {
                CotizarDetalle::setAlerta('error', 'La relación no existe.');
                $alertas = CotizarDetalle::getAlertas();
                $respuesta['alertas']  = $alertas;
            }

            if (empty($alertas)) {
                $resultado = $existeRelacion->eliminar();
                $respuesta['exito'] = $exito = 1;
            }

            echo json_encode($respuesta);
        }
    }
    public static function eliminarPax()
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

            $cotizar_id = $_POST['cotizar_id'];
            $pasajero_id = $_POST['pasajero_id'];

            $cot = new Pasajero();
            $relCot = new RelCotPaxRuta();

            // verificar si existe 
            $condiciones = ["id_cot = $cotizar_id"];
            $existeRelacion = RelCotPax::where('id_pax', $pasajero_id, $condiciones);

            if (!isset($existeRelacion)) {
                RelCotPax::setAlerta('error', 'La relación no existe.');
                $alertas = RelCotPax::getAlertas();
                $respuesta['alertas']  = $alertas;
            }

            if (empty($alertas)) {
                $resultado = $existeRelacion->eliminar();
                $respuesta['exito'] = $exito = 1;

                // Eliminar todas las relaciones de la tablas rel_pax_ruta
                $condiciones = ["pasajero_id = $pasajero_id"];
                $resPax = RelCotPaxRuta::where('cotizacion_id', $cotizar_id, $condiciones);

                $resPax = isset($resPax) ? (is_array($resPax) ? $resPax : array($resPax)) : '';

                foreach ($resPax as $key => $detruta) {
                    $ruta_id = $detruta->ruta_id;
                    $pasajero_id = $detruta->pasajero_id;

                    $condiciones = ["ruta_id = $ruta_id", "pasajero_id = $pasajero_id"];
                    $rel = RelCotPaxRuta::where('cotizacion_id', $cotizar_id, $condiciones);

                    if (isset($rel)) {
                        $resultado = $rel->eliminarRel();

                        if ($resultado['error']) {
                            RelCotPaxRuta::setAlerta('error', 'Error al eliminar relación.');
                            $alertas = RelCotPaxRuta::getAlertas();
                            $respuesta['alertas']  = $alertas;
                            break;
                        }
                    }
                }
            }
            echo json_encode($respuesta);
        }
    }

    public static function servicio()
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

            // Validar el ID
            $cotizar_id = $_POST['cotizar_id'];
            $cotizar_id = filter_var($cotizar_id, FILTER_VALIDATE_INT);

            if (!$cotizar_id) {
                header('Location: /costear/cotizacion');
                return;
            }

            // validar si la cotizacion ya esta en un servicio
            $existeServ = Servicio::where('cotizar_id', $cotizar_id);
            if ($existeServ) {
                Servicio::setAlerta('error', 'El Servicio ya fue creado.');
                $alertas = Servicio::getAlertas();
                $respuesta['alertas'] = $alertas;
            }

            // Obtener Cotizacion a Clonar
            $cot_BD = Cotizar::where('cotizar_id', $cotizar_id);

            if (!$cot_BD) {
                Cotizar::setAlerta('error', 'La cotización no existe.');
                $alertas = Cotizar::getAlertas();
                $respuesta['alertas'] = $alertas;
            }

            if (empty($alertas)) {
                $cotizar = new Cotizar();
                $cotizar->sincronizar($cot_BD);
                $cotizar->fecha_creacion = date('Y-m-d');
                $cotizar->user_creacion = $_SESSION["nombre_user"];
                $cotizar->user_modificacion = $_SESSION["nombre_user"];
                $cotizar->ip_user = $_SERVER['REMOTE_ADDR'];
                $cotizar->estatus = 'SVC';

                $servicio = new Servicio();
                $servicio->sincronizar($cot_BD);
                $servicio->fecha_creacion = date('Y-m-d');
                $servicio->user_creacion = $_SESSION["nombre_user"];
                $servicio->user_modificacion = $_SESSION["nombre_user"];
                $servicio->ip_user = $_SERVER['REMOTE_ADDR'];
                $servicio->estatus = 'SVC';

                $resCot = $cotizar->guardar();
                $resServ = $servicio->guardar();

                $serv_id = $resServ['id'];

                if ($resServ['resultado'] == 1) {

                    try {

                        $objetosCotizarDet = [];
                        // Obtener los detalles de la cotizacion
                        $cotDet_BD = CotizarDetalle::where('cotizar_id', $cotizar_id);

                        if (!is_array($cotDet_BD)) $cotDet_BD = [$cotDet_BD];

                        foreach ($cotDet_BD as $key => $detruta) {
                            $detalleCotizar = new ServicioDetalle();
                            $detalleCotizar->sincronizar($detruta);

                            $detalleCotizar->fecha_creacion = date('Y-m-d H:i:s');
                            $detalleCotizar->user_creacion = $_SESSION["nombre_user"];
                            $detalleCotizar->user_modificacion = $_SESSION["nombre_user"];
                            $detalleCotizar->ip_user = $_SERVER['REMOTE_ADDR'];
                            $detalleCotizar->servicio_id = $serv_id;

                            $objetosCotizarDet[$key] = $detalleCotizar;
                        } // foreach

                        // Procede a Insertar el Detalle en el Modelo
                        $detalleResul = $detalleCotizar->guardarDetalle($objetosCotizarDet);

                        if (isset($detalleResul['error'])) {
                            // eliminar encabezado
                            $cotDelete = Servicio::where('servicio_id', $serv_id);
                            $resultDelete = $cotDelete->eliminar();

                            $respuesta['exito'] = $exito = 0;
                        } else {
                            $respuesta['exito'] = $exito = 1;
                        }
                    } catch (\Throwable $th) {
                        $cotDelete = Servicio::where('servicio_id', $serv_id);
                        $resultDelete = $cotDelete->eliminar();

                        $respuesta = [];
                        $respuesta['exito'] = $exito = 0;
                    }
                } else {
                    $respuesta['exito'] = $exito = 0;
                }
            }

            echo json_encode($respuesta);
        }
    }

    public static function pax()
    {
        if (!isAuth()) {
            header('Location: /login');
        }
        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('costear/cotizacion')) {
            header('Location: /dashboard');
            exit;
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            $cotizarID = $_POST['cotizar_id'];

            $resPax = Pasajero::allWithWhere(
                "
                    u.*
                ",
                [
                    "relcotpax t1" => " u.pasajero_id = t1.id_pax",
                    "cotizar t2" => "t1.id_cot = t2.cotizar_id"
                ],
                [
                    "t2.cotizar_id = $cotizarID"
                ]
            );
            // $resp = array();

            // Obtener documentos por pasajero
            foreach ($resPax as $key => $pasajero) {
                $idPax = $pasajero->pasajero_id;

                $resDoc = Documento::where('id_pasajero', $idPax);

                if ($resDoc) $resp[$idPax] = $resDoc;
            }

            $resPax = isset($resPax) ? (is_array($resPax) ? $resPax : array($resPax)) : '';

            $resultado['pasajeros'] = $resPax;
            $resultado['paxDoc'] = $resp;

            echo json_encode($resultado);
        }
    }

    public static function rutPaxCot()
    {
        if (!isAuth()) {
            header('Location: /login');
        }
        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('costear/cotizacion')) {
            header('Location: /dashboard');
            exit;
        }

        $pax = new Pasajero();
        $relCot = new RelCotPaxRuta();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            $cotizarID = $_POST['cotizar_id'];

            $resPax = RelCotPaxRuta::allWithWhere(
                " 
                    u.*, t1.nombre
                ",
                [
                    "pasajeros t1" => "u.pasajero_id = t1.pasajero_id",
                ],
                [
                    "u.cotizacion_id = $cotizarID "
                ]
            );
            // $resPax = RelCotPaxRuta::allForeing(
            //     " u.*, t1.nombre",
            //     [
            //         "pasajeros t1" => "u.pasajero_id = t1.pasajero_id",
            //         "" => ""
            //     ]
            // );

            $resPax = isset($resPax) ? (is_array($resPax) ? $resPax : array($resPax)) : '';

            echo json_encode($resPax);
        }
    }

    public static function codigos()
    {
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('costear/cotizacion')) {
            header('Location: /dashboard');
            exit;
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            $origen = $_POST['origen'];
            $destino = $_POST['destino'];

            // Crear un array con los IDs en el orden específico
            $ids = [$origen, $destino];

            $aeropuertos = Aeropuerto::buscarRegistros($ids);

            // Crear un mapa de aeropuertos usando el ID como clave
            $aeropuertosMap = [];
            foreach ($aeropuertos as $aeropuerto) {
                $aeropuertosMap[$aeropuerto->aeropuerto_id] = $aeropuerto;
            }

            // Ordenar los aeropuertos según el orden de los IDs originales
            $aeropuertosOrdenados = [];
            foreach ($ids as $id) {
                if (isset($aeropuertosMap[$id])) {
                    $aeropuertosOrdenados[] = $aeropuertosMap[$id];
                }
            }

            // Recorrer cada objeto Aeropuerto en el array
            foreach ($aeropuertosOrdenados as $aeropuerto) {
                // Obtener el código IATA del objeto Aeropuerto
                $codigoIATA = $aeropuerto->codigo_icao;
                // Agregar el código IATA al array de códigos
                $codigosIATA[] = $codigoIATA;
            }

            $cadenaCodigosIATA = implode(' - ', $codigosIATA);

            echo json_encode($cadenaCodigosIATA);
        }
    }

    public static function generarPDF($datos)
    {

        $aeronave = $datos['aeronaveName'];
        $matricula = $datos['matricula'];
        $asientos = $datos['asientos'];
        $folio = $datos['folio'];
        $fecha_cot = $datos['fecha_cot'];
        $clienteName = $datos['clienteName'];
        $condiciones = $datos['condiciones'];
        $subtotal = $datos["subtotal"];
        $ivaNac = $datos["ivaNac"];
        $ivaInt = $datos["ivaInt"];
        $total = $datos["total"];
        $cant_pernocta = $datos["cant_pernocta"];
        $tot_pernocta = $datos["tot_pernocta"];
        $cant_hrs = $datos["cant_hrs"];
        $tot_hrs = $datos["tot_hrs"];
        $detalleRutas = json_decode($_POST['detalles'], true);

        // Convertir la cadena en un objeto DateTime
        $fecha_cot_dt = DateTime::createFromFormat('d/m/Y', $fecha_cot);

        if ($fecha_cot_dt === false) {
            echo "Error al convertir la fecha.";
        } else {
            $fecha_vigencia_dt = clone $fecha_cot_dt; // Clonar para evitar modificar $fecha_cot_dt directamente
            $fecha_vigencia_dt->modify('+10 days');
            $vigencia = $fecha_vigencia_dt->format('d/m/Y');
        }

        $pdf = new PDF();
        $pdf->AddPage('P', 'LETTER');

        ///////////////////////////////////////////////
        $imageFile = 'build/img/esquina_logo.png';  // ajusta la ruta y nombre de tu imagen
        $imageWidth = 80;  // ancho de la imagen en mm (ajusta según necesites)
        $imageX = -7;
        $imageY = -15;  // posición Y en la parte superior (ajusta según necesites)

        $imageFileLogo = 'build/img/logo.png';  // ajusta la ruta y nombre de tu imagen

        // Insertar la imagen
        $pdf->Image($imageFile, $imageX, $imageY, $imageWidth);
        $pdf->Image($imageFileLogo, 14, -6, 50);

        date_default_timezone_set('America/Monterrey'); // Ajusta esto a tu zona horaria

        // VARIABLES
        $fztit = 15; // fontTitulo
        $fztxt = 10; // fontSize
        $fzGrid = 10;
        $altParr = 8; // AlturaParrafo

        // Config
        $pdf->SetTextColor(0, 0, 0);

        // Texto
        $pdf->Ln(5); // Añadir un espacio de 5 unidades después de la aeronave
        $pdf->SetFont('DejaVu', 'B', $fztit); // Usar la fuente añadida
        $pdf->Cell(110, $altParr, '', 0, 0, 'L');
        $pdf->Cell(0, $altParr, 'Cotización', 0, 1, 'L');
        $pdf->Ln(6); // Añadir un espacio de 5 unidades después de la aeronave

        $pdf->SetFont('DejaVu', '', $fztxt);
        $pdf->SetTextColor(100, 100, 100);

        $pdf->Cell(115, $altParr, "", 0, 0, 'L');
        $pdf->Cell(25, $altParr, "Fecha:", 0, 0, 'L');
        $pdf->Cell(0, $altParr, $fecha_cot, 0, 1, 'R');
        $pdf->Cell(115, $altParr, "", 0, 0, 'L');
        $pdf->Cell(25, $altParr, "Vigencia:", 0, 0, 'L');
        $pdf->Cell(0, $altParr, $vigencia, 0, 1, 'R');
        $pdf->Cell(115, $altParr, "", 0, 0, 'L');
        $pdf->Cell(25, $altParr, "No:", 0, 0, 'L');
        $pdf->Cell(0, $altParr, $folio, 0, 1, 'R');
        $pdf->Cell(115, $altParr, "", 0, 0, 'L');
        $pdf->Cell(25, $altParr, "Aeronave:", 0, 0, 'L');
        $pdf->Cell(0, $altParr, $aeronave, 0, 1, 'R');
        $pdf->Ln(4); // Añadir un espacio de 5 unidades después de la aeronave


        $pdf->SetFont('DejaVu', 'B', $fztit);
        $pdf->SetTextColor(0, 0, 0);
        $pdf->Cell(3, $altParr, '', 0, 0, 'L');
        $pdf->Cell(107, $altParr, 'Cliente', 0, 0, 'L');
        $pdf->Cell(0, $altParr, 'Condiciones de Crédito', 0, 1, 'L');
        $pdf->Cell(0, 0, "", 'B', 1, 'L');

        $pdf->SetFont('DejaVu', '', $fztxt);
        $pdf->SetTextColor(100, 100, 100);
        $pdf->Cell(3, $altParr, '', 0, 0, 'L');
        $pdf->Cell(107, $altParr, $clienteName, 0, 0, 'L');
        $pdf->Cell(0, $altParr, $condiciones, 0, 1, 'L');
        $pdf->Ln(4); // Añadir un espacio de 5 unidades después de la aeronave

        $pdf->SetFont('DejaVu', 'B', $fztit);
        $pdf->SetTextColor(0, 0, 0);
        $pdf->Cell(3, $altParr, '', 0, 0, 'L');
        $pdf->Cell(107, $altParr, 'Servicio de Vuelo', 0, 1, 'L');
        $pdf->Cell(0, 0, "", 'B', 1, 'L');

        ///////////////////// Tabla
        // Colores, ancho de línea y fuente en negrita
        $pdf->SetFont('DejaVu', 'B', 9);
        $pdf->SetTextColor(100, 100, 100);
        $pdf->Cell(25, $altParr, "Fecha", 0, 0, 'L');
        $pdf->Cell(60, $altParr, "Concepto", 0, 0, 'L');
        $pdf->Cell(20, $altParr, "Origen", 0, 0, 'C');
        $pdf->Cell(20, $altParr, "Destino", 0, 0, 'C');
        $pdf->Cell(15, $altParr, "Cant", 0, 0, 'C');
        $pdf->Cell(28, $altParr, "Tarifa USD", 0, 0, 'C');
        $pdf->Cell(28, $altParr, "Subtotal USD", 0, 1, 'C');
        $pdf->Cell(0, 0, "", 'B', 1, 'L');

        function totales($pdf, $cant_hrs, $cant_pernocta, $tot_hrs, $subtotal, $ivaNac, $ivaInt, $total)
        {
            // VARIABLES
            $fztit = 14; // fontTitulo
            $fztxt = 11; // fontSize
            $fzGrid = 10;
            $altParr = 8; // AlturaParrafo

            // Sección de Totales
            $pdf->Ln(8); // Añadir un espacio de 5 unidades después de la aeronave
            $pdf->SetFont('DejaVu', 'B', $fzGrid);
            $pdf->SetTextColor(0, 0, 0);
            $pdf->Cell(3, $altParr, '', 0, 0, 'L');
            $pdf->Cell(35, $altParr, 'Total Horas Vuelo', 0, 0, 'L');
            $pdf->Cell(30, $altParr, $cant_hrs, 0, 0, 'R');
            $pdf->Cell(55, $altParr, '', 0, 0, 'C');
            $pdf->Cell(35, $altParr, 'Subtotal USD', 0, 0, 'L');
            $pdf->Cell(40, $altParr, '$' . $subtotal, 0, 1, 'R');

            $pdf->SetFont('DejaVu', '', $fzGrid);
            $pdf->Cell(3, $altParr, '', 0, 0, 'L');
            $pdf->Cell(35, $altParr, 'Pernocta', 0, 0, 'L');
            $pdf->Cell(30, $altParr, $cant_pernocta, 0, 0, 'R');
            $pdf->Cell(55, $altParr, '', 0, 0, 'C');
            $pdf->Cell(35, $altParr, 'IVA Nac 16% USD', 0, 0, 'L');
            $pdf->Cell(40, $altParr, '$' . $ivaNac, 0, 1, 'R');

            $pdf->SetFont('DejaVu', '', $fzGrid);
            $pdf->Cell(3, $altParr, '', 0, 0, 'L');
            $pdf->Cell(35, $altParr, 'Total Horas Cotizadas', 0, 0, 'L');
            $pdf->Cell(30, $altParr, '$' . $tot_hrs, 0, 0, 'R');
            $pdf->Cell(55, $altParr, '', 0, 0, 'C');
            $pdf->Cell(35, $altParr, 'IVA Int 4$ USD', 0, 0, 'L');
            $pdf->Cell(40, $altParr, '$' . $ivaInt, 0, 1, 'R');

            $pdf->SetFont('DejaVu', '', $fzGrid);
            $pdf->Cell(3, $altParr, '', 0, 0, 'L');
            $pdf->Cell(35, $altParr, '', 0, 0, 'L');
            $pdf->Cell(30, $altParr, '', 0, 0, 'R');
            $pdf->Cell(55, $altParr, '', 0, 0, 'C');
            $pdf->SetFont('DejaVu', 'B', $fzGrid);
            $pdf->SetTextColor(100, 100, 100);
            $pdf->Cell(35, $altParr, 'Total USD', 0, 0, 'L');
            $pdf->Cell(40, $altParr, '$' . $total, 0, 1, 'R');
        }

        function bancosConsideraciones($pdf, $matricula, $asientos)
        {
            // VARIABLES
            $fztit = 14; // fontTitulo
            $fztxt = 11; // fontSize
            $fzGrid = 10;
            $altParr = 8; // AlturaParrafo

            $pdf->Ln(12); // Añadir un espacio de 5 unidades después de la aeronave
            // Sección de Bancos
            $pdf->Cell(3, $altParr, '', 0, 0, 'L');
            $pdf->Cell(30, $altParr, "Banco", 0, 0, 'L');
            $pdf->Cell(30, $altParr, "Moneda", 0, 0, 'C');
            $pdf->Cell(35, $altParr, "Cuenta", 0, 0, 'C');
            $pdf->Cell(50, $altParr, "Clabe", 0, 0, 'C');
            $pdf->Cell(50, $altParr, "Sucursal", 0, 1, 'C');
            $pdf->Cell(0, 0, "", 'B', 1, 'L');

            $pdf->SetFont('DejaVu', '', 8);
            $pdf->Cell(3, 6, '', 0, 0, 'L');
            $pdf->Cell(30, 6, "BANORTE", 0, 0, 'L');
            $pdf->Cell(30, 6, "Pesos", 0, 0, 'C');
            $pdf->Cell(35, 6, "1218075813", 0, 0, 'C');
            $pdf->Cell(50, 6, "072580012180758132", 0, 0, 'C');
            $pdf->Cell(50, 6, "1346 Sendero Norte", 0, 1, 'C');
            $pdf->Cell(3, 6, '', 0, 0, 'L');
            $pdf->Cell(30, 6, "BANORTE", 0, 0, 'L');
            $pdf->Cell(30, 6, "Pesos", 0, 0, 'C');
            $pdf->Cell(35, 6, "1218075813", 0, 0, 'C');
            $pdf->Cell(50, 6, "072580012180758132", 0, 0, 'C');
            $pdf->Cell(50, 6, "1346 Sendero Norte", 0, 1, 'C');


            // Por matricula Sección de Consideraciones XA-MOT = Helicopertor / XA-JMA = Jet
            if ($matricula == 'XA-MOT') {
                $pdf->SetFont('DejaVu', 'B', 9);
                $pdf->Cell(0, 6, "Consideraciones", 0, 1, 'L');
                $pdf->SetFont('DejaVu', '', 8);
                $pdf->Cell(0, 5, "• Los tiempos de vuelo son estimados, se finiquitará contra bitácora real de vuelo.", 0, 1, 'L');
                $pdf->Cell(0, 5, "• Es necesario pagar el 50% para confirmar la ruta, el resto se tendrá que liquidar 24 horas antes del vuelo.", 0, 1, 'L');
                $pdf->Cell(0, 5, "• Cancelaciones dentro de 7 días previos causaran costo de penalización de 1 hora.", 0, 1, 'L');
                $pdf->Cell(0, 5, "• Se incluyen agua, refrescos y frituras; alimentos/alcohol se cobra por separado.", 0, 1, 'L');
                $pdf->Cell(0, 5, "• Capacidad máxima " . $asientos . " pasajeros. • No se permiten mascotas a bordo.", 0, 1, 'L');
                $pdf->Cell(0, 5, "• Esta cotización tiene validez de 10 días.", 0, 1, 'L');
            } else {
                // Default
                $pdf->SetFont('DejaVu', 'B', 9);
                $pdf->Cell(0, 6, "Consideraciones", 0, 1, 'L');
                $pdf->SetFont('DejaVu', '', 8);
                $pdf->Cell(0, 5, "• Los tiempos de vuelo son estimados, se finiquitará contra bitácora real de vuelo.", 0, 1, 'L');
                $pdf->Cell(0, 5, "• Es necesario pagar el 50% para confirmar la ruta, el resto se tendrá que liquidar 24 horas antes del vuelo.", 0, 1, 'L');
                $pdf->Cell(0, 5, "• Si se apaga el motor se cobrará .1 por cada encendido.", 0, 1, 'L');
                $pdf->Cell(0, 5, "• El costo del aterrizaje es por operación y puede variar sin previo aviso.", 0, 1, 'L');
                $pdf->Cell(0, 5, "• El costo de TUA es por pasajero y puede variar sin previo aviso.", 0, 1, 'L');
                $pdf->Cell(0, 5, "• Cancelaciones dentro de 7 días previos causaran costo de penalización de 1 hora.", 0, 1, 'L');
                $pdf->Cell(0, 5, "• Se incluyen agua, refrescos y frituras; alimentos/alcohol se cobra por separado.", 0, 1, 'L');
                $pdf->Cell(0, 5, "• Capacidad máxima " . $asientos . " pasajeros. • No se permiten mascotas a bordo.", 0, 1, 'L');
            }
        }

        // ejemplo de datos
        $totalRows = count($detalleRutas);
        $rowsPerPage = 35;  // Número de filas que caben en una página
        $initialRows = 13;  // Número de filas en la primera página mas totales

        $pdf->SetFont('DejaVu', '', 8);

        foreach ($detalleRutas as $key => $detruta) {
            $fecha_salida = fechaMX($detruta['fecha_salida']);
            $concepto = $detruta['concepto'];
            $cantidad = $detruta['cantidad'];
            $tarifa = $detruta['tarifa'];
            $subtotal = $detruta['subtotal'];
            $categoria = $detruta['categoria'];
            $origen = $detruta['origen']['municipio'];
            $destino = $detruta['destino']['municipio'];

            $pdf->Cell(25, $altParr, $fecha_salida, 0, 0, 'L');
            $pdf->Cell(20, $altParr, $categoria, 0, 0, 'L');
            $pdf->Cell(40, $altParr, $concepto, 0, 0, 'L');
            $pdf->Cell(20, $altParr, $origen, 0, 0, 'C');
            $pdf->Cell(20, $altParr, $destino, 0, 0, 'C');
            $pdf->Cell(15, $altParr, $cantidad, 0, 0, 'C');
            $pdf->Cell(28, $altParr, '$' . formatoComa($tarifa), 0, 0, 'R');
            $pdf->Cell(28, $altParr, '$' . formatoComa($subtotal), 0, 1, 'R');

            // Agregar nueva página después de la primera página y cada 35 filas
            if (($key > $initialRows && ($key - $initialRows) % $rowsPerPage == 0)) {
                $pdf->AddPage('P', 'LETTER');
            }
        }
        // debuguear('fin');

        // Sección de Totales
        totales($pdf, $cant_hrs, $cant_pernocta, $tot_hrs, $subtotal, $ivaNac, $ivaInt, $total);

        // Completar líneas en blanco si hay menos de 6 líneas
        if ($totalRows < 4) {

            for ($i = $totalRows + 1; $i <= 4; $i++) {
                $pdf->Cell(18, $altParr, "", 0, 0, 'C');
                $pdf->Cell(55, $altParr, "", 0, 0, 'C');
                $pdf->Cell(18, $altParr, "", 0, 0, 'C');
                $pdf->Cell(18, $altParr, "", 0, 0, 'C');
                $pdf->Cell(25, $altParr, "", 0, 0, 'C');
                $pdf->Cell(30, $altParr, "", 0, 0, 'C');
                $pdf->Cell(30, $altParr, "", 0, 1, 'C');
            }
        }

        if ($totalRows >= 6 && $totalRows < $initialRows) {
            $pdf->AddPage('P', 'LETTER');
        }

        bancosConsideraciones($pdf, $matricula, $asientos);

        $nombreArchivo = 'poliza.pdf';
        $pdf->Output('F', $nombreArchivo); // Guardar en el servidor

        $urlArchivo = '/' . $nombreArchivo;
        echo json_encode(array('urlArchivo' => $urlArchivo));
        exit;
    }
}


class PDF extends tFPDF
{
    public function __construct()
    {
        parent::__construct();
        // Añadir una fuente TrueType Unicode
        $this->AddFont('DejaVu', '', 'DejaVuSans.ttf', true);
        $this->AddFont('DejaVu', 'B', 'DejaVuSans-Bold.ttf', true);
    }

    function vcell($c_width, $c_height, $x_axis, $text)
    {
        $w_w = $c_height / 3;
        $w_w_1 = $w_w + 2;
        $w_w1 = $w_w + $w_w + $w_w + 3;
        $len = strlen($text);

        $lengthToSplit = 13;
        if ($len > $lengthToSplit) {
            $w_text = str_split($text, $lengthToSplit);
            $this->SetX($x_axis);
            $this->Cell($c_width, $w_w_1, $w_text[0], 0, '', '');
            if (isset($w_text[1])) {
                $this->SetX($x_axis);
                $this->Cell($c_width, $w_w1, $w_text[1], 0, '', '');
            }
            $this->SetX($x_axis);
            $this->Cell($c_width, $c_height, '', 0, 0, 'L', 0);
        } else {
            $this->SetX($x_axis);
            $this->Cell($c_width, $c_height, $text, 0, 0, 'L', 0);
        }
    }

    function Footer()
    {
        // VARIABLES
        $fztit = 14; // fontTitulo
        $fztxt = 11; // fontSize
        $fzGrid = 10;
        $altParr = 8; // AlturaParrafo

        $imageFile = 'build/img/esquina_Inferior.png';  // ajusta la ruta y nombre de tu imagen
        $imageFileAgua = 'build/img/ps_fondo.png';  // ajusta la ruta y nombre de tu imagen

        $imageWidth = 30;  // ancho de la imagen en mm (ajusta según necesites)
        $imageHeight = 15;  // Alto de la imagen en mm (ajusta según necesites)

        // Obtén las dimensiones de la página
        $pageWidth = $this->GetPageWidth();
        $pageHeight = $this->GetPageHeight();

        // Calcula la posición X para la esquina inferior derecha
        $imageX = $pageWidth - $imageWidth - 0;  // Ajusta el margen derecho si es necesario
        // Calcula la posición Y para la esquina inferior
        $imageY = $pageHeight - $imageHeight - 30;  // Ajusta el margen inferior si es necesario

        // Insertar la imagen
        $this->Image($imageFile, $imageX, $imageY, $imageWidth);
        $this->Image($imageFileAgua, 15, 45, 170);
    }
}
