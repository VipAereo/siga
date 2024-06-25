<?php

// Será la clase Principal y sobre esta heredaran las demas clases
// carga automaticamente clases
namespace Model;

use DateTime;
use PDO;
use PDOException;

class ActiveRecord
{
    // Base DE DATOS
    // protected  ya que solo la requerimos dentro de esta clase 
    protected static $db;
    protected static $tabla = '';
    protected static $columnasDB = [];

    // Alertas y Mensajes
    protected static $alertas = [];

    // Definir la conexión a la BD
    public static function setDB($database)
    {
        // protected = propiedad::$db -> self:: hacere referencia a los atributos estaticos de una misma clase 
        // public = $this-> db  (sin signo de dolar)
        self::$db = $database;
    }

    // Setear un tipo de Alerta
    public static function setAlerta($tipo, $mensaje)
    {
        static::$alertas[$tipo][] = $mensaje;
    }

    public static function getAlertas()
    {
        return static::$alertas;
    }

    // Obtener todos los Registros
    public static function all()
    {
        $query = "SELECT * FROM " . static::$tabla . " ORDER BY " . static::$order . " ";
        $resultado = self::consultarSQL($query);
        return $resultado;
    }

    // esta funcion acepta multiples LEFT JOIN 
    public static function allForeing($select = '*', $join = [])
    {


        // Construir la consulta SQL
        $query = "SELECT " . $select . " FROM " . static::$tabla . " u ";

        // Agregar joins si se proporcionan
        foreach ($join as $table => $condition) {
            $query .= " LEFT JOIN $table ON $condition";
        }

        $query .= " ORDER BY u." . static::$order . " ";

        // Ejecutar la consulta y obtener los resultados
        $resultado = self::consultarSQL($query);

        // Retornar los resultados
        return $resultado;
    }
    // verificar, estas 2 son la misma cosa
    // esta funcion acepta LEFT JOIN con WHERE
    public static function allWithWhere($select = '*', $join = [], $where = [])
    {
        // Construir la consulta SQL
        $query = "SELECT " . $select . " FROM " . static::$tabla . " u ";

        // Agregar joins si se proporcionan
        foreach ($join as $table => $condition) {
            $query .= " LEFT JOIN $table ON $condition";
        }

        // Agregar condiciones WHERE si se proporcionan
        if (!empty($where)) {
            $query .= " WHERE " . implode(" AND ", $where);
        }

        $query .= " ORDER BY u." . static::$order . " ";

        // debuguear($query);

        // Ejecutar la consulta y obtener los resultados
        $resultado = self::consultarSQL($query);

        // Retornar los resultados
        return $resultado;
    }

    // esta funcion acepta LEFT JOIN con WHERE y JOIN ESPECIALES
    public static function allJoinPerzo($select = '*', $join = [], $where = [], $perzo)
    {
        // Construir la consulta SQL
        $query = "SELECT " . $select . " FROM " . static::$tabla . " u ";

        // Agregar joins si se proporcionan
        foreach ($join as $table => $condition) {
            $query .= " LEFT JOIN $table ON $condition";
        }

        foreach ($perzo as $busq => $condition) {
            $query .=  " " . $condition;
        }


        // Agregar condiciones WHERE si se proporcionan
        if (!empty($where)) {

            foreach ($where as $wh => $condition) {
                $query .=  " WHERE " . implode(" AND ", $condition);
            }
        }

        $query .= " ORDER BY u." . static::$order . " ";

        // debuguear($query);
        // Ejecutar la consulta y obtener los resultados
        $resultado = self::consultarSQL($query);

        // Retornar los resultados
        return $resultado;
    }

    // guardar 1 modelo con 1 clase 
    public function guardar()
    {
        // cap 365
        $resultado = '';

        // validar si el id del modelo tiene valor
        foreach ($this as $key => $value) {
            if ($key == static::$id) {
                $nuevoId = $value;
            }
        }

        if (!empty($nuevoId)) {
            // if (!is_null($nuevoId) || !isset($nuevoId)) {
            // Actualizar
            // var_dump('Act');
            $resultado = $this->actualizar();
        } else {
            // Creando un nuevo registro
            // var_dump('Ins');
            $resultado = $this->crear();
        }

        return $resultado;
    }

