<?php

namespace Model;

class Categoria extends ActiveRecord
{

    protected static $id = 'categoria_id';
    protected static $tabla = 'categorias';
    protected static $columnasDB = [
        'categoria_id', 'nombre', 'prioridad'
    ];
    protected static $order = 'prioridad ASC';


    public $categoria_id;
    public $nombre;
    public $prioridad;

    public function __construct($args = [])
    {
        $this->categoria_id = $args['categoria_id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->prioridad = $args['prioridad'] ?? '';
    }
}
