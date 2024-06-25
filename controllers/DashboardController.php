<?php

namespace Controllers;

use Model\MegaMenu;

class DashboardController
{

    public static function obtenerMenu()
    {

        // proteger vista 
        if (!isAuth()) {
            header('Location: /login');
        }

        $userId = $_SESSION['id'];
        $usuarios = MegaMenu::traerMenu($userId);
        echo json_encode($usuarios);
    }

    public static function ruta()
    {
        if (!isAuth()) {
            header('Location: /login');
        }
        echo json_encode($_ENV['HOST']);
    }
}
