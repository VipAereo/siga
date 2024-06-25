<?php

namespace Model;

class Pasajero extends ActiveRecord
{
    protected static $id = 'pasajero_id';
    protected static $tabla = 'pasajeros';
    protected static $columnasDB = [
        'pasajero_id', 'nombre', 'fecha_nacimiento', 'sexo', 'nacionalidad', 'email', 'telefono', 'asiento_asignado',
        'numero_pasaporte', 'expira_doc', 'fecha_creacion', 'fecha_modificacion', 'user_creacion', 'user_modificacion',
        'ip_user'
    ];
    protected static $order = 'pasajero_id';

    public $pasajero_id;
    public $nombre;
    public $fecha_nacimiento;
    public $sexo;
    public $nacionalidad;
    public $email;
    public $telefono;
    public $asiento_asignado;
    public $numero_pasaporte;
    public $expira_doc;
    public $fecha_creacion;
    public $fecha_modificacion;
    public $user_creacion;
    public $user_modificacion;
    public $ip_user;

    public function __construct($args = [])
    {
        $this->pasajero_id = $args['pasajero_id'] ?? null;
        $this->nombre = $args['nombre'] ?? '';
        $this->fecha_nacimiento = $args['fecha_nacimiento'] ?? '';
        $this->sexo = $args['sexo'] ?? '';
        $this->nacionalidad = $args['nacionalidad'] ?? '';
        $this->email = $args['email'] ?? '';
        $this->telefono = $args['telefono'] ?? '';
        $this->asiento_asignado = $args['asiento_asignado'] ?? '';
        $this->numero_pasaporte = $args['numero_pasaporte'] ?? '';
        $this->expira_doc = $args['expira_doc'] ?? '';
        $this->fecha_creacion = $args['fecha_creacion'] ?? '';
        $this->fecha_modificacion = $args['fecha_modificacion'] ?? date('Y-m-d H:i:s');
        $this->user_creacion = $args['user_creacion'] ?? '';
        $this->user_modificacion = $args['user_modificacion'] ?? '';
        $this->ip_user = $args['ip_user'] ?? '';
    }
}

class Documento extends ActiveRecord
{
    protected static $id = 'documento_id';
    protected static $tabla = 'documentos';
    protected static $columnasDB = [
        'documento_id', 'nombre_doc', 'ruta', 'size','fecha_creacion',
        'hash_doc', 'estatus_doc', 'tipo_doc', 'id_pasajero'
    ];
    protected static $order = 'documento_id ';

    public $documento_id;
    public $nombre_doc;
    public $ruta;
    public $size;
    public $fecha_creacion;
    public $hash_doc;
    public $estatus_doc;
    public $tipo_doc;
    public $id_pasajero;

    public function __construct($args = [])
    {
        $this->documento_id = $args['documento_id'] ?? null;
        $this->nombre_doc = $args['nombre_doc'] ?? '';
        $this->ruta = $args['ruta'] ?? '';
        $this->size = $args['size'] ?? '';
        $this->fecha_creacion = $args['fecha_creacion'] ?? '';
        $this->hash_doc = $args['hash_doc'] ?? '';
        $this->estatus_doc = $args['estatus_doc'] ?? 'Activo';
        $this->tipo_doc = $args['tipo_doc'] ?? '';
        $this->id_pasajero = $args['id_pasajero'] ?? null;
    }
}

class RelCotPax extends ActiveRecord
{
    protected static $id = 'id_cot_pax';
    protected static $tabla = 'relcotpax';
    protected static $columnasDB = [
        'id_cot_pax', 'id_cot', 'id_pax', 'fecha_modificacion'
    ];
    protected static $order = 'id_cot_pax';

    public $id_cot_pax;
    public $id_cot;
    public $id_pax;
    public $fecha_modificacion;

    public function __construct($args = [])
    {
        $this->id_cot_pax = $args['id_cot_pax'] ?? null;
        $this->id_cot = $args['id_cot'] ?? null;
        $this->id_pax = $args['id_pax'] ?? null;
        $this->fecha_modificacion = $args['fecha_modificacion'] ?? date('Y-m-d H:i:s');
    }
}

class RelCotPaxRuta extends ActiveRecord
{
    protected static $id = '';
    protected static $tabla = 'rel_pax_ruta2';
    protected static $columnasDB = [
        'pasajero_id', 'cotizacion_id', 'ruta_id'
    ];
    protected static $order = 'pasajero_id';

    public $pasajero_id;
    public $cotizacion_id;
    public $ruta_id;

    public function __construct($args = [])
    {
        $this->pasajero_id = $args['pasajero_id'] ?? null;
        $this->cotizacion_id = $args['cotizacion_id'] ?? null;
        $this->ruta_id = $args['ruta_id'] ?? null;
    }


}
