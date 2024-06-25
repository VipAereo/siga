<?php

namespace Model;

class Producto extends ActiveRecord
{

    protected static $id = 'producto_id';
    protected static $tabla = 'productos';
    protected static $columnasDB = [
        'producto_id', 'nombre', 'descripcion','precio','categoria_id',
        'fecha_creacion', 'fecha_modificacion', 'user_creacion', 'user_modificacion',
        'ip_user'
    ];
    protected static $order = 'producto_id ASC';

    public function __construct($args = [])
    {
        $this->producto_id = $args['producto_id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->descripcion = $args['descripcion'] ?? '';
        $this->precio = $args['precio'] ?? '';
        $this->categoria_id = $args['categoria_id'] ?? '';
        $this->fecha_creacion = $args['fecha_creacion'] ?? '';
        $this->fecha_modificacion = $args['fecha_modificacion'] ?? date('Y-m-d H:i:s');
        $this->user_creacion = $args['user_creacion'] ?? '';
        $this->user_modificacion = $args['user_modificacion'] ?? '';
        $this->ip_user = $args['ip_user'] ?? '';
    }
}
