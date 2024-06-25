<?php

namespace Model;

class Departamento extends ActiveRecord
{
    protected static $id = 'departamento_id';
    protected static $tabla = 'departamentos';
    protected static $columnasDB = ['departamento_id', 'nombre', 'estatus', 'fecha_creacion', 'fecha_modificacion', 'user_creacion', 'user_modificacion', 'ip_user'];
    protected static $order = 'departamento_id DESC';

    public $departamento_id;
    public $nombre;
    public $estatus;
    public $fecha_creacion;
    public $fecha_modificacion;
    public $user_creacion;
    public $user_modificacion;
    public $ip_user;

    public function __construct($args = [])
    {
        $this->departamento_id = $args['departamento_id'] ?? null ;
        $this->nombre = $args['nombre'] ?? '';
        $this->estatus = $args['estatus'] ?? '' ;
        $this->fecha_creacion = $args['fecha_creacion'] ?? '';
        $this->fecha_modificacion = $args['fecha_modificacion'] ?? date('Y-m-d H:i:s');
        $this->user_creacion = $args['user_creacion'] ?? '';
        $this->user_modificacion = $args['user_modificacion'] ?? '';
        $this->ip_user = $args['ip_user'] ?? '';
    }
}
