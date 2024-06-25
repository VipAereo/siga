<?php

namespace Model;

class Tarifa extends ActiveRecord
{
    protected static $id = 'costo_id';
    protected static $tabla = 'tarifa_costos';
    protected static $columnasDB = [
        'costo_id', 'aeronave_id','costo_mx', 'costo_usd',
        'fecha_creacion', 'fecha_modificacion', 'user_creacion', 'user_modificacion',
        'ip_user','tarifa_id'
    ];
    protected static $order = 'costo_id';

    public $costo_id;
    public $aeronave_id;
    public $costo_mx;
    public $costo_usd;
    public $fecha_creacion;
    public $fecha_modificacion;
    public $user_creacion;
    public $user_modificacion;
    public $ip_user;
    public $tarifa_id;

    public function __construct($args = [])
    {
        $this->costo_id = $args['costo_id'] ?? null;
        $this->aeronave_id = $args['aeronave_id'] ?? null;
        $this->costo_mx = $args['costo_mx'] ?? null;
        $this->costo_usd = $args['costo_usd'] ?? null;
        $this->fecha_creacion = $args['fecha_creacion'] ?? '';
        $this->fecha_modificacion = $args['fecha_modificacion'] ?? date('Y-m-d H:i:s');
        $this->user_creacion = $args['user_creacion'] ?? '';
        $this->user_modificacion = $args['user_modificacion'] ?? '';
        $this->ip_user = $args['ip_user'] ?? '';
        $this->tarifa_id = $args['tarifa_id'] ?? null;
    }
}