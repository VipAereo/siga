<?php

namespace Model;

class Piloto extends ActiveRecord
{

    protected static $id = 'piloto_id';
    protected static $tabla = 'pilotos';
    protected static $columnasDB = ['piloto_id', 'licencia', 'tipo_licencia', 'vence_licencia', 'horas_vuelo', 'estatus', 'fecha_creacion', 'fecha_creacion', 'fecha_modificacion', 'user_creacion', 'user_modificacion', 'ip_user','empleado_id'];
    protected static $order = 'piloto_id DESC';

    public $piloto_id;
    public $licencia;
    public $tipo_licencia;
    public $vence_licencia;
    public $horas_vuelo;
    public $estatus;
    public $fecha_creacion;
    public $fecha_modificacion;
    public $user_creacion;
    public $user_modificacion;
    public $ip_user;
    public $empleado_id;

    public function __construct($args = [])
    {
        $this->piloto_id = $args['piloto_id'] ?? null;
        $this->licencia = $args['licencia'] ?? '';
        $this->tipo_licencia = $args['tipo_licencia'] ?? '';
        $this->vence_licencia = $args['vence_licencia'] ?? '';
        $this->horas_vuelo = $args['horas_vuelo'] ?? '';
        $this->estatus = $args['estatus'] ?? 'Activo';
        $this->fecha_creacion = $args['fecha_creacion'] ?? '';
        $this->fecha_modificacion = $args['fecha_modificacion'] ?? date('Y-m-d H:i:s');
        $this->user_creacion = $args['user_creacion'] ?? '';
        $this->user_modificacion = $args['user_modificacion'] ?? '';
        $this->ip_user = $args['ip_user'] ?? '';
        $this->empleado_id = $args['empleado_id'] ?? '';
    }
}