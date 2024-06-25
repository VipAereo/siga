<?php

function conectarDB(): PDO
{
    $host  = $_ENV['DB_HOST'] ?? '';
    $dbname  = $_ENV['DB_NAME'] ?? '';
    $username = $_ENV['DB_USER'] ?? '';
    $password = $_ENV['DB_PASS'] ?? '';

    try {
        // se usa el conjunto de caracteres especiales charset 
        $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";

        // configuracion de manejos de errores
        // se han deshabilitado las preparaciones emuladas (PDO::ATTR_EMULATE_PREPARES) para aprovechar las preparaciones reales de PDO.
        $opciones = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        $pdo = new PDO($dsn, $username, $password, $opciones);

        // echo "Éxito al conectar la BD.";
        return $pdo;
    } catch (PDOException $e) {
        echo "Error al conectar a la base de datos: " . $e->getMessage();
        exit;
    }
}

// Uso de la función conectarDB
try {
    $pdo = conectarDB();
    // echo "éxito";
    //debuguear('exito');
    // Puedes realizar consultas u operaciones con $pdo aquí
} catch (PDOException $e) {
    // Manejo de errores de conexión
    echo "Error al conectar a la base de datos: " . $e->getMessage();
}

// function conectarDB() : mysqli {
//         $db = new mysqli('localhost', 'root', 'SysVipAereo$23', 'vipaereo');

//         if(!$db) {
//             echo "Error no se pudo conectar";
//             exit;
//         } 
//         // else {
//         //     echo "se pudo";
//         // }

//         return $db;
    
// }

// $db = mysqli_connect(
//     $_ENV['DB_HOST'] ?? '',
//     $_ENV['DB_USER'] ?? '', 
//     $_ENV['DB_PASS'] ?? '', 
//     $_ENV['DB_NAME'] ?? ''
// );

// if (!$db) {
//     echo "Error: No se pudo conectar a MySQL.";
//     echo "errno de depuración: " . mysqli_connect_errno();
//     echo "error de depuración: " . mysqli_connect_error();
//     exit;
// }
