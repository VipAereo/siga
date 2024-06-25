<?php

namespace Model;

class Programa extends ActiveRecord
{

    protected static $id = 'programa_id';
    protected static $tabla = 'programas';
    protected static $columnasDB = ['programa_id', 'nombre', 'padre', 'nivel', 'ruta', 'fecha_creacion', 'fecha_modificacion', 'user_creacion', 'user_modificacion', 'ip_user'];
    protected static $order = 'programa_id DESC';

    public $programa_id;
    public $nombre;
    public $padre;
    public $nivel;
    public $ruta;
    public $fecha_creacion;
    public $fecha_modificacion;
    public $user_creacion;
    public $user_modificacion;
    public $ip_user;

    public function __construct($args = [])
    {
        $this->programa_id = $args['programa_id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->padre = $args['padre'] ?? '';
        $this->nivel = $args['nivel'] ?? '';
        $this->ruta = $args['ruta'] ?? '';
        $this->fecha_creacion = $args['fecha_creacion'] ?? '';
        $this->fecha_modificacion = $args['fecha_modificacion'] ?? date('Y-m-d H:i:s');
        $this->user_creacion = $args['user_creacion'] ?? '';
        $this->user_modificacion = $args['user_modificacion'] ?? $_SESSION["nombre_user"];
        $this->ip_user = $args['ip_user'] ?? $_SERVER['REMOTE_ADDR'];
    }
}
