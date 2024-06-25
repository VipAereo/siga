<?php

namespace Model;

class Servicio extends ActiveRecord
{
    protected static $id = 'servicio_id';
    protected static $tabla = 'servicios';
    protected static $columnasDB = [
        'servicio_id', 'folio_cotizar', 'total', 'subtotal', 'tot_hr_cotizadas', 'estatus', 'comentarios',
        'tipo_de_viaje', 'fecha_creacion', 'fecha_modificacion', 'user_creacion', 'user_modificacion',
        'ip_user', 'broker_id', 'cliente_id', 'tipo_cambio_id', 'aeronave_id', 'cotizar_id', 'piloto_id'
    ];
    protected static $order = 'servicio_id DESC';

    public $servicio_id;
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
    public $cotizar_id;
    public $piloto_id;

    public function __construct($args = [])
    {
        $this->servicio_id = $args['servicio_id'] ?? null;
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
        $this->cotizar_id = $args['cotizar_id'] ?? null;
        $this->piloto_id = $args['piloto_id'] ?? null;
    }
}

class ServicioDetalle extends ActiveRecord
{
    protected static $id = 'servicio_detalle_id';
    protected static $tabla = 'serviciosdetalle';
    protected static $columnasDB = [
        'servicio_detalle_id', 'categoria_id', 'concepto', 'cantidad', 'percost', 'tarifa',
        'subtotal', 'pasajeros', 'tipo_vuelo', 'fecha_salida', 'hora_salida','tiempo_estimado',
        'fecha_creacion', 'fecha_modificacion', 'user_creacion', 'user_modificacion', 'ip_user',
        'servicio_id', 'costo_id', 'relacion_id','line_id','rel_ruta'
    ];
    protected static $order = 'servicio_detalle_id ASC';

    public $servicio_detalle_id;
    public $categoria_id;
    public $concepto;
    public $cantidad;
    public $percost;
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
    public $servicio_id;
    public $costo_id;
    public $relacion_id;
    public $line_id;
    public $rel_ruta;

    public function __construct($args = [])
    {
        $this->servicio_detalle_id = $args['servicio_detalle_id'] ?? null;
        $this->categoria_id = $args['categoria_id'] ?? null;
        $this->concepto = $args['concepto'] ?? '';
        $this->cantidad = $args['cantidad'] ?? '';
        $this->percost = $args['percost'] ?? '';
        $this->tarifa = $args['tarifa'] ?? '';
        $this->subtotal = $args['subtotal'] ?? '';
        $this->pasajeros = $args['pasajeros'] ?? '';
        $this->tipo_vuelo = $args['tipo_vuelo'] ?? '';
        $this->fecha_salida = $args['fecha_salida'] ?? '';
        $this->hora_salida = $args['hora_salida'] ?? '';
        $this->tiempo_estimado = $args['tiempo_estimado'] ?? '';
        $this->fecha_creacion = $args['fecha_creacion'] ?? '';
        $this->fecha_modificacion = $args['fecha_modificacion'] ?? date('Y-m-d H:i:s');
        $this->user_creacion = $args['user_creacion'] ?? '';
        $this->user_modificacion = $args['user_modificacion'] ?? '';
        $this->ip_user = $args['ip_user'] ?? '';
        $this->servicio_id = $args['servicio_id'] ?? null;
        $this->costo_id = $args['costo_id'] ?? null;
        $this->relacion_id = $args['relacion_id'] ?? null;
        $this->line_id = $args['line_id'] ?? null;
        $this->rel_ruta = $args['rel_ruta'] ?? null;
    }
}