<?php

require __DIR__ . '/../includes/app.php';

function insertar_tipo_de_cambio()
{
   

    try {
        $db = conectarDB();

        // URL de la API
        $url = 'https://www.banxico.org.mx/SieAPIRest/service/v1/series/SF43718/datos/oportuno?token=e0014e3e6ac9675a0decbde3c4c11bed323d3bbf3326d3e211901d20df6f0348';



        // Realizar solicitud a la API
        $response = @file_get_contents($url);

        if ($response === false) {
            echo "Error al realizar la solicitud a la API.";
            return;
        }

        // Decodificar la respuesta JSON
        $data = json_decode($response, true);

        if (!isset($data['bmx']['series'][0]['datos'][0])) {
            echo "Error al procesar la respuesta de la API.";
            return;
        }

        $cambioMX = $data['bmx']['series'][0]['datos'][0]['dato'];
        $fechaCambio = $data['bmx']['series'][0]['datos'][0]['fecha'];

        $fecha_parseada = DateTime::createFromFormat('d/m/Y', $fechaCambio);

        if (!$fecha_parseada) {
            echo "Error al parsear la fecha.";
            return;
        }

        $nueva_fechaCambio = $fecha_parseada->format('Y-m-d');

        if (!is_numeric($cambioMX)) {
            echo "El tipo de cambio no es válido.";
            return;
        }

        $fechaActual = date('Y-m-d');
        $sql = "INSERT INTO tiposcambio (fecha_vigencia, tipo_cambio, moneda_origen, moneda_destino, fecha_creacion) 
                    VALUES (:fechaCambio, :cambioMX, 'USD', 'MXN', :fechaActual)";

        // Preparar la consulta
        $stmt = $db->prepare($sql);

        // Asignar valores a los parámetros
        $stmt->bindParam(':fechaCambio', $nueva_fechaCambio);
        $stmt->bindParam(':cambioMX', $cambioMX);
        $stmt->bindParam(':fechaActual', $fechaActual);

        // Ejecutar la consulta
        $stmt->execute();

        echo "Tipo de cambio insertado correctamente.";
    } catch (PDOException $e) {
        echo "Error al insertar el tipo de cambio: " . $e->getMessage();
    }
    
}

insertar_tipo_de_cambio();