    // guardar 1 modelo con 2 clases
    public function guardarDetalle2($detalle)
    {
        $resultado = '';

        // validar si el id del modelo tiene valor
        foreach ($this as $key => $value) {
            if ($key == static::$id) {
                $nuevoId = $value;
            }
        }

        // if (!is_null($nuevoId) || !$nuevoId) {
        if ($nuevoId) {
            // Actualizar
            $resultado = $this->actualizarDetalle($detalle);
        } else {
            // Creando un nuevo registro
            $resultado = $this->crearDetalle($detalle);
        }

        return $resultado;
    }
    public function guardarDetalle($detalles)
    {
        $detallesActualizar = [];
        $detallesCrear = [];

        foreach ($detalles as $detalle) {

            $id = static::$id;
            // Obtener el ID del detalle
            $detalleId = isset($detalle->$id) ? $detalle->$id : '';

            // Verificar si el ID del detalle es válido
            if ($detalleId !== null && $detalleId !== '') {
                // Detalle a actualizar
                $detallesActualizar[] = $detalle;
            } else {
                // Detalle a crear
                $detallesCrear[] = $detalle;
            }
        }

        // Actualizar detalles existentes
        $resultadosActualizar = $this->actualizarDetalle($detallesActualizar);

        // Crear nuevos detalles
        if (!empty($detallesCrear)) {
            $resultadosCrear = $this->crearDetalle($detallesCrear);
            $resultados = array_merge($resultadosActualizar, $resultadosCrear);
        } else {
            $resultados = $resultadosActualizar;
        }
        // Combinar resultados
        return $resultados;
    }

    // Identificar y unir los atributos de la BD
    public function atributos()
    {
        $atributos = [];
        foreach (static::$columnasDB as $columna) {
            // if ($columna === static::$id) continue; // para omitir el ID
            $atributos[$columna] = $this->$columna;
        }
        return $atributos;
    }

    // crea un nuevo registro
    public function crear()
    {

        try {
            // Iniciar la transacción
            self::$db->beginTransaction();

            // Identificar y unir los atributos de la BD
            $atributos = $this->atributos();

            $query = "INSERT INTO " . static::$tabla . " (";
            $values = [];

            foreach ($atributos as $columna => $valor) {
                $query .= $columna . ", ";
                // Escapar el valor usando PDO para prevenir inyección SQL
                // Convertir NULL en la cadena 'NULL'
                // $values[] = ($valor == null) ? 'NULL' : self::$db->quote($valor);
                // Si $valor es null, agregar 'NULL' al array $values
                $values[] = ($valor == null) ? 'NULL' : str_replace('`', '`', self::$db->quote(s($valor)));
            }

            $query = rtrim($query, ", "); // Eliminar la última coma
            $query .= ") VALUES (" . implode(", ", $values) . ")";
            // debuguear($query); // Descomentar si no te funciona algo
            // $resultado = self::$db->query($query);

            // Ejecutar la consulta
            $resultado = self::$db->exec($query);

            $ultimoIdInsertado = self::$db->lastInsertId();

            // Confirmar la transacción
            self::$db->commit();

            return [
                'resultado' =>  $resultado,
                'id' => $ultimoIdInsertado
            ];
        } catch (PDOException $e) {
            // Revertir la transacción en caso de error
            self::$db->rollBack();

            // Manejar el error adecuadamente, ya sea registrándolo, lanzando una excepción o devolviéndolo
            return [
                'error' => $e->getMessage()
            ];
        }
    }

