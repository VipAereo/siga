<?php

namespace Controllers;

require __DIR__ . '/../vendor/autoload.php';

use Model\Categoria;

class CategoriaController
{
    public static function categorias()
    {
        $tipo = Categoria::allForeing("*", [], "DESC");

        $tipo = isset($tipo) ? (is_array($tipo) ? $tipo : array($tipo)) : '';

        echo json_encode($tipo);
    }
}
