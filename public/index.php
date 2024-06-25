<?php
require __DIR__ . '/../includes/app.php';

use MVC\Router;
use Controllers\AuthController;
use Controllers\DashboardController;
use Controllers\UsuariosController;
use Controllers\EmpleadosController;
use Controllers\RolesController;
use Controllers\DepartamentosController;
use Controllers\ProgramasController;
use Controllers\ProgRoleController;
use Controllers\ProgUserController;
use Controllers\BrokerController;
use Controllers\AeronaveController;
use Controllers\AeropuertoController;
use Controllers\CategoriaController;
use Controllers\ClienteController;
use Controllers\CotizacionSoliController;
use Controllers\PilotoController;
use Controllers\RelPilotoAeroController;
use Controllers\TasaAterrizajeController;
use Controllers\RutasController;
use Controllers\TarifasController;
use Controllers\PasajeroController;
use Controllers\CostearController;
use Controllers\ProductoController;
use Controllers\ServicioController;
use Model\Categoria;

$router = new Router();

/* LOGIN */
// registramos las URL, debe existir la funcion si no dara error en call_user_func()
$router->get('/login', [AuthController::class, 'login']);
$router->post('/logeo', [AuthController::class, 'entrar']);
$router->get('/logout', [AuthController::class, 'logout']);
$router->get('/', [AuthController::class, 'index']);

/* INTRANET */
$router->get('/obtener/menu', [DashboardController::class, 'obtenerMenu']);
$router->get('/ruta', [DashboardController::class, 'ruta']);

/* USUARIOS */
// Utilizando MVC con Routing con el controlador puedo indicarle desde js con fetch que funcion entrar? 
$router->get('/usuarios', [UsuariosController::class, 'usuario']);
$router->get('/obtener/usuarios', [UsuariosController::class, 'usuarios']);
$router->get('/usuarios/activos', [UsuariosController::class, 'activos']);
$router->post('/crear/usuario', [UsuariosController::class, 'crear']);
$router->post('/actualizar/usuario', [UsuariosController::class, 'actualizar']);
$router->post('/eliminar/usuario', [UsuariosController::class, 'eliminar']);

/* EMPLEADOS */
$router->get('/empleados', [EmpleadosController::class, 'empleado']);
$router->get('/allEmpleados', [EmpleadosController::class, 'empleados']);
$router->get('/empleados/activos', [EmpleadosController::class, 'activos']);
$router->post('/crear/empleado', [EmpleadosController::class, 'crear']);
$router->post('/actualizar/empleado', [EmpleadosController::class, 'actualizar']);

/* ROLES */
$router->get('/roles', [RolesController::class, 'rol']);
$router->get('/allRoles', [RolesController::class, 'roles']);
$router->get('/roles/activos', [RolesController::class, 'activo']);
$router->post('/crear/rol', [RolesController::class, 'crear']);
$router->post('/actualizar/rol', [RolesController::class, 'actualizar']);

/* DEPARTAMENTOS */
$router->get('/departamentos', [DepartamentosController::class, 'departamento']);
$router->get('/allDepartamentos', [DepartamentosController::class, 'departamentos']);
$router->get('/departamentos/activos', [DepartamentosController::class, 'activo']);
$router->post('/crear/departamento', [DepartamentosController::class, 'crear']);
$router->post('/actualizar/departamento', [DepartamentosController::class, 'actualizar']);

/* PROGRAMAS */
$router->get('/programas', [ProgramasController::class, 'programa']);
$router->get('/allProgramas', [ProgramasController::class, 'programas']);
$router->post('/verificar/programa', [ProgramasController::class, 'verificar']);
$router->post('/crear/programa', [ProgramasController::class, 'crear']);
$router->post('/actualizar/programa', [ProgramasController::class, 'actualizar']);

