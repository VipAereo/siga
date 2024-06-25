<?php

namespace Model;

class Cotizar extends ActiveRecord
{
    protected static $id = 'cotizar_id';
    protected static $tabla = 'cotizar';
    protected static $columnasDB = [
        'cotizar_id', 'folio_cotizar', 'total', 'subtotal', 'tot_hr_cotizadas', 'estatus', 'comentarios', 
        'tipo_de_viaje', 'fecha_creacion', 'fecha_modificacion', 'user_creacion', 'user_modificacion',
        'ip_user', 'broker_id', 'cliente_id', 'tipo_cambio_id', 'aeronave_id'
    ];
    protected static $order = 'cotizar_id DESC';

    public $cotizar_id;
    public $folio_cotizar;
    public $total;
    public $subtotal;
    public $tot_hr_cotizadas;
    public $estatus;
    public $comentarios;
    public $tipo_de_viaje;
    public $fecha_creacion;
    public $fecha_modificacion;
    public $user_creacion;
    public $user_modificacion;
    public $ip_user;
    public $broker_id;
    public $cliente_id;
    public $tipo_cambio_id;
    public $aeronave_id;

    public function __construct($args = [])
    {
        $this->cotizar_id = $args['cotizar_id'] ?? null;
        $this->folio_cotizar = $args['folio_cotizar'] ?? null;
        $this->total = $args['total'] ?? null;
        $this->subtotal = $args['subtotal'] ?? null;
        $this->tot_hr_cotizadas = $args['tot_hr_cotizadas'] ?? null;
        $this->estatus = $args['estatus'] ?? '';
        $this->comentarios = $args['comentarios'] ?? '';
        $this->tipo_de_viaje = $args['tipo_de_viaje'] ?? 3;
        $this->fecha_creacion = $args['fecha_creacion'] ?? '';
        $this->fecha_modificacion = $args['fecha_modificacion'] ?? date('Y-m-d H:i:s');
        $this->user_creacion = $args['user_creacion'] ?? '';
        $this->user_modificacion = $args['user_modificacion'] ?? '';
        $this->ip_user = $args['ip_user'] ?? '';
        $this->broker_id = $args['broker_id'] ?? null;
        $this->cliente_id = $args['cliente_id'] ?? null;
        $this->tipo_cambio_id = $args['tipo_cambio_id'] ?? null;
        $this->aeronave_id = $args['aeronave_id'] ?? null;
    }
}

class CotizarDetalle extends ActiveRecord
{
    protected static $id = 'cot_det_id';
    protected static $tabla = 'cotizardetalle';
    protected static $columnasDB = [
        'cot_det_id', 'categoria_id', 'cantidad', 'percost','concepto', 'tarifa', 'subtotal', 'pasajeros', 
        'tipo_vuelo', 'fecha_salida', 'hora_salida', 'tiempo_estimado',
        'fecha_creacion', 'fecha_modificacion', 'user_creacion', 'user_modificacion', 'ip_user',
        'costo_id', 'relacion_id', 'cotizar_id','line_id','rel_ruta'
    ];
    protected static $order = 'cot_det_id';

    public $cot_det_id;
    public $categoria_id;
    public $cantidad;
    public $percost;
    public $concepto;
    public $tarifa;
    public $subtotal;
    public $pasajeros;
    public $tipo_vuelo;
    public $fecha_salida;
    public $hora_salida;
    public $tiempo_estimado;
    public $fecha_creacion;
    public $fecha_modificacion;
    public $user_creacion;
    public $user_modificacion;
    public $ip_user;
    public $costo_id;
    public $relacion_id;
    // public $ruta_id;
    // public $tasa_aterrizaje_id;
    public $cotizar_id;
    public $line_id;
    public $rel_ruta;


    public function __construct($args = [])
    {
        $this->cot_det_id = $args['cot_det_id'] ?? null;
        $this->categoria_id = $args['categoria_id'] ?? null;
        $this->cantidad = $args['cantidad'] ?? '';
        $this->percost = $args['percost'] ?? '';
        $this->concepto = $args['concepto'] ?? '';
        $this->tarifa = $args['tarifa'] ?? null;
        $this->subtotal = $args['subtotal'] ?? null;
        $this->pasajeros = $args['pasajeros'] ?? null;
        $this->tipo_vuelo = $args['tipo_vuelo'] ?? '';
        $this->fecha_salida = $args['fecha_salida'] ?? '';
        $this->hora_salida = $args['hora_salida'] ?? '';
        $this->tiempo_estimado = $args['tiempo_estimado'] ?? null;
        $this->fecha_creacion = $args['fecha_creacion'] ?? '';
        $this->fecha_modificacion = $args['fecha_modificacion'] ?? date('Y-m-d H:i:s');
        $this->user_creacion = $args['user_creacion'] ?? '';
        $this->user_modificacion = $args['user_modificacion'] ?? '';
        $this->ip_user = $args['ip_user'] ?? '';
        $this->costo_id = $args['costo_id'] ?? null;
        $this->relacion_id = $args['relacion_id'] ?? null;
        // $this->ruta_id = $args['ruta_id'] ?? null;
        // $this->tasa_aterrizaje_id = $args['tasa_aterrizaje_id'] ?? null;
        $this->cotizar_id = $args['cotizar_id'] ?? null;
        $this->line_id = $args['line_id'] ?? null;
        $this->rel_ruta = $args['rel_ruta'] ?? null;
    }
}
