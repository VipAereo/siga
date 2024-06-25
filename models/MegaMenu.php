<?php

namespace Model;

class MegaMenu extends ActiveRecord
{

    // solo se puede acceder en la clase
    protected static $tabla = 'Programas'; // Nombre de la tabla en la base de datos
    protected static $columnasDB = ['programa_id', 'nombre', 'padre', 'nivel', 'ruta']; // Columnas de la tabla en la base de datos

    public $programa_id;
    public $nombre;
    public $padre;
    public $nivel;
    public $ruta;

    public function __construct($args = [])
    {
        $this->programa_id = $args['programa_id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->padre = $args['padre'] ?? null;
        $this->nivel = $args['nivel'] ?? 0;
        $this->ruta = $args['ruta'] ?? '';
    }
}
