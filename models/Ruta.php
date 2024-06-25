<?php

namespace Model;

class Ruta extends ActiveRecord
{

    protected static $id = 'ruta_id';
    protected static $tabla = 'rutas';
    protected static $columnasDB = [
        'ruta_id', 'origen', 'destino', 'tipo_vuelo','distancia', 'fecha_inicio', 'fecha_fin', 'estado_ruta',
        'fecha_creacion', 'fecha_modificacion', 'user_creacion', 'user_modificacion',
        'ip_user', 'aeropuerto_id'
    ];
    protected static $order = 'ruta_id DESC';

    public $ruta_id;
    public $origen;
    public $destino;
    public $tipo_vuelo;
    public $distancia;
    public $fecha_inicio;
    public $fecha_fin;
    public $estado_ruta;
    public $fecha_creacion;
    public $fecha_modificacion;
    public $user_creacion;
    public $user_modificacion;
    public $ip_user;
    public $aeropuerto_id;

    public function __construct($args = [])
    {
        $this->ruta_id = $args['ruta_id'] ?? null;
        $this->origen = $args['origen'] ?? null;
        $this->destino = $args['destino'] ?? null;
        $this->tipo_vuelo  = $args['tipo_vuelo '] ?? 'N';
        $this->distancia = $args['distancia'] ?? '';
        $this->fecha_inicio = $args['fecha_inicio'] ?? '';
        $this->fecha_fin = $args['fecha_fin'] ?? '';
        $this->estado_ruta = $args['estado_ruta'] ?? 'Activo';
        $this->fecha_creacion = $args['fecha_creacion'] ?? '';
        $this->fecha_modificacion = $args['fecha_modificacion'] ?? date('Y-m-d H:i:s');
        $this->user_creacion = $args['user_creacion'] ?? '';
        $this->user_modificacion = $args['user_modificacion'] ?? '';
        $this->ip_user = $args['ip_user'] ?? '';
        $this->aeropuerto_id = $args['aeropuerto_id'] ?? null;
    }
}
