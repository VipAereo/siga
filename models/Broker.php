<?php

namespace Model;

class Broker extends ActiveRecord
{
    protected static $id = 'broker_id';
    protected static $tabla = 'brokers';
    protected static $columnasDB = [
        'broker_id', 'nombre', 'siglas_empresa', 'telefono', 'email', 'sitio_web', 'contacto_principal', 'rfc', 'razon_social', 
        'regimen_fiscal', 'giro_comercial', 'calle', 'num_ext', 'num_int', 'colonia', 'codigo_postal', 'municipio', 'ciudad', 
        'estado', 'pais','estatus', 'ischecked', 'descuento','fecha_creacion', 'fecha_modificacion', 'user_creacion', 'user_modificacion', 'ip_user', 'tarifa_id'
    ];
    protected static $order = 'broker_id DESC';

    public $broker_id;
    public $nombre;
    public $siglas_empresa;
    public $telefono;
    public $email;
    public $sitio_web;
    public $contacto_principal;
    public $rfc;
    public $razon_social;
    public $regimen_fiscal;
    public $giro_comercial;
    public $calle;
    public $num_ext;
    public $num_int;
    public $colonia;
    public $codigo_postal;
    public $municipio;
    public $ciudad;
    public $estado;
    public $pais;
    public $estatus;
    public $ischecked;
    public $descuento;
    public $fecha_creacion;
    public $fecha_modificacion;
    public $user_creacion;
    public $user_modificacion;
    public $ip_user;
    public $tarifa_id;

    public function __construct($args = [])
    {
        $this->broker_id = $args['broker_id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->siglas_empresa = $args['siglas_empresa'] ?? '';
        $this->telefono = $args['telefono'] ?? '';
        $this->email = $args['email'] ?? '';
        $this->sitio_web = $args['sitio_web'] ?? '';
        $this->contacto_principal = $args['contacto_principal'] ?? '';
        $this->rfc = $args['rfc'] ?? '';
        $this->razon_social = $args['razon_social'] ?? '';
        $this->regimen_fiscal = $args['regimen_fiscal'] ?? '';
        $this->giro_comercial = $args['giro_comercial'] ?? '';
        $this->calle = $args['calle'] ?? '';
        $this->num_ext = $args['num_ext'] ?? '';
        $this->num_int = $args['num_int'] ?? '';
        $this->colonia = $args['colonia'] ?? '';
        $this->codigo_postal = $args['codigo_postal'] ?? '';
        $this->municipio = $args['municipio'] ?? '';
        $this->ciudad = $args['ciudad'] ?? '';
        $this->estado = $args['estado'] ?? '';
        $this->pais = $args['pais'] ?? '';
        $this->estatus = $args['estatus'] ?? 'Activo';
        $this->ischecked = $args['ischecked'] ?? '0';
        $this->descuento = $args['descuento'] ?? '';
        $this->fecha_creacion = $args['fecha_creacion'] ?? '';
        $this->fecha_modificacion = $args[''] ?? date('Y-m-d H:i:s');
        $this->user_creacion = $args['user_creacion'] ?? '';
        $this->user_modificacion = $args['user_modificacion'] ?? '';
        $this->ip_user = $args['ip_user'] ?? '';
        $this->tarifa_id = $args['tarifa_id'] ?? null;
    }
}