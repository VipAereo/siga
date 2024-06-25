<?php

namespace Model;

class TasaAterrizaje extends ActiveRecord
{

    protected static $id = 'tasa_aterrizaje_id';
    protected static $tabla = 'tasaaterrizaje';
    protected static $columnasDB = [
        'tasa_aterrizaje_id','tarifa_aterrizaje','fecha_creacion', 'fecha_modificacion', 'user_creacion', 'user_modificacion', 
        'ip_user','aeropuerto_id','aeronave_id'
    ];
    protected static $order = 'tasa_aterrizaje_id DESC';

    public $tasa_aterrizaje_id;
    public $tarifa_aterrizaje;
    public $fecha_creacion;
    public $fecha_modificacion;
    public $user_creacion;
    public $user_modificacion;
    public $ip_user;
    public $aeropuerto_id;
    public $aeronave_id;

    public function __construct($args = [])
    {
        $this->tasa_aterrizaje_id = $args['tasa_aterrizaje_id'] ?? null;
        $this->tarifa_aterrizaje = $args['tarifa_aterrizaje'] ?? '0.00';
        $this->fecha_creacion = $args['fecha_creacion'] ?? '';
        $this->fecha_modificacion = $args['fecha_modificacion'] ?? date('Y-m-d H:i:s');
        $this->user_creacion = $args['user_creacion'] ?? '';
        $this->user_modificacion = $args['user_modificacion'] ?? '';
        $this->ip_user = $args['ip_user'] ?? '';
        $this->aeropuerto_id = $args['aeropuerto_id'] ?? '';
        $this->aeronave_id = $args['aeronave_id'] ?? '';
    }
}