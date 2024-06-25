<?php

namespace Model;

class Aeronave extends ActiveRecord
{

    protected static $id = 'aeronave_id';
    protected static $tabla = 'aeronaves';
    protected static $columnasDB = [
        'aeronave_id', 'numero_serie', 'matricula', 'modelo', 'ktas', 'fabricante', 'anio_fabricacion', 'asientos', 
        'ultima_revision', 'horas_vuelo', 'estado_actual', 'fecha_retiro', 'fecha_creacion', 'fecha_modificacion', 
        'user_creacion', 'user_modificacion', 'ip_user'
    ];
    protected static $order = 'aeronave_id DESC';

    public $aeronave_id;
    public $numero_serie;
    public $matricula;
    public $modelo;
    public $ktas;
    public $fabricante;
    public $anio_fabricacion;
    public $asientos;
    public $ultima_revision;
    public $horas_vuelo;
    public $estado_actual;
    public $fecha_retiro;
    public $fecha_creacion;
    public $fecha_modificacion;
    public $user_creacion;
    public $user_modificacion;
    public $ip_user;

    public function __construct($args = [])
    {
        $this->aeronave_id = $args['aeronave_id'] ?? null;
        $this->numero_serie = $args['numero_serie'] ?? '';
        $this->matricula = $args['matricula'] ?? '';
        $this->modelo = $args['modelo'] ?? '';
        $this->ktas = $args['ktas'] ?? '';
        $this->fabricante = $args['fabricante'] ?? '';
        $this->anio_fabricacion = $args['anio_fabricacion'] ?? '';
        $this->asientos = $args['asientos'] ?? '';
        $this->ultima_revision = $args['ultima_revision'] ?? '';
        $this->horas_vuelo = $args['horas_vuelo'] ?? '';
        $this->estado_actual = $args['estado_actual'] ?? '';
        $this->fecha_retiro = $args['fecha_retiro'] ?? '';
        $this->fecha_creacion = $args['fecha_creacion'] ?? '';
        $this->fecha_modificacion = $args['fecha_modificacion'] ?? date('Y-m-d H:i:s');
        $this->user_creacion = $args['user_creacion'] ?? '';
        $this->user_modificacion = $args['user_modificacion'] ?? '';
        $this->ip_user = $args['ip_user'] ?? '';
    }
}