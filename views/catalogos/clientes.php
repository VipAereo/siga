<section class="contenedor--lg center-hv m-t3">
    <div class="flex-titulo">
        <h3><?php echo $titulo; ?></h3>
        <a class="btn btn-crear" id="crear-cliente"><i class="fa-solid fa-user-plus"></i></a>
    </div>

    <!-- AG-Grid -->
    <div class="quickFilterContent m-tb2">
        <div class="form-dsg">
            <div class="form-group">
                <input type="text" id="searchInput" placeholder="" autocomplete="off" oninput="filtrarTabla('#myGrid', this.value)">
                <label for="searchInput">Buscar</label>
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
            <h3>Detalle Cliente</h3>
        </div>

        <div class="row empleado">

            <div class="col-3 row altas_pasos">
                <div class="col-12 paso1">
                    <p>Información Personal</p>
                </div>
                <div class="col-12 paso2">
                    <p>Información Contacto</p>
                </div>
                <div class="col-12 paso3">
                    <p>Información Fiscal</p>
                </div>

            </div>

            <div class="col-9 altas_secciones">

                <section id="paso1">
                    <div class="mostrar">
                        <div>
                            <h3 class="m-t1">Información Personal</h3>
                            <hr class="hr-line">

                            <form id="cliente_form-personal">

                                <div class="hidden">
                                    <input type="text" id="cliente_id">
                                </div>

                                <div class="cont-form2">
                                    <div class="form-group">
                                        <input type="text" id="nombre" placeholder="" maxlength="60">
                                        <label for="nombre" class="labelImportant">Nombres:</label>
                                    </div>
                                    <div class="form-group">
                                        <input type="text" id="apellido" placeholder="" maxlength="60">
                                        <label for="apellido" class="labelImportant">Apellidos:</label>
                                    </div>
                                </div>

                                <div class="cont-form3">
                                    <div class="form-group">
                                        <select name="sexo" id="sexo">
                                            <option value="" disabled selected></option>
                                            <option value="M">Masculino</option>
                                            <option value="F">Femenino</option>
                                        </select>
                                        <label for="sexo">Sexo:</label>
                                    </div>
                                    <div class="form-group">
                                        <input type="date" id="fecha_nacimiento" placeholder="">
                                        <label for="fecha_nacimiento">Fecha Nacimiento:</label>
                                    </div>
                                    <div class="form-group">
                                        <select name="estatus" id="estatus">
                                            <option value=""  ></option>
                                            <option value="Activo">Activo</option>
                                            <option value="Inactivo">Inactivo</option>
                                        </select>
                                        <label for="estatus" class="labelImportant">Estatus:</label>
                                    </div>
                                </div>

                                <div class="cont-form2">
                                    <div class="form-group">
                                        <select name="preferencia_id" id="preferencia_id" placeholder="">
                                            <option value=""></option>
                                        </select>
                                        <label for="preferencia_id">Preferencia:</label>

                                        <div class="containerSearch prefSearch">
                                            <input placeholder="Buscar..." class="inPrefSrch" type="search">
                                            <i class="fa-solid fa-magnifying-glass"></i>
                                        </div>

                                    </div>
                                </div>

                            </form>
                        </div>
                    </div>
                </section>

                <section id="paso2" class="hidden">
                    <div class="mostrar">
                        <div>
                            <h3 class="m-t1">Información de Contacto</h3>
                            <hr class="hr-line">

                            <form id="cliente_form-contacto">

                                <div class="cont-form2">
                                    <div class="form-group">
                                        <input type="email" id="email" placeholder="" maxlength="60" autocomplete="false">
                                        <label for="email">Email:</label>
                                    </div>
                                    <div class="form-group">
                                        <input type="tel" id="telefono" placeholder="" maxlength="15">
                                        <label for="telefono">Teléfono:</label>
                                    </div>
                                </div>

                                <div class="cont-form2">
                                    <div class="form-group">
                                        <input type="text" id="pais" placeholder="" maxlength="60">
                                        <label for="pais">País:</label>
                                    </div>
                                    <div class="form-group">
                                        <input type="text" id="ciudad" placeholder="" maxlength="60">
                                        <label for="ciudad">Ciudad:</label>
                                    </div>
                                </div>

                                <div class="cont-form3">
                                    <div class="form-group">
                                        <input type="text" id="codigo_postal" placeholder="" maxlength="10">
                                        <label for="codigo_postal">Código Postal:</label>
                                    </div>
                                    <div class="form-group">
                                        <input type="text" id="estado" placeholder="" maxlength="60">
                                        <label for="estado">Estado:</label>
                                    </div>
                                    <div class="form-group">
                                        <input type="text" id="colonia" placeholder="" maxlength="60">
                                        <label for="colonia">Colonia:</label>
                                    </div>
                                </div>

                                <div class="cont-form4">
                                    <div class="form-group formClienteCalle">
                                        <input type="text" id="calle" placeholder="" maxlength="100">
                                        <label for="calle">Calle:</label>
                                    </div>
                                    <div class="form-group">
                                        <input type="text" id="num_ext" placeholder="" maxlength="10">
                                        <label for="num_ext">Número Exterior:</label>
                                    </div>
                                    <div class="form-group">
                                        <input type="text" id="num_int" placeholder="" maxlength="10">
                                        <label for="num_int">Número Interior:</label>
                                    </div>
                                </div>

                            </form>
                        </div>
                    </div>
                </section>

                <section id="paso3" class="hidden">
                    <div class="mostrar">
                        <div>
                            <h3 class="m-t1">Información de Contacto</h3>
                            <hr class="hr-line">

                            <form id="cliente_form-fiscal">

                              
                                <div class="cont-form2">
                                    <div class="form-group">
                                        <input type="text" id="rfc" placeholder="" maxlength="13">
                                        <label for="rfc">Rfc:</label>
                                    </div>
                                    <div class="form-group">
                                        <input type="text" id="curp" placeholder="" maxlength="18">
                                        <label for="curp">Curp:</label>
                                    </div>
                                </div>

                                <div class="cont-form2">
                                    <div class="form-group">
                                        <input type="text" id="regimen_fiscal" placeholder="" maxlength="60">
                                        <label for="regimen_fiscal">Régimen Fiscal:</label>
                                    </div>
                                    <div class="form-group">
                                        <input type="text" id="razon_social" placeholder="" maxlength="255">
                                        <label for="razon_social">Razón Social:</label>
                                    </div>
                                </div>

                            </form>
                        </div>
                    </div>
                </section>

                <div class="empleado_botones">
                    <button class="btn btn-atras btnCancel">Cancelar</button>
                    <button class="invisible"></button>
                    <button class="btn btn-prev invisible">Anterior</button>
                    <button class="btn btn-next">Siguiente</button>
                    <button class="btn btn-guardar hidden" id="btnGuardar">Guardar</button>
                </div>

            </div>
        </div>


    </div>
</section>


<script src="/build/js/clientes.js"></script>