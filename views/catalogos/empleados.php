<section class="contenedor--lg center-hv m-t3">
    <div class="flex-titulo">
        <h3><?php echo $titulo; ?></h3>
        <a class="btn btn-crear" id="crear-empleado"><i class="fa-solid fa-user-plus"></i></a>
    </div>

    <!-- AG-Grid -->
    <div class="quickFilterContent m-tb2">
        <div class="form-dsg">
            <div class="form-group">
                <input type="text" oninput="onQuickFilterChanged()" id="quickFilter" placeholder="" class="form_txt">
                <label for="quickFilter">Buscar</label>
            </div>
        </div>
    </div>

    <div class="grid-user">
        <div id="myGrid" class="ag-theme-balham"></div>
    </div>

</section>


<section class="contenedor-altas">

    <div class="contenedor--lg center-hv">

        <div class="flex-titulo">
            <h3>Detalle Empleado</h3>
        </div>

        <div class="row empleado">

            <div class="col-3 row altas_pasos">
                <div class="col-12 paso1">
                    <p>Información Básica</p>
                </div>
                <div class="col-12 paso2">
                    <p>Información Contacto</p>
                </div>
                <div class="col-12 paso3">
                    <p>Información Laboral</p>
                </div>
            </div>

            <div class="col-9 altas_secciones">

                <section id="paso1">

                    <div class="mostrar">

                        <div>
                            <h3 class="m-t1">Información Personal</h3>
                            <hr class="hr-line">

                            <form id="empleado_formulario-personal">

                                <div action="/" class="dropzone" id="testing">
                                    <div class="dz-default dz-message">
                                        <button class="dz-button" type="button">Suelta los archivos aquí para subirlos</button>
                                    </div>
                                </div>

                                <div class="hidden">
                                    <input type="text" id="empleado_id">
                                </div>

                                <div class="empleado_formP1">


                                    <div class="form-group">
                                        <input type="text" id="nombre" placeholder="" maxlength="60">
                                        <label for="nombre" class="labelImportant">Nombres:</label>
                                    </div>


                                    <div class="form-group ">
                                        <input type="text" id="apellido_paterno" placeholder="" maxlength="60">
                                        <label for="apellido_paterno" class="labelImportant">Apellido Paterno:</label>
                                    </div>
                                </div>

                                <div class="empleado_formP2">
                                    <div class="form-group empleado_formulario-materno">
                                        <input type="text" id="apellido_materno" placeholder="" maxlength="60">
                                        <label for="apellido_materno" class="labelImportant">Apellido Materno:</label>
                                    </div>

                                    <div class="form-group">
                                        <input type="date" id="fecha_nacimiento">
                                        <label for="fecha_nacimiento">Fecha de Nacimiento:</label>
                                    </div>


                                    <div class="form-group">
                                        <select name="sexo" id="sexo" placeholder="">
                                            <option selected></option>
                                            <option value="M">Masculino</option>
                                            <option value="F">Femenino</option>
                                        </select>
                                        <label for="sexo">Sexo::</label>
                                    </div>

                                </div>

                                <div class="empleado_formP3">

                                    <div class="form-group">
                                        <input type="text" id="curp" placeholder="" maxlength="18">
                                        <label for="curp" class="labelImportant">Curp:</label>
                                    </div>

                                    <div class="form-group">
                                        <input type="text" id="rfc" placeholder="" maxlength="13">
                                        <label for="rfc">Rfc:</label>
                                    </div>
                                </div>

                                <hr class="hr-line">
                            </form>
                        </div>

                        <div class="empleado_botones">
                            <button class="btn btn-atras btnCancel">Cancelar</button>
                            <button class="invisible"></button>
                            <button class="invisible"></button>
                            <button class="btn btn-next">Siguiente</button>
                        </div>
                    </div>

                </section>

                <section id="paso2" class="hidden ">

                    <div class="mostrar">
                        <div>
                            <h3 class="m-t1">Información Contacto</h3>
                            <hr class="hr-line">

                            <form id="empleado_formulario-contacto">

                                <div class="">
                                    <div class="form-group">
                                        <input type="text" id="email" placeholder="" maxlength="60" autocomplete="email">
                                        <label for="email">Email:</label>
                                    </div>
                                </div>

                                <div class="empleado-form2C">

                                    <div class="form-group">
                                        <input type="tel" id="tel_principal" placeholder="" maxlength="60">
                                        <label for="tel_principal" class="labelImportant">Teléfono Principal:</label>
                                    </div>
                                    <div class="form-group">
                                        <input type="tel" id="tel_secundario" placeholder="" maxlength="60">
                                        <label for="tel_secundario">Teléfono Secundario:</label>
                                    </div>
                                    <div class="form-group">
                                        <input type="text" id="estado" placeholder="" maxlength="60">
                                        <label for="estado" class="labelImportant">Estado:</label>
                                    </div>
                                    <div class="form-group">
                                        <input type="text" id="municipio" placeholder="" maxlength="60">
                                        <label for="municipio" class="labelImportant">Municipio:</label>
                                    </div>
                                    <div class="form-group">
                                        <input type="text" id="colonia" placeholder="" maxlength="60">
                                        <label for="colonia">Colonia:</label>
                                    </div>
                                    <div class="form-group">
                                        <input type="text" id="calle" placeholder="" maxlength="60">
                                        <label for="calle">Calle:</label>
                                    </div>

                                </div>

                                <div class="empleado-form3C">

                                    <div class="form-group">
                                        <input type="text" id="num_exterior" placeholder="" maxlength="60">
                                        <label for="num_exterior">Número Exterior:</label>
                                    </div>
                                    <div class="form-group">
                                        <input type="text" id="num_interior" placeholder="" maxlength="60">
                                        <label for="num_interior">Número Interior:</label>
                                    </div>
                                    <div class="form-group">
                                        <input type="text" id="codigo_postal" placeholder="" maxlength="60">
                                        <label for="codigo_postal">Código Postal:</label>
                                    </div>
                                </div>


                            </form>
                        </div>

                        <div class="empleado_botones">
                            <button class="btn btn-atras btnCancel">Cancelar</button>
                            <button class="invisible"></button>
                            <button class="btn btn-prev">Anterior</button>
                            <button class="btn btn-next">Siguiente</button>
                        </div>
                    </div>

                </section>

                <section id="paso3" class="hidden ">

                    <div class="mostrar">


                        <div class="">
                            <h3 class="m-tb1">Información Laboral</h3>
                            <hr class="hr-line">

                            <form id="empleado_formulario-laboral">


                                <div class="empleado-form13C">

                                    <div class="form-group empleado_form-depa">

                                        <select name="departamento_id" id="departamento_id" placeholder="">
                                            <option value=""></option>
                                        </select>
                                        <label for="departamento_id" class="labelImportant">Departamento:</label>

                                        <div class="containerSearch depaSearch">
                                            <input placeholder="Buscar..." class="inDepaSrch" type="search" name="inDepaSrch">
                                            <i class="fa-solid fa-magnifying-glass"></i>
                                        </div>

                                    </div>
                                    <div class="form-group">
                                        <select name="estado_laboral" id="estado_laboral" placeholder="">
                                            <option value="Activo">Activo</option>
                                            <option value="Inactivo">Inactivo</option>
                                        </select>
                                        <label for="estado_laboral">Estatus:</label>
                                    </div>
                                </div>

                                <div class="empleado-form3C">
                                    <div class="form-group">
                                        <input type="text" id="num_identificacion" placeholder="" maxlength="60" disabled>
                                        <label for="num_identificacion">Número Identificacion:</label>
                                    </div>

                                    <div class="form-group">
                                        <input type="text" id="nivel_academico" placeholder="" maxlength="60">
                                        <label for="nivel_academico">Nivel Academico:</label>
                                    </div>

                                    <div class="form-group">
                                        <select name="supervisor_id" id="supervisor_id" placeholder="">
                                            <option value=""></option>
                                        </select>
                                        <label for="supervisor_id" class="labelImportant">Supervisor:</label>

                                        <div class="containerSearch superSearch">
                                            <input placeholder="Buscar..." class="inSuperSrch" type="search" name="inSuperSrch">
                                            <i class="fa-solid fa-magnifying-glass"></i>
                                        </div>

                                    </div>
                                </div>


                            </form>

                        </div>

                        <div class="empleado_botones">
                            <button class="btn btn-atras btnCancel">Cancelar</button>
                            <button class="invisible"></button>
                            <button class="btn btn-prev">Anterior</button>
                            <button class="btn btn-guardar" id="btnGuardar">Guardar</button>
                        </div>
                    </div>
                </section>

            </div>

        </div>

    </div>
</section>

<script src="/build/js/empleados.js"></script>