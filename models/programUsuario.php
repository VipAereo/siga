<?php

namespace Model;

class ProgramUsuario extends ActiveRecord
{

    protected static $id = 'rpu_id';
    protected static $tabla = 'relproguser';
    protected static $columnasDB = ['rpu_id', 'programa_id', 'usuario_id', 'fecha_creacion', 'fecha_modificacion', 'user_creacion', 'user_modificacion', 'ip_user'];
    protected static $order = 'rpu_id DESC';

    public $rpu_id;
    public $programa_id;
    public $usuario_id;
    public $fecha_creacion;
    public $fecha_modificacion;
    public $user_creacion;
    public $user_modificacion;
    public $ip_user;

    public function __construct($args = [])
    {
        $this->rpr_id = $args['rpu_id'] ?? null;
        $this->programa_id = $args['programa_id'] ?? null;
        $this->usuario_id = $args['usuario_id'] ?? null;
        $this->fecha_creacion = $args['fecha_creacion'] ?? '';
        $this->fecha_modificacion = $args['fecha_modificacion'] ?? date('Y-m-d H:i:s');
        $this->user_creacion = $args['user_creacion'] ?? '';
        $this->user_modificacion = $args['user_modificacion'] ?? '';
        $this->ip_user = $args['ip_user'] ?? '';
    }
}