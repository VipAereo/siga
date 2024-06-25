<?php

namespace Model;

class TipoCambio extends ActiveRecord
{

    protected static $id = 'tipo_cambio_id';
    protected static $tabla = 'tiposcambio';
    protected static $columnasDB = [
        'tipo_cambio_id', 'fecha_vigencia', 'tipo_cambio', 'moneda_origen',
        'moneda_destino', 'fecha_creacion'
    ];
    protected static $order = 'tipo_cambio_id DESC';

    public $tipo_cambio_id;
    public $fecha_vigencia;
    public $tipo_cambio;
    public $moneda_origen;
    public $moneda_destino;
    public $fecha_creacion;

    public function __construct($args = [])
    {

        $this->tipo_cambio_id = $args['tipo_cambio_id'] ?? null;
        $this->fecha_vigencia = $args['fecha_vigencia'] ?? '';
        $this->tipo_cambio = $args['tipo_cambio'] ?? '';
        $this->moneda_origen = $args['moneda_origen'] ?? '';
        $this->moneda_destino = $args['moneda_destino'] ?? '';
        $this->fecha_creacion = $args['fecha_creacion'] ?? '';
    }
}
