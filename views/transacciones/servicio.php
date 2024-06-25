<section class="contenedor--lg center-hv m-t3">
    <div class="flex-titulo">
        <h3><?php echo $titulo; ?></h3>
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

<section class="contenedor-altas costear">

    <div class="contenedor--lg center-hv " id="contenedor">

        <div class="flex-titulo">
            <h3><?php echo $titulo; ?></h3>
            <a class="btn btn-pass" id="genera_pass">
                <i class="fa-solid fa-plane-departure"></i>
            </a>
        </div>

        <!-- Encabezado -->
        <form id="formAltas" class="m-rl3 m-t3">

            <div class="hidden">
                <div class="hidden">
                    <input type="text" id="servicio_id">
                </div>
                <div class="hidden">
                    <input type="text" id="cotizar_id">
                </div>
                <div class="hidden">
                    <input type="text" id="costo_id">
                </div>
            </div>

            <div class="cont-form4">

                <div class="form-group" id="inpPiloto">
                    <select name="piloto_id" id="piloto_id" placeholder="">
                        <option value=""></option>
                    </select>
                    <label for="piloto_id" class="labelImportant">Piloto:</label>

                    <div class="containerSearch pilSearch">
                        <input placeholder="Buscar..." class="inPilSrch" type="search" name="inPilSrch">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>

                </div>


                <div class="form-group">
                    <input type="text" id="folio" placeholder="" disabled>
                    <label for="folio">Folio:</label>
                </div>


                <div class="form-group">
                    <select name="estatus" id="estatus" placeholder="" disabled>
                        <option value=""></option>
                        <option value="CMP">Completado</option>
                        <option value="SVC">Servicio</option>
                        <option value="CTZ">Cotizado</option>
                        <option value="PND">Pendiente</option>
                    </select>
                    <label for="estatus">Estatus:</label>
                </div>

                <div class="form-group">
                    <input class="txt-right" type="text" id="fecha-cot" placeholder="" disabled>
                    <label for="fecha-cot">Fecha:</label>
                </div>

            </div>

            <div class="cont-form3">

                <div class="form-group">
                    <select name="aeronave_id" id="aeronave_id" placeholder="">
                        <option value=""></option>
                    </select>
                    <label for="aeronave_id" class="labelImportant">Aeronave:</label>

                    <div class="containerSearch aeroSearch">
                        <input placeholder="Buscar..." class="inAeroSrch" type="search" name="inEmprSrch">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>
                </div>

                <div class="form-group border-bottom">

                    <select name="slctOpcion" id="slctOpcion">
                        <option value="" disabled>-- Elige una opción --</option>
                        <option value="1">Cliente</option>
                        <option value="2">Broker</option>
                    </select>
                    <label for="slctOpcion">Cotizar a:</label>

                </div>

                <div class="form-group" id="inpCliente">
                    <select name="cliente_id" id="cliente_id" placeholder="">
                        <option value=""></option>
                    </select>
                    <label for="cliente_id" class="labelImportant">Cliente:</label>

                    <div class="containerSearch cliSearch">
                        <input placeholder="Buscar..." class="inCliSrch" type="search" name="inCliSrch">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>

                </div>

            </div>

            <div class="cont-form3" id="inpEmpresa">

                <div class="form-group border-bottom">

                    <select name="broker_id" id="broker_id" placeholder="">
                        <option value=""></option>
                    </select>
                    <label for="broker_id" class="labelImportant">Broker:</label>

                    <div class="containerSearch emprSearch">
                        <input placeholder="Buscar..." class="inEmprSrch" type="search" name="inEmprSrch">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>

                </div>

                <div class="form-group border-bottom">
                    <input type="text" disabled id="rt-responsable">
                    <label for="rt-responsable">Responsable</label>
                </div>

            </div>

        </form>

        <hr class="hr-line">

        <!-- AG-Grid -->
        <div class="quickFilterContent m-tb2">
            <div class="form-dsg">
                <div class="form-group">
                    <input type="text" id="searchInput1" placeholder="" autocomplete="off" oninput="filtrarTabla('#myGrid2', this.value)">
                    <label for="searchInput1">Buscar</label>
                </div>
            </div>
        </div>

        <div class="grid-altas heightAuto">
            <div id="myGrid2" class="ag-theme-balham"></div>
        </div>

        <form id="formTotales" class="m-rl3">
            <div class="cont-form3">
                <div>
                    <h4 class="tl-azul">Resumen de Totales</h4>
                    <div class="totales_comment">
                        <label for="rt-comment">Comentarios:</label>
                        <textarea name="" id="rt-comment" cols="30" rows="10" placeholder=""></textarea>
                    </div>
                </div>

                <div>
                    <h4 class="invisible">4</h4>
                    <div class="totales_cont">
                        <label for="cant_pernocta">Cantidad Pernoctas:</label>
                        <input type="text" id="cant_pernocta" placeholder="" disabled>
                    </div>
                    <div class="totales_cont">
                        <label for="tot_pernocta">Total Costo Pernoctas:</label>
                        <input type="text" id="tot_pernocta" placeholder="" disabled>
                    </div>
                    <div class="totales_cont">
                        <label for="cant_hrs">Horas Vuelo:</label>
                        <input type="text" id="cant_hrs" placeholder="" disabled>
                    </div>
                    <div class="totales_cont ">
                        <label for="tot_hrs">Total Horas Vuelo:</label>
                        <input type="text" id="tot_hrs" placeholder="" disabled>
                    </div>
                </div>

                <div>
                    <h4 class="tl-azul invisible">Costos</h4>

                    <div class="totales_cont">
                        <label for="tipo_cambio hidden">Tipo de Cambio:</label>
                        <a class="tipoCambio" id="actTipoCambio" title="Actualizar Tipo de Cambio"><i class="fa-solid fa-arrows-rotate"></i></a>
                        <select class="txt-right" name="tipo_cambio" id="tipo_cambio" placeholder="" disabled>
                            <option value=""></option>
                        </select>
                    </div>

                    <div class="totales_cont">
                        <label for="subtotal">Subtotal:</label>
                        <input type="text" id="subtotal" placeholder="" disabled>
                    </div>

                    <div class="totales_cont">
                        <label for="ivaNac">Iva Nacional 16%:</label>
                        <input type="text" id="ivaNac" placeholder="" disabled>
                    </div>
                    <div class="totales_cont">
                        <label for="ivaInt">Iva Internacional 4%:</label>
                        <input type="text" id="ivaInt" placeholder="" disabled>
                    </div>
                    <div class="totales_cont cant-total">
                        <label for="total">Total:</label>
                        <input type="text" id="total" placeholder="" disabled>
                    </div>
                </div>

            </div>
        </form>

        <hr class="hr-line">

        <!-- Pasajeros  -->
        <section class="costeo-pasajeros m-rl3">
            <h4 class="tl-azul toggle-pax">Pasajeros <span class="arrow"></span></h4>
            <form id="formPasajeros" class="m-rl3 toggle-pax-cont">
                <!-- <a class="btn btn-pasajero m-b2" id="btnPasajero">Agregar Pasajero</a> -->
                <div class="form-group addPax">
                    <select name="pasajero_id" id="pasajero_id" placeholder="">
                        <option value=""></option>
                    </select>
                    <label for="pasajero_id" class="labelImportant">Agregar Pasajero:</label>

                    <div class="containerSearch paxSearch">
                        <input placeholder="Buscar..." class="inPaxSrch" type="search" name="inPaxSrch">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>
                </div>
            </form>
        </section>

        <hr class="hr-line">

        <!-- Asocioar Rutas Con Pasajeros -->
        <section class="costeo-relacion m-rl3">
            <h4 class="tl-azul toggle-relRuta">Relación - Rutas y Pasajeros <span class="arrow"></span></h4>
            <form id="formRelRuta" class="m-rl3 toggle-relRuta-cont">

            </form>
        </section>

        <!-- Botones -->
        <div class="cont-btn txt-center m-t3">
            <button class="btn btn-cancelar m-b2" id="btnCancel">Cancelar</button>
            <button class="btn btn-guardar m-b2" id="btnGuardar">Guardar</button>
        </div>

    </div>

</section>

<div id="filtro"></div>

<script src="/build/js/servicio.js"></script>