    public function crearDetalle($detalle)
    {

        try {
            // Iniciar la transacción
            self::$db->beginTransaction();

            foreach ($detalle as $key => $detail) {

                // Identificar y unir los atributos de la BD
                $atributos = $detail->atributos();
                $resultado = self::crearObjeto($detail);

                $query = "INSERT INTO " . static::$tabla . " (";
                $values = [];

                foreach ($atributos as $columna => $valor) {
                    $query .= $columna . ", ";
                    $values[] = ($valor == null) ? 'NULL' : str_replace('`', '`', self::$db->quote($valor));
                }

                $query = rtrim($query, ", "); // Eliminar la última coma
                $query .= ") VALUES (" . implode(", ", $values) . ")";

                // Ejecutar la consulta
                $resultado = self::$db->exec($query);
            }

            // Confirmar la transacción
            self::$db->commit();

            return [
                'resultado' =>  $resultado
            ];
        } catch (PDOException $e) {
            // Revertir la transacción en caso de error
            self::$db->rollBack();

            // Manejar el error adecuadamente, ya sea registrándolo, lanzando una excepción o devolviéndolo
            return [
                'error' => $e->getMessage()
            ];
        }
    }

    // Actualizar el registro
    public function actualizar()
    {

        try {
            // Iniciar la transacción
            self::$db->beginTransaction();

            // guardar el  id del registro a actualizar
            $idReg = $this->{static::$id};

            $resultado = self::crearObjeto($this);

            // Recupera datos de la BD
            $datosBD = self::where(static::$id, $this->{static::$id});

            // Obtener los atributos de cada objeto
            $atributos_objeto1 = $resultado->atributos();
            $atributos_objeto2 = $datosBD->atributos();

            // Encontrar las diferencias entre los atributos de los dos objetos
            $valoresActualizados = array_diff_assoc($atributos_objeto1, $atributos_objeto2);


            // var_dump($atributos_objeto1);
            // var_dump('///////////////');
            // var_dump($atributos_objeto2);
            // debuguear($valoresActualizados);

            // Acomodar los valores para actualizar
            $valores = [];
            foreach ($valoresActualizados as $key => $value) {
                $value = ($value == '') ? 'NULL' : s($value);

                if ($key == static::$id) {
                    $nuevoId = $value;
                }

                $valores[] = "{$key}=" . ($value == 'NULL' ? $value : "'{$value}'");
            }

            $query = "UPDATE " . static::$tabla . " SET ";
            $query .= join(', ', $valores);
            $query .= " WHERE " . static::$id . " = " . $idReg . " ";

            // debuguear($query);
            // Ejecutar la consulta
            $resultado = self::$db->exec($query);


            // Confirmar la transacción
            self::$db->commit();

            return [
                'resultado' =>  $resultado,
            ];
        } catch (PDOException $e) {
            // Revertir la transacción en caso de error
            self::$db->rollBack();

            // Manejar el error adecuadamente, ya sea registrándolo, lanzando una excepción o devolviéndolo
            return [
                'error' => $e->getMessage()
            ];
        }
    }

    public function actualizarDetalle($detalle)
    {
        try {
            // Iniciar la transacción
            self::$db->beginTransaction();

            foreach ($detalle as $key => $detail) {
                // guardar el  id del registro a actualizar
                $idReg = $detail->{static::$id};

                $resultado = self::crearObjeto($detail);

                // Recupera datos de la BD
                $datosBD = self::where(static::$id, $detail->{static::$id});

                // Obtener los atributos de cada objeto
                $atributos_objeto1 = $resultado->atributos();
                $atributos_objeto2 = $datosBD->atributos();

                // Encontrar las diferencias entre los atributos de los dos objetos
                $valoresActualizados = array_diff_assoc($atributos_objeto1, $atributos_objeto2);

                // Acomodar los valores para actualizar
                $valores = [];

                foreach ($valoresActualizados as $key => $value) {
                    $value = ($value == '') ? 'NULL' : $value;

                    if ($key == static::$id) {
                        $nuevoId = $value;
                    }

                    $valores[] = "{$key}=" . ($value == 'NULL' ? $value : "'{$value}'");
                }

                $query = "UPDATE " . static::$tabla . " SET ";
                $query .= join(', ', $valores);
                $query .= " WHERE " . static::$id . " = " . $idReg . " ";

                // Ejecutar la consulta
                $resultado = self::$db->exec($query);
            }

            // Confirmar la transacción
            self::$db->commit();

            return [
                'resultado' =>  $resultado
            ];
        } catch (PDOException $e) {
            // Revertir la transacción en caso de error
            self::$db->rollBack();

            // Manejar el error adecuadamente, ya sea registrándolo, lanzando una excepción o devolviéndolo
            return [
                'error' => $e->getMessage()
            ];
        }
    }

