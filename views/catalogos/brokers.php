<section class="contenedor--lg center-hv m-t3">
    <div class="flex-titulo">
        <h3><?php echo $titulo; ?></h3>
        <a class="btn btn-crear" id="crear-broker"> <i class="fa-solid fa-building"></i></a>
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
            <h3>Detalle Broker</h3>
        </div>

        <div class="row ">

            <div class="col-3 row altas_pasos">
                <div class="col-12 paso1">
                    <p>Información del Broker</p>
                </div>
                <div class="col-12 paso2">
                    <p>Información de Contacto</p>
                </div>
                <div class="col-12 paso3">
                    <p>Información Fiscal y Legal</p>
                </div>
            </div>

            <div class="col-9 altas_secciones">

                <section id="paso1">
                    <div class="mostrar">
                        <div>
                            <h3 class="m-t1">Información del broker</h3>
                            <hr class="hr-line">

                            <form id="broker_formulario-broker">

                                <div class="hidden">
                                    <input type="text" id="broker_id">
                                </div>

                                <div class="cont-form3">

                                    <div class="form-group">
                                        <input type="text" id="nombre" placeholder="" maxlength="60">
                                        <label for="nombre" class="labelImportant">Nombre:</label>
                                    </div>

                                    <div class="form-group">
                                        <input type="text" id="siglas_empresa" placeholder="" maxlength="60">
                                        <label for="siglas_empresa">Siglas:</label>
                                    </div>

                                    <div class="form-group">
                                        <select name="estatus" id="estatus">
                                            <option value=""></option>
                                            <option value="Activo">Activo</option>
                                            <option value="Inactivo">Inactivo</option>
                                        </select>
                                        <label for="estatus" class="labelImportant">Estatus:</label>
                                    </div>

                                </div>
                                <div class="cont-form2">

                                    <div class="form-group">
                                        <input type="text" id="telefono" placeholder="" maxlength="60">
                                        <label for="telefono" class="labelImportant">Teléfono:</label>
                                    </div>

                                    <div class="form-group">
                                        <input type="email" id="email" placeholder="" maxlength="60" autocomplete="off">
                                        <label for="email" class="labelImportant">Email:</label>
                                    </div>

                                </div>

                                <div class="cont-form1">
                                    <div class="form-group">
                                        <input type="text" id="sitio_web" placeholder="" maxlength="60">
                                        <label for="sitio_web">Sito Web:</label>
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

                                <div class="cont-form3">

                                    <div class="input-empr-comision">
                                        <label for="comision">Comisión:</label>
                                        <input type="checkbox" name="comision" id="comision">
                                    </div>

                                    <div class="form-group input-empr-desc hidden">
                                        <input type="text" id="descuento" placeholder="" maxlength="60">
                                        <label for="descuento">Descuento Por Hora:</label>
                                    </div>

                                </div>

                            </form>

                        </div>
                    </div>
                </section>

                <section id="paso2" class="hidden ">
                    <div class="mostrar">
                        <div>
                            <h3 class="m-t1">Información de Contacto</h3>
                            <hr class="hr-line">

                            <form id="broker_formulario-contacto">

                                <div class="cont-form1">
                                    <div class="form-group">
                                        <input type="text" id="contacto_principal" placeholder="" maxlength="60" required>
                                        <label for="contacto_principal">Nombre del Contacto Principal:</label>
                                    </div>
                                </div>

                                <div class="cont-form3">
                                    <div class="form-group">
                                        <input type="text" id="calle" placeholder="" maxlength="100" required>
                                        <label for="calle">Calle:</label>
                                    </div>

                                    <div class="form-group">
                                        <input type="text" id="num_ext" placeholder="" maxlength="10" required>
                                        <label for="num_ext">Número Exterior:</label>
                                    </div>

                                    <div class="form-group">
                                        <input type="text" id="num_int" placeholder="" maxlength="10" required>
                                        <label for="num_int">Número Interior:</label>
                                    </div>
                                </div>

                                <div class="cont-form3">
                                    <div class="form-group input-empr-colonia">
                                        <input type="text" id="colonia" placeholder="" maxlength="60" required>
                                        <label for="colonia">Colonia:</label>
                                    </div>
                                    <div class="form-group">
                                        <input type="text" id="codigo_postal" placeholder="" maxlength="10" required>
                                        <label for="codigo_postal">Código Postal:</label>
                                    </div>
                                </div>
                                <div class="cont-form2">
                                    <div class="form-group">
                                        <input type="text" id="municipio" placeholder="" maxlength="60" required>
                                        <label for="municipio">Municipio:</label>
                                    </div>
                                    <div class="form-group">
                                        <input type="text" id="ciudad" placeholder="" maxlength="60" required>
                                        <label for="ciudad">Ciudad:</label>
                                    </div>
                                </div>
                                <div class="cont-form2">
                                    <div class="form-group">
                                        <input type="text" id="estado" placeholder="" maxlength="60" required>
                                        <label for="estado">Estado:</label>
                                    </div>
                                    <div class="form-group">
                                        <input type="text" id="pais" placeholder="" maxlength="60" required>
                                        <label for="pais">País:</label>
                                    </div>
                                </div>

                            </form>

                        </div>
                    </div>
                </section>

                <section id="paso3" class="hidden ">
                    <div class="mostrar">
                        <div>
                            <h3 class="m-t1">Información Fiscal y Legal</h3>
                            <hr class="hr-line">

                            <form id="broker_formulario-fiscal">

                                <div class="cont-form2">
                                    <div class="form-group">
                                        <input type="text" id="rfc" placeholder="" maxlength="13" required>
                                        <label for="rfc">Rfc:</label>
                                    </div>
                                    <div class="form-group">
                                        <input type="text" id="razon_social" placeholder="" maxlength="255" required>
                                        <label for="razon_social">Razón Social:</label>
                                    </div>
                                    <div class="form-group">
                                        <input type="text" id="regimen_fiscal" placeholder="" maxlength="60" required>
                                        <label for="regimen_fiscal">Régimen Fiscal:</label>
                                    </div>
                                    <div class="form-group">
                                        <input type="text" id="giro_comercial" placeholder="" maxlength="100" required>
                                        <label for="giro_comercial">Giro Comercial:</label>
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

<script src="/build/js/brokers.js"></script>