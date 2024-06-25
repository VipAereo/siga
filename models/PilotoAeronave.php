<?php

namespace Model;

class PilotoAeronave extends ActiveRecord
{

    protected static $id = 'piloto_aero_id';
    protected static $tabla = 'relpilotoaeronave';
    protected static $columnasDB = ['piloto_aero_id','piloto_id','aeronave_id'];
    protected static $order = 'piloto_aero_id DESC';

    public $piloto_aero_id;
    public $piloto_id;
    public $aeronave_id;

    public function __construct($args = [])
    {
        $this->piloto_aero_id = $args['piloto_aero_id'] ?? null;
        $this->piloto_id = $args['piloto_id'] ?? '';
        $this->aeronave_id = $args['aeronave_id'] ?? '';
    }

}