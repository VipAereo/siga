<?php

namespace Model;

class Empleado extends ActiveRecord
{
    protected static $id = 'empleado_id';
    protected static $tabla = 'empleados';
    protected static $columnasDB = [
        'empleado_id', 'nombre', 'apellido_paterno', 'apellido_materno', 'departamento_id',
        'estado_laboral', 'num_identificacion', 'email', 'tel_principal', 'tel_secundario', 'fecha_nacimiento', 'sexo',
        'curp', 'rfc', 'estado', 'municipio', 'colonia', 'calle', 'num_exterior', 'num_interior', 'codigo_postal', 'nivel_academico',
        'fecha_creacion', 'fecha_modificacion', 'user_creacion', 'user_modificacion', 'ip_user', 'supervisor_id'
    ];
    protected static $order = 'empleado_id DESC';

    public $empleado_id;
    public $nombre;
    public $apellido_paterno;
    public $apellido_materno;
    public $departamento_id;
    public $estado_laboral;
    public $num_identificacion;
    public $email;
    public $tel_principal;
    public $tel_secundario;
    public $fecha_nacimiento;
    public $sexo;
    public $curp;
    public $rfc;
    public $estado;
    public $municipio;
    public $colonia;
    public $calle;
    public $num_exterior;
    public $num_interior;
    public $codigo_postal;
    public $nivel_academico;
    public $fecha_creacion;
    public $fecha_modificacion;
    public $user_creacion;
    public $user_modificacion;
    public $ip_user;
    public $supervisor_id;

    public function __construct($args = [])
    {
        $this->empleado_id = $args['empleado_id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->apellido_paterno = $args['apellido_paterno'] ?? '';
        $this->apellido_materno = $args['apellido_materno'] ?? '';
        $this->departamento_id = $args['departamento_id'] ?? '';
        $this->estado_laboral = $args['estado_laboral'] ?? '';
        $this->num_identificacion = $args['num_identificacion'] ?? '';
        $this->email = $args['email'] ?? '';
        $this->tel_principal = $args['tel_principal'] ?? '';
        $this->tel_secundario = $args['tel_secundario'] ?? '';
        $this->fecha_nacimiento = $args['fecha_nacimiento'] ?? '';
        $this->sexo = $args['sexo'] ?? '';
        $this->curp = $args['curp'] ?? '';
        $this->rfc = $args['rfc'] ?? '';
        $this->estado = $args['estado'] ?? '';
        $this->municipio = $args['municipio'] ?? '';
        $this->colonia = $args['colonia'] ?? '';
        $this->calle = $args['calle'] ?? '';
        $this->num_exterior = $args['num_exterior'] ?? '';
        $this->num_interior = $args['num_interior'] ?? '';
        $this->codigo_postal = $args['codigo_postal'] ?? '';
        $this->nivel_academico = $args['nivel_academico'] ?? '';
        $this->fecha_creacion = $args['fecha_creacion'] ?? '';
        $this->fecha_modificacion = $args['fecha_modificacion'] ?? date('Y-m-d H:i:s');
        $this->user_creacion = $args['user_creacion'] ?? '';
        $this->user_modificacion = $args['user_modificacion'] ?? '';
        $this->ip_user = $args['ip_user'] ?? '';
        $this->supervisor_id = $args['supervisor_id'] ?? null;
        
    }

}
