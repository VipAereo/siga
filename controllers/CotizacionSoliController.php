<?php

namespace Controllers;

use Model\ActiveRecord;
use MVC\Router;
use Model\Cotizar;
use Model\CotizarDetalle;
use Model\Documento;
use Model\Pasajero;
use Model\RelCotPax;
use Model\Ruta;
use Intervention\Image\ImageManagerStatic as Image;

class CotizacionSoliController
{

    public static function cotizacion(Router $router)
    {

        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('solicitar/cotizacion')) {
            header('Location: /dashboard');
            exit;
        }

        $router->render('transacciones/solCotizacion', [
            'titulo' => "Cotización",
        ]);
    }

    public static function cotizaciones()
    {

        // Verifica que este logeado
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('solicitar/cotizacion')) {
            header('Location: /dashboard');
            exit;
        }

        $conditions = [];
        $userNow = $_SESSION['nombre_user'];
        if ($userNow != 'admin') {
            $conditions[] = ["u.user_creacion = '$userNow'"];
        }

        // $cotizar2 = Cotizar::allJoinPerzo(
        //     "u.*, t2.ruta_id AS ruta, t1.fecha_salida, t3.siglas_empresa as nombreBrok, t3.contacto_principal, t4.nombre as nombreCli,
        //     t5.modelo as modeloAeronave, CONCAT(origen.municipio, ' - ', destino.municipio) AS rutas_nombre
        //     ",
        //     [
        //         "brokers t3" => "u.broker_id  = t3.broker_id ",
        //         "clientes t4" => "u.cliente_id = t4.cliente_id",
        //         "aeronaves t5" => "u.aeronave_id = t5.aeronave_id",
        //         "cotizardetalle t1" => "u.cotizar_id = t1.cotizar_id",
        //         "rutas t2" => "t1.ruta_id = t2.ruta_id",
        //         "aeropuertos origen" => "t2.origen = origen.aeropuerto_id",
        //         "aeropuertos destino" => "t2.destino = destino.aeropuerto_id",
        //     ],
        //     $conditions,
        //     [
        //         "INNER JOIN (
        //             SELECT cotizar_id, MIN(cot_det_id) AS min_cot_det_id
        //             FROM cotizarDetalle
        //             GROUP BY cotizar_id
        //         ) AS min_cd ON t1.cotizar_id = min_cd.cotizar_id AND t1.cot_det_id = min_cd.min_cot_det_id
        //         ",
        //     ]
        // );

        $cotizar = Cotizar::allJoinPerzo(
            "u.*,t1.fecha_salida, t1.concepto,t3.siglas_empresa as nombreBrok, t3.contacto_principal, t4.nombre as nombreCli,
            t5.modelo as modeloAeronave, t6.tipo_cambio
            ",
            [
                "cotizardetalle t1" => "u.cotizar_id = t1.cotizar_id",
                "brokers t3" => "u.broker_id  = t3.broker_id ",
                "clientes t4" => "u.cliente_id = t4.cliente_id",
                "aeronaves t5" => "u.aeronave_id = t5.aeronave_id",
                "tiposcambio t6" => "u.tipo_cambio_id = t6.tipo_cambio_id"
            ],
            $conditions,
            [
                " INNER JOIN (
                    SELECT cotizar_id, MIN(cot_det_id) AS min_cot_det_id
                    FROM cotizarDetalle
                    GROUP BY cotizar_id
                ) AS min_cd ON t1.cotizar_id = min_cd.cotizar_id AND t1.cot_det_id = min_cd.min_cot_det_id
                "
            ]
        );

        $cotizar = isset($cotizar) ? (is_array($cotizar) ? $cotizar : array($cotizar)) : '';

        echo json_encode($cotizar);
    }

    public static function vuelosId()
    {
        if (!isAuth()) {
            header('Location: /login');
        }
        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('solicitar/cotizacion')) {
            header('Location: /dashboard');
            exit;
        }


        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            $cot = new Cotizar();
            $cotizarID = $_POST['cotizar_id'];

            // obtener Vuelos, pasajeros, documentos y relaciones
            $resultado = CotizarDetalle::allWithWhere(
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
                    "categorias t9" => "u.categoria_id = t9.categoria_id"
                ],
                [
                    "u.cotizar_id = '$cotizarID'"
                ]
            );

            $resultado = isset($resultado) ? (is_array($resultado) ? $resultado : array($resultado)) : '';
        }
        echo json_encode($resultado);
    }

    public static function crear()
    {
        // Verifica que este logeado
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('solicitar/cotizacion')) {
            header('Location: /dashboard');
            exit;
        }

        $respuesta = [];
        $alertas = [];
        $objetosCotizarDet = [];

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
            // Formatear el nuevo folio para que tenga la longitud y el formato deseado
            $nuevoFolio = str_pad($nuevoFolioNumero, 5, '0', STR_PAD_LEFT); // Ajustar el nuevo folio a 5 dígitos
            // $nuevoFolio = str_pad($nuevoFolioNumero, 6, '0', STR_PAD_LEFT);
            $existeNewFolio = Cotizar::where('folio_cotizar', $cotizar->folio_cotizar);

            // sincronizar datos del form con el modelo 
            $cotizar->sincronizar($_POST);
            $cotizar->fecha_creacion = date('Y-m-d H:i:s');
            $cotizar->user_creacion = $_SESSION["nombre_user"];
            $cotizar->user_modificacion = $_SESSION["nombre_user"];
            $cotizar->ip_user = $_SERVER['REMOTE_ADDR'];
            $cotizar->folio_cotizar = $nuevoFolio;
            $cotizar->estatus = 'PND';

            $detalleRutas = json_decode($_POST['detalleRutas'], true);

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

                if ($resultadoCoti['resultado'] == 1) {

                    try {

                        // Insertar Detalle
                        $cotizarID = $resultadoCoti['id'];
                        // Verificar si la decodificación fue exitosa
                        if ($detalleRutas !== null) {

                            foreach ($detalleRutas as $key => $detruta) {
                                // Existe en la tabla Ruta?
                                $origen = $detruta['origen'];
                                $destino = $detruta['destino'];

                                $condiciones = ["origen = $origen", "destino = $destino"];
                                $existeRuta = Ruta::where('aeropuerto_id', $origen, $condiciones);

                                if (!isset($existeRuta)) {
                                    Cotizar::setAlerta('error', 'La Ruta no existe.');
                                    $alertas = Cotizar::getAlertas();
                                    $respuesta['alertas'] = $alertas;
                                }

                                $rutaID = $existeRuta->ruta_id;
                                $tipo_vuelo = $existeRuta->tipo_vuelo;

                                $aeronaveID = $_POST['aeronave_id'];
                                $condiciones = ["aeronave_id = $aeronaveID"];

                                if (empty($alertas)) {

                                    $detalleCotizar = new CotizarDetalle();
                                    $detalleCotizar->sincronizar($detruta);

                                    $detalleCotizar->fecha_creacion = date('Y-m-d H:i:s');
                                    $detalleCotizar->user_creacion = $_SESSION["nombre_user"];
                                    $detalleCotizar->user_modificacion = $_SESSION["nombre_user"];
                                    $detalleCotizar->ip_user = $_SERVER['REMOTE_ADDR'];
                                    $detalleCotizar->cotizar_id = $cotizarID;
                                    $detalleCotizar->ruta_id = $rutaID;
                                    $detalleCotizar->tipo_vuelo = $tipo_vuelo;
                                    $detalleCotizar->categoria_id = 1;
                                    $detalleCotizar->relacion_id = $rutaID;
                                    $detalleCotizar->rel_ruta = $detruta['line_id'];

                                    $objetosCotizarDet[$key] = $detalleCotizar;
                                }
                            } // end Each

                            // debuguear($objetosCotizarDet);

                            // Procede a Insertar el Detalle en el Modelo
                            $detalleResul = $detalleCotizar->guardarDetalle($objetosCotizarDet);

                            if (isset($detalleResul['error'])) {
                                // eliminar encabezado
                                $cotDelete = Cotizar::where('cotizar_id', $cotizarID);
                                $resultDelete = $cotDelete->eliminar();

                                $respuesta['exito'] = $exito = 0;
                            } else {
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
        if (ActiveRecord::hasPermission('solicitar/cotizacion')) {
            header('Location: /dashboard');
            exit;
        }

        $alertas = [];
        $cotizar = new Cotizar();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Validar el ID
            $cotizar_id = $_POST['cotizar_id'];
            $cotizar_id = filter_var($cotizar_id, FILTER_VALIDATE_INT);

            if (!$cotizar_id) {
                header('Location: /solicitar/cotizacion');
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
                $cotizar->tipo_de_viaje = $cot_BD->tipo_de_viaje;
                $cotizar->total = $cot_BD->total;
                $cotizar->subtotal = $cot_BD->subtotal;
                $cotizar->tot_hr_cotizadas = $cot_BD->tot_hr_cotizadas;

                $resultado  = $cotizar->guardar();

                if ($resultado['resultado'] == 1) {

                    // Actualizar Detalle
                    $detalleRutas = json_decode($_POST['detalleRutas'], true);

                    // Verificar si la decodificación fue exitosa
                    if ($detalleRutas !== null) {
                        foreach ($detalleRutas as $key => $detruta) {
                            $det_id = $detruta['cot_det_id'];
                            $origen = $detruta['origen'];
                            $destino = $detruta['destino'];

                            // Validar si la nueva ruta existe
                            $condiciones = ["origen = $origen", "destino = $destino"];
                            $existeRelacion = Ruta::where('aeropuerto_id', $origen, $condiciones);

                            // si existe la ruta guardar el ID 
                            if (!isset($existeRelacion)) {
                                Cotizar::setAlerta('error', 'La Ruta no existe.');
                                $alertas = Cotizar::getAlertas();
                                $respuesta['alertas'] = $alertas;
                            }

                            // si no existe la Cotizacion detalle
                            $rutaID = $existeRelacion->ruta_id;
                            $rutaUpd = CotizarDetalle::where('cot_det_id ', $det_id);

                            // si no existe la Cotizacion detalle
                            // if (!isset($rutaUpd)) {
                            //     Cotizar::setAlerta('error', 'La Cotización no existe2.');
                            //     $alertas = Cotizar::getAlertas();
                            //     $respuesta['alertas'] = $alertas;
                            // }

                            if (empty($alertas)) {
                                $cotizarDet = new CotizarDetalle();
                                $cotizarDet->sincronizar($detruta);
                                $cotizarDet->costo_id = $rutaUpd->costo_id;
                                $cotizarDet->ip_user = $_SERVER['REMOTE_ADDR'];
                                $cotizarDet->user_modificacion = $_SESSION["nombre_user"];
                                $cotizarDet->user_creacion = $cot_BD->user_creacion;
                                $cotizarDet->fecha_modificacion = date('Y-m-d');
                                $cotizarDet->fecha_creacion = $cot_BD->fecha_creacion;
                                $cotizarDet->cotizar_id = $cot_BD->cotizar_id;
                                $cotizarDet->ruta_id = $rutaID;

                                if (!isset($rutaUpd)) {
                                    $cotizarDet->relacion_id = $rutaID;
                                    $cotizarDet->rel_ruta = $rutaID;
                                } else {
                                    $cotizarDet->relacion_id = $rutaUpd->relacion_id;
                                    $cotizarDet->rel_ruta = $rutaUpd->rel_ruta;
                                }

                                $objetosCotizarDet[$key] = $cotizarDet;
                            }
                        } // end Each

                        // Quitar Campos e actualizar
                        foreach ($objetosCotizarDet as $objeto) {
                            unset($objeto->tarifa_aterrizaje);
                            unset($objeto->tarifa_ser_terrestre);
                            unset($objeto->tarifa_ser_auxiliares);
                            unset($objeto->total_costos);
                            unset($objeto->costo_tarifa);
                            unset($objeto->subtotal);
                            unset($objeto->tipo_de_viaje);
                            unset($objeto->hora_cotizada);
                            unset($objeto->pernocta);
                            unset($objeto->tiempo_estimado);
                        }

                        // debuguear($objetosCotizarDet);

                        // Procede a Insertar el Detalle en el Modelo
                        $detalleResul = $cotizarDet->guardarDetalle($objetosCotizarDet);

                        if ($detalleResul['error']) {
                            $respuesta['exito'] = $exito = 0;
                            $respuesta['errorSMS'] = $detalleResul['error'];
                        } else {
                            $respuesta['exito'] = $exito = 1;
                        }
                    }

                    //  GUARDAR PASAJEROS
                    $pasajerosDet = json_decode($_POST['pasajerosDet'], true);
                    if ($pasajerosDet !== null) {
                        $pasajero = new Pasajero();
                        $docs = new Documento();
                        $relCotPax = new RelCotPax();
                        foreach ($pasajerosDet as $key => $paxDet) {

                            $idPax = $paxDet['pasajero_id'];

                            // Validar si el Pasajero existe
                            $existeRelacion = Pasajero::where('pasajero_id', $idPax, []);

                            $pasajero = new Pasajero();
                            $pasajero->sincronizar($paxDet);
                            $pasajero->fecha_creacion = date('Y-m-d H:i:s');
                            $pasajero->user_creacion = $_SESSION["nombre_user"];
                            $pasajero->user_modificacion = $_SESSION["nombre_user"];
                            $pasajero->ip_user = $_SERVER['REMOTE_ADDR'];
                            if ($idPax) $pasajero->pasajero_id = $idPax;

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
                                // buscar que no exista en la BD para crear la relacion Cotizacion Pax 
                                $condiciones = ["id_pax = $idPaxBusqueda"];
                                $relacion = RelCotPax::where('id_cot', $cotizar_id, $condiciones);

                                if (!isset($relacion)) {
                                    // echo "existe pasajero ";
                                    $relCotPax->sincronizar();
                                    $relCotPax->id_cot = $cotizar_id;
                                    $relCotPax->id_pax = $idPaxBusqueda;

                                    $resRel = $relCotPax->guardar();
                                }

                                // // RELACIONAR PASAJERO EXISTENTE
                                // $condiciones = ["id_pax = $idPax"];
                                // $relacion2 = RelCotPax::where('id_cot', $cotizar_id, $condiciones);

                                // if (!isset($relacion2)) {

                                //     // echo "existe pasajero ";
                                //     $relCotPax->sincronizar();
                                //     $relCotPax->id_cot = $cotizar_id;
                                //     $relCotPax->id_pax = $idPax;

                                //     $resRel = $relCotPax->guardar();
                                // }


                                if (isset($resRel['error'])) {
                                    Pasajero::setAlerta('error', 'Error al guardar el Documento.');
                                    $alertas = Pasajero::getAlertas();
                                    $respuesta['alertas']  = $alertas;
                                }
                            }
                        }
                    }

                    $respuesta['exito'] = $exito = 1;
                } else {
                    $respuesta['exito'] = $exito = 0;
                }
            }
        }
        echo json_encode($respuesta);
    }

    public static function eliminar()
    {

        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        // Verifica que tenga permisos
        if (ActiveRecord::hasPermission('solicitar/cotizacion')) {
            header('Location: /dashboard');
            exit;
        }

        $alertas = [];

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
        }

        echo json_encode($respuesta);
    }
}