    // Busqueda Where en varias Columnas 
    public static function where($columna, $valor, $condiciones = [])
    {

        $query = "SELECT * FROM " . static::$tabla . " WHERE {$columna} = '{$valor}'";

        // Agregar condiciones adicionales si se proporcionan
        if (!empty($condiciones)) {
            $query .= " AND " . implode(" AND ", $condiciones);
        }

        $query .= " ORDER BY " . static::$order . " ";

        // debuguear($query);

        $resultado = self::consultarSQL($query);

        if (count($resultado) < 2) {
            // reduce la longitud del array en 1
            $resultado = array_shift($resultado);

            return $resultado;
        } else {
            return $resultado;
        }
    }

    // Consulta SQL para crear un objeto en Memoria (Active Record)
    public static function consultarSQL($query)
    {

        // Consultar la base de datos
        $resultado = self::$db->prepare($query);

        if ($resultado) {
            // Ejecutar la conexion
            $resultado->execute();

            $array = [];
            $registro = $resultado->fetchAll(PDO::FETCH_ASSOC);

            // Iterar los resultados
            foreach ($registro as $key => $value) {
                // $array[] = $registro[$key]['nombre'];
                $array[] = self::crearObjeto($registro[$key]);
            }

            // Libera automaticamente pero es mejor ayudar a liberar
            $resultado->closeCursor();

            // retornar los resultados
            return $array;
        }
    }

    public static function crearObjeto($registro)
    {
        // $primerElemento = array_shift($registro);
        // Crea el objeto en memoria que es igual al de la BD
        $objeto = new static;

        foreach ($registro as $key => $value) {
            // Verifica si la propiedad existe en la clase
            // if (property_exists($objeto, $key)) {
            $objeto->$key = $value;
            // } 
        }

        return $objeto;
    }

    // Sincroniza BD con Objetos en memoria
    public function sincronizar($args = [])
    {
        foreach ($args as $key => $value) {

            if (property_exists($this, $key) && !is_null($value)) {
                // if (property_exists($this, $key) && $value != '') {
                $this->$key = $value;
            }
        }
    }

    // Eliminar un Registro por su ID
    public function eliminar()
    {
        foreach ($this as $key => $value) {
            if ($key == static::$id) {
                $nuevoId = $value;
            }
        }

        $query = "DELETE FROM "  . static::$tabla . " WHERE " . static::$id . " = " . self::$db->quote($nuevoId) . " LIMIT 1";


        $resultado = self::$db->query($query);

        return [
            'resultado' =>  $resultado,
        ];
    }

    // Eliminar un Registro por columnas
    public function eliminarRel()
    {

        // Construir la condición WHERE utilizando las columnas relevantes
        $where = [];
        foreach (static::$columnasDB as $columna) {
            $where[] = $columna . " = " . self::$db->quote($this->{$columna});
        }
        $where_clause = implode(" AND ", $where);

        // Construir la consulta de eliminación
        $query = "DELETE FROM " . static::$tabla . " WHERE " . $where_clause . " LIMIT 1";


        // Ejecutar la consulta
        $resultado = self::$db->query($query);

        // Devolver el resultado
        return [
            'resultado' =>  $resultado,
        ];
    }

    public static function hasPermission($url_actual)
    {
        // session_start();

        if (!isAuth()) {
            return false; // El usuario no está autenticado
        }

        $usuario_id = $_SESSION['id'];

        if ($usuario_id) {
            $query = "
                    SELECT u.usuario_id, u.nombre_user, prog.nombre, prog.ruta, pu.rpu_id, pr.rpr_id
                    FROM usuarios AS u
                        LEFT JOIN programas AS prog ON prog.programa_id = prog.programa_id
                        LEFT JOIN relproguser AS pu ON u.usuario_id = pu.usuario_id
                        LEFT JOIN relprogrol AS pr ON u.rol_id = pr.rol_id
                        WHERE (pr.rol_id = u.rol_id OR pu.usuario_id = $usuario_id)
                    AND (prog.ruta = '$url_actual')
                ";
            $resultado = static::$db->prepare($query);
            $resultado->execute();
            $registro = $resultado->fetchAll(PDO::FETCH_ASSOC);
            // $registro = self::crearObjeto($registro);

            return empty($registro);
        } else {
            return false;
        }
    }

