<?php

namespace Model;

class Usuario extends ActiveRecord
{
    // solo se puede acceder en la clase
    protected static $id = 'usuario_id';
    protected static $tabla = 'usuarios';
    protected static $columnasDB = ['usuario_id', 'nombre_user', 'nombre_completo', 'password', 'fecha_creacion', 'fecha_modificacion', 'user_creacion', 'user_modificacion', 'fecha_ult_acceso', 'estatus', 'ip_user', 'empleado_id', 'rol_id'];
    protected static $order = 'usuario_id DESC';

    public function __construct($args = [])
    {
        // form = database
        $this->usuario_id = $args['usuario_id'] ?? null;
        $this->nombre_user = s($args['nombre_user']) ?? '';
        $this->nombre_completo = s($args['nombre_completo']) ?? '';
        $this->password = $args['password'] ?? '';
        $this->password2 = $args['password2'] ?? '';
        $this->fecha_creacion = $args['fecha_creacion'] ?? '';
        $this->fecha_modificacion = $args['fecha_modificacion'] ?? date('Y-m-d H:i:s');
        $this->user_creacion = $args['user_creacion'] ?? '';
        $this->user_modificacion = $args['user_modificacion'] ?? '';
        $this->fecha_ult_acceso = $args['fecha_ult_acceso'] ?? '';
        $this->estatus = $args['estatus'] ?? 'Activo';
        $this->ip_user = $args['ip_user'] ?? '';
        $this->empleado_id = $args['empleado_id'] ?? null;
        $this->rol_id = $args['rol_id'] ?? null;
    }

    public function validarLogin()
    {
        $alertas = [];

        if (!$this->nombre_user) {
            self::$alertas['errorVacio'][] = '¡Campo de Usuario Obligatorio!';
        }

        if (!$this->nombre_user) {
            self::$alertas['errorPass'][] = '¡Contraseña Obligatoria!';
        }

        return self::$alertas;
    }

    public function validar_cuenta()
    {
    }

    // Hashea el password
    public function hashPassword(): void
    {
        $this->password = password_hash($this->password, PASSWORD_BCRYPT);
    }

    // Generar un Token
    public function crearToken(): void
    {
        $this->token = uniqid();
    }
}