/* RELACION PROGRAMAS & ROLES */
$router->get('/progRoles', [ProgRoleController::class, 'programaRol']);
$router->get('/allProgramas/roles', [ProgRoleController::class, 'allProgramRole']);
$router->post('/progRole/relaciones', [ProgRoleController::class, 'programRoleRelacion']);
$router->post('/crear/progRoles', [ProgRoleController::class, 'crearProgRoles']);
$router->post('/eliminar/progRoles', [ProgRoleController::class, 'eliminarProgRoles']);

/* RELACION PROGRAMAS & USUARIOS */
$router->get('/progUser', [ProgUserController::class, 'programaUser']);
$router->post('/progUsuario/relaciones', [ProgUserController::class, 'programUsuarioRelacion']);
$router->post('/crear/progUsuarios', [ProgUserController::class, 'crearProgUsuarios']);
$router->post('/eliminar/progUsuarios', [ProgUserController::class, 'eliminarProgUsuarios']);

/* BROKERS */
$router->get('/brokers', [BrokerController::class, 'broker']);
$router->get('/obtener/brokers', [BrokerController::class, 'brokers']);
$router->get('/brokers/activas', [BrokerController::class, 'activas']);
$router->post('/crear/broker', [BrokerController::class, 'crear']);
$router->post('/actualizar/broker', [BrokerController::class, 'actualizar']);

/* AERONAVES */
$router->get('/aeronaves', [AeronaveController::class, 'aeronave']);
$router->get('/allAeronaves', [AeronaveController::class, 'aeronaves']);
$router->get('/aeronaves/activas', [AeronaveController::class, 'activas']);
$router->post('/crear/aeronave', [AeronaveController::class, 'crear']);
$router->post('/actualizar/aeronave', [AeronaveController::class, 'actualizar']);
$router->post('/obtener/aeronaveId', [AeronaveController::class, 'aeronaveId']);

/* AEROPUERTO */
$router->get('/aeropuerto', [AeropuertoController::class, 'aeropuerto']);
$router->get('/allAeropuertos', [AeropuertoController::class, 'aeropuertos']);
$router->get('/aeropuertos/activos', [AeropuertoController::class, 'activos']);
$router->post('/crear/aeropuerto', [AeropuertoController::class, 'crear']);
$router->post('/actualizar/aeropuerto', [AeropuertoController::class, 'actualizar']);

/* PILOTOS */
$router->get('/pilotos', [PilotoController::class, 'piloto']);
$router->get('/allPilotos', [PilotoController::class, 'pilotos']);
$router->get('/pilotos/activos', [PilotoController::class, 'activos']);
$router->post('/crear/piloto', [PilotoController::class, 'crear']);
$router->post('/actualizar/piloto', [PilotoController::class, 'actualizar']);

/* RELACIÓN PILOTOS - AERONAVE */
$router->get('/asignarAeronave', [RelPilotoAeroController::class, 'asignarAeronave']);
$router->get('/allPilotoAero', [RelPilotoAeroController::class, 'allPilotoAero']);
$router->post('/crear/pilotoAero', [RelPilotoAeroController::class, 'crearPilotoAero']);
$router->post('/actualizar/pilotoAero', [RelPilotoAeroController::class, 'actualizarPilotoAero']);

/* CLIENTES */
$router->get('/clientes', [ClienteController::class, 'cliente']);
$router->get('/allClientes', [ClienteController::class, 'clientes']);
$router->get('/tarifa/tipo', [ClienteController::class, 'tipo']);
$router->post('/crear/cliente', [ClienteController::class, 'crear']);
$router->post('/actualizar/cliente', [ClienteController::class, 'actualizar']);

/* Tasa de Aterrizaje */
$router->get('/tasaAterrizaje', [TasaAterrizajeController::class, 'tasaAterrizaje']);
$router->get('/allTasaAt', [TasaAterrizajeController::class, 'tasas']);
$router->post('/crear/tasaAterrizaje', [TasaAterrizajeController::class, 'crear']);
$router->post('/actualizar/tasaAterrizaje', [TasaAterrizajeController::class, 'actualizar']);

/* RUTAS */
$router->get('/rutas', [RutasController::class, 'ruta']);
$router->get('/obtener/rutas', [RutasController::class, 'rutas']);
$router->post('/crear/ruta', [RutasController::class, 'crear']);
$router->post('/actualizar/ruta', [RutasController::class, 'actualizar']);

