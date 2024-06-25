<?php

use Dotenv\Dotenv;
use Model\ActiveRecord;
use Model\MegaMenu;

require __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->safeLoad();

require 'funciones.php';
require 'database.php';


$db = conectarDB();

ActiveRecord::setDB($db);
MegaMenu::setDB($db);