    // Obtener el ultimo  registro insertado o actualizado
    public static function ultimoRegistro($busqueda)
    {
        $query = "SELECT * FROM " . static::$tabla . " ORDER BY {$busqueda} DESC LIMIT 1";
        $resultado = self::consultarSQL($query);
        if (count($resultado) > 0) {
            $resultado = array_shift($resultado);
        }
        return $resultado;
    }

    public static function  traerMenu($userId)
    {
        $query = "
            WITH RECURSIVE ProgramasUsuarioCte AS (
                SELECT 
                1 AS id,  -- Aquí especifica el ID del usuario
                rpu.programa_id AS MenuId,
                p.nombre AS nombre,
                p.padre AS PadreId,
                p.nivel AS Nivel,
                p.ruta AS Ruta
                FROM 
                relproguser AS rpu
                INNER JOIN 
                " . static::$tabla . " AS p ON rpu.programa_id = p.programa_id
                WHERE 
                rpu.usuario_id = " . $userId . "
                UNION ALL
                SELECT 
                1 AS id,  -- Aquí especifica el ID del usuario
                p.programa_id AS MenuId,
                p.nombre AS nombre,
                p.padre AS PadreId,
                p.nivel AS Nivel,
                p.ruta AS Ruta
                FROM 
                " . static::$tabla . " AS p
                INNER JOIN 
                ProgramasUsuarioCte AS pu ON p.programa_id = pu.PadreId
            ),
            ProgramasRolesUsuarioCte AS (
                SELECT 
                (SELECT rol_id FROM Usuarios WHERE usuario_id = " . $userId . ") AS id,  -- Aquí especifica el ID del usuario
                rpr.programa_id AS MenuId,
                p.nombre AS nombre,
                p.padre AS PadreId,
                p.nivel AS Nivel,
                p.ruta AS Ruta
                FROM 
                RelProgRol AS rpr
                INNER JOIN 
                " . static::$tabla . " AS p ON rpr.programa_id = p.programa_id
                WHERE 
                rpr.rol_id = (SELECT rol_id FROM Usuarios WHERE usuario_id = " . $userId . ")
                UNION ALL
                SELECT 
                (SELECT rol_id FROM Usuarios WHERE usuario_id = " . $userId . ") AS id,  -- Aquí especifica el ID del usuario
                p.programa_id AS MenuId,
                p.nombre AS nombre,
                p.padre AS PadreId,
                p.nivel AS Nivel,
                p.ruta AS Ruta
                FROM 
                " . static::$tabla . " AS p
                INNER JOIN 
                ProgramasRolesUsuarioCte AS pruc ON p.programa_id = pruc.PadreId
            )
            SELECT 
                MenuId,
                MAX(nombre) AS Nombre,
                MAX(PadreId) AS PadreId,
                MAX(Nivel) AS Nivel,
                MAX(Ruta) AS Ruta
            FROM 
                (
                SELECT * FROM ProgramasUsuarioCte
                UNION ALL
                SELECT * FROM ProgramasRolesUsuarioCte
                ) AS programas_union
            GROUP BY
                MenuId 
                ORDER BY
             MenuId ASC; 
        ";
        $resultado = static::$db->prepare($query);

        if ($resultado->execute()) {
            $registro = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $registro;
        } else {
            return null;
        }
    }

    public static function buscarRegistros($ids)
    {
        // Convertir $ids en un array si es un solo ID
        if (!is_array($ids)) {
            $ids = array($ids);
        }

        // Escapar y formatear los IDs para usar en la consulta SQL
        $idList = implode(',', array_map('intval', $ids));

        // Construir la consulta SQL con WHERE IN
        $query = "SELECT * FROM " . static::$tabla . " WHERE aeropuerto_id IN ({$idList})";

        // Ejecutar la consulta y obtener los resultados
        $resultados = self::consultarSQL($query);

        if (count($resultados) > 0) {
            return $resultados;
        }
    }
}
