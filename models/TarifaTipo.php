<?php

namespace Model;

class TarifaTipo extends ActiveRecord
{

    protected static $id = 'tipo_id';
    protected static $tabla = 'tarifatipo';
    protected static $columnasDB = [
        'tipo_id', 'nombre', 'estatus','fecha_creacion', 'fecha_modificacion', 
        'user_creacion', 'user_modificacion', 'ip_user'
    ];
    protected static $order = 'tipo_id DESC';
    
    public $tipo_id;
    public $nombre;
    public $estatus;
    public $fecha_creacion;
    public $fecha_modificacion;
    public $user_creacion;
    public $user_modificacion;
    public $ip_user;

    public function __construct($args = [])
    {
        $this->tipo_id = $args['tipo_id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->estatus = $args['estatus'] ?? '';
        $this->fecha_creacion = $args['fecha_creacion'] ?? '';
        $this->fecha_modificacion = $args[''] ?? date('Y-m-d H:i:s');
        $this->user_creacion = $args['user_creacion'] ?? '';
        $this->user_modificacion = $args['user_modificacion'] ?? '';
        $this->ip_user = $args['ip_user'] ?? '';
    }
}