<?php

namespace Model;

class Rol extends ActiveRecord
{
    protected static $id = 'rol_id';
    protected static $tabla = 'roles';
    protected static $columnasDB = ['rol_id', 'nombre_rol', 'descripcion', 'estatus','fecha_creacion', 'fecha_modificacion', 'user_creacion', 'user_modificacion', 'ip_user'];
    protected static $order = 'rol_id DESC';

    public $rol_id;
    public $nombre_rol;
    public $descripcion;
    public $estatus;
    public $fecha_creacion;
    public $fecha_modificacion;
    public $user_creacion;
    public $user_modificacion;
    public $ip_user;

    public function __construct($args = []) {
        $this->rol_id = $args['rol_id'] ?? null;
        $this->nombre_rol = $args['nombre_rol'] ?? '';
        $this->descripcion = $args['descripcion'] ?? '';
        $this->estatus = $args['estatus'] ?? '';
        $this->fecha_creacion = $args['fecha_creacion'] ?? '';
        $this->fecha_modificacion = $args['fecha_modificacion'] ?? date('Y-m-d H:i:s');
        $this->user_creacion = $args['user_creacion'] ?? '';
        $this->user_modificacion =  $_SESSION["nombre_user"];
        $this->ip_user = $args['ip_user'] ?? '';
    }
}
