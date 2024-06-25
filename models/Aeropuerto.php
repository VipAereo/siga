<?php

namespace Model;

class Aeropuerto extends ActiveRecord
{

    protected static $id = 'aeropuerto_id';
    protected static $tabla = 'aeropuertos';
    protected static $columnasDB = ['aeropuerto_id', 'nombre', 'codigo_iata', 'codigo_icao', 'costo_tua', 'pais', 'estado', 'municipio','concesionario','permisionario', 'longitud', 'latitud', 'altitud', 'estatus','fecha_creacion', 'fecha_modificacion', 'user_creacion', 'user_modificacion', 'ip_user'];
    protected static $order = 'aeropuerto_id DESC';

    public $aeropuerto_id;
    public $nombre;
    public $codigo_iata;
    public $codigo_icao;
    public $costo_tua;
    public $pais;
    public $estado;
    public $municipio;
    public $concesionario;
    public $permisionario;
    public $longitud;
    public $latitud;
    public $altitud;
    public $estatus;
    public $fecha_creacion;
    public $fecha_modificacion;
    public $user_creacion;
    public $user_modificacion;
    public $ip_user;

    public function __construct($args = [])
    {
        $this->aeropuerto_id = $args['aeropuerto_id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->codigo_iata = $args['codigo_iata'] ?? '';
        $this->codigo_icao = $args['codigo_icao'] ?? '';
        $this->costo_tua = $args['costo_tua'] ?? '';
        $this->pais = $args['pais'] ?? '';
        $this->estado = $args['estado'] ?? '';
        $this->municipio = $args['municipio'] ?? '';
        $this->concesionario = $args['concesionario'] ?? '';
        $this->permisionario = $args['permisionario'] ?? '';
        $this->longitud = $args['longitud'] ?? '';
        $this->latitud = $args['latitud'] ?? '';
        $this->altitud = $args['altitud'] ?? '';
        $this->estatus = $args['estatus'] ?? 'Activo';
        $this->fecha_creacion = $args['fecha_creacion'] ?? '';
        $this->fecha_modificacion = $args['fecha_modificacion'] ?? date('Y-m-d H:i:s');
        $this->user_creacion = $args['user_creacion'] ?? '';
        $this->user_modificacion = $args['user_modificacion'] ?? '';
        $this->ip_user = $args['ip_user'] ?? '';
    }
}
