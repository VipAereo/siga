<?php

namespace Model;

class ProgramRole extends ActiveRecord
{
    protected static $id = 'rpr_id';
    protected static $tabla = 'relprogrol';
    protected static $columnasDB = ['rpr_id', 'programa_id', 'rol_id', 'fecha_creacion', 'fecha_modificacion', 'user_creacion', 'user_modificacion', 'ip_user'];
    protected static $order = 'rpr_id DESC';

    public $rpr_id;
    public $programa_id;
    public $rol_id;
    public $fecha_creacion;
    public $fecha_modificacion;
    public $user_creacion;
    public $user_modificacion;
    public $ip_user;

    public function __construct($args = [])
    {
        $this->rpr_id = $args['rpr_id'] ?? null;
        $this->programa_id = $args['programa_id'] ?? null;
        $this->rol_id = $args['rol_id'] ?? null;
        $this->fecha_creacion = $args['fecha_creacion'] ?? '';
        $this->fecha_modificacion = $args['fecha_modificacion'] ?? date('Y-m-d H:i:s');
        $this->user_creacion = $args['user_creacion'] ?? '';
        $this->user_modificacion = $args['user_modificacion'] ?? '';
        $this->ip_user = $args['ip_user'] ?? '';
    }
}