/* TARIFAS */
$router->get('/tarifas', [TarifasController::class, 'tarifa']);
$router->get('/obtener/tarifas', [TarifasController::class, 'tarifas']);
$router->get('/allPreferencias', [TarifasController::class, 'preferencias']);
$router->post('/obtener/detalleTarifa', [TarifasController::class, 'detalleTarifa']);
$router->post('/crear/tarifa', [TarifasController::class, 'crear']);
$router->post('/actualizar/tarifa', [TarifasController::class, 'actualizar']);
$router->post('/obtener/tarifacostos', [TarifasController::class, 'costos']);

/* PASAJEROS */
$router->get('/pasajeros', [PasajeroController::class, 'pasajero']);
$router->get('/obtener/pasajeros', [PasajeroController::class, 'pasajeros']);
$router->post('/crear/pax', [PasajeroController::class, 'crear']);
$router->post('/actualizar/pax', [PasajeroController::class, 'actualizar']);
$router->post('/obtener/pasajerosDocs', [PasajeroController::class, 'pasajerosDocs']);

/* CATEGORIAS */
$router->get('/obtener/categorias', [CategoriaController::class, 'categorias']);
// $router->get('/obtener/categorias', [CostearController::class, 'categoria']);


/* SOLICITAR COTIZACIÓN */
$router->get('/solicitar/cotizacion', [CotizacionSoliController::class, 'cotizacion']);
$router->get('/obtener/cotizaciones', [CotizacionSoliController::class, 'cotizaciones']);
$router->post('/obtener/vuelos', [CotizacionSoliController::class, 'vuelosId']);
$router->post('/crear/SolCotizacion', [CotizacionSoliController::class, 'crear']);
$router->post('/actualizar/SolCotizacion', [CotizacionSoliController::class, 'actualizar']);
$router->post('/eliminar/ruta', [CotizacionSoliController::class, 'eliminar']);

/* COSTEAR COTIZACIÓN */
$router->get('/costear/cotizacion', [CostearController::class, 'costear']);
$router->post('/valida/ruta', [CostearController::class, 'validaRuta']);
$router->post('/obtener/pax', [CostearController::class, 'pax']);
$router->post('/obtener/rutPaxCot', [CostearController::class, 'rutPaxCot']);
$router->post('/obtener/pdf', [CostearController::class, 'pdf']);
$router->post('/valida/aterrizaje', [CostearController::class, 'tasaAterrizaje']);
$router->post('/crear/costeo', [CostearController::class, 'crear']);
$router->post('/actualizar/costeo', [CostearController::class, 'actualizar']);
$router->post('/actualizar/relacionRutaPax', [CostearController::class, 'actualizarRutaPax']);
$router->get('/tipo/cambio', [CostearController::class, 'cambio']);
$router->post('/generar/servicio', [CostearController::class, 'servicio']);
$router->post('/obtener/codigos',  [CostearController::class, 'codigos']);
$router->post('/eliminar/detalle', [CostearController::class, 'eliminar']);
$router->post('/eliminar/pasajero', [CostearController::class, 'eliminarPax']);

/* SERVICIOS */
$router->get('/servicios', [ServicioController::class, 'servicio']);
$router->get('/obtener/servicios', [ServicioController::class, 'servicios']);
$router->post('/obtener/vuelosServ', [ServicioController::class, 'serviciosDet']);
$router->post('/actualizar/servicio', [ServicioController::class, 'actualizar']);
$router->post('/eliminar/detServicio', [ServicioController::class, 'eliminarServ']);

/* PRODUCOTS & SERVICIOS */
$router->get('/productos', [ProductoController::class, 'producto']);
$router->get('/obtener/productos', [ProductoController::class, 'productos']);
$router->post('/crear/producto', [ProductoController::class, 'crear']);
$router->post('/actualizar/producto', [ProductoController::class, 'actualizar']);



$router->comprobarRutas();