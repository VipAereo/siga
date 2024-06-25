<section class="contenedor--lg center-hv m-t3">
    <div class="flex-titulo">
        <h3><?php echo $titulo; ?></h3>
        <a class="btn btn-crear" id="crear-solCot">
            <i class="fa-solid fa-plus"></i>
        </a>
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

<section class="contenedor-altas solCotizacion">

    <div class="contenedor--md center-hv " id="contenedor">

        <div class="flex-titulo">
            <h3><?php echo $titulo; ?></h3>
            <a class="btn btn-pdf" id="genera_pdf">
                <i class="fa-regular fa-file-pdf"></i>
            </a>
        </div>

        <div id="cont-encabezado">
            <!-- Encabezado -->
            <form id="formAltas" class="m-rl3 m-t3">

                <div class="hidden">
                    <input type="text" id="cotizar_id">
                </div>

                <div class="cont-form4">
                    <div class="form-group no-borde">
                        <input type="text" id="folio" placeholder="" disabled>
                        <label for="folio">Folio:</label>
                    </div>
                    <div class="form-group in-solCot-aero border-bottom">
                        <select name="aeronave_id" id="aeronave_id" placeholder="">
                            <option value=""></option>
                        </select>
                        <label for="aeronave_id" class="labelImportant">Aeronave:</label>

                        <div class="containerSearch aeroSearch">
                            <input placeholder="Buscar..." class="inAeroSrch" type="search" name="inEmprSrch">
                            <i class="fa-solid fa-magnifying-glass"></i>
                        </div>

                    </div>
                    <div class="form-group no-borde ">
                        <input class="txt-right" type="text" id="fecha-cot" placeholder="..." disabled>
                        <label for="fecha-cot">Fecha:</label>
                    </div>
                </div>

                <div class="cont-form2">
                    <div class="form-group border-bottom">
                        <select name="slctOpcion" id="slctOpcion">
                            <option value="" disabled>-- Elige una opción --</option>
                            <option value="1">Cliente</option>
                            <option value="2">Broker</option>
                        </select>
                        <label for="slctOpcion" class="labelImportant">Cotizar a:</label>
                    </div>

                    <div class="form-group border-bottom">
                        <select name="estatus" id="estatus" placeholder="" disabled>
                            <option value=""></option>
                            <option value="CMP">Completado</option>
                            <option value="SVC">Servicio</option>
                            <option value="CTZ">Cotizado</option>
                            <option value="PND">Pendiente</option>
                        </select>
                        <label for="estatus">Estatus:</label>
                    </div>

                    <div class="form-group border-bottom" id="inpCliente">
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

                <div class="cont-form2" id="inpEmpresa">

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
        </div>

        <hr class="hr-line">

        <!-- Navegacion -->
        <div class="m-rl3" id="cont-navegacion">
            <div class="nav-destinos">
                <button class="dest1">Ida</button>
                <button class="dest2">Ida y Vuelta</button>
                <button class="dest3">Multidestino</button>
            </div>
        </div>

        <!-- Rutas -->
        <div class="m-rl3 m-t1 rutas" id="cont-rutas">

            <section id="dest1">

                <form id="fdest1" class="row gap-1 ">
                    <div class="row gap-1 m-t1 nuevaRuta">
                        <div class="col-7">
                            <input type="text" id="cot-det1" class="hidden">
                            <p>Ruta <span>1</span></p>

                            <div class="row ruta-origen hr_separador">

                                <div class="col-6 listados">
                                    <div class="vuelo-titulo">
                                        <select name="rt-origen1" id="rt-origen1" placeholder="">
                                            <option value="">Origen</option>
                                        </select>
                                    </div>
                                    <i class="vuelo-icon fa-solid fa-plane-departure"></i>

                                    <div class="containerSearch origSearch1">
                                        <input placeholder="Buscar..." class="inOrigSrch1" type="search" name="inOrigSrch1">
                                        <i class="fa-solid fa-magnifying-glass"></i>
                                    </div>

                                </div>

                                <div class="separador-icon">
                                    <i class=" fa-solid fa-arrow-right"></i>
                                </div>

                                <div class="col-6 listados">
                                    <div class="vuelo-titulo">
                                        <select name="rt-destino1" id="rt-destino1" placeholder="">
                                            <option value="">Destino</option>
                                        </select>

                                    </div>
                                    <i class="vuelo-icon fa-solid fa-plane-arrival"></i>

                                    <div class="containerSearch destSearch1">
                                        <input placeholder="Buscar..." class="inDestgSrch1" type="search" name="inEmprSrch">
                                        <i class="fa-solid fa-magnifying-glass"></i>
                                    </div>

                                </div>
                            </div>

                        </div>

                        <div class="col-5 row gap-1">
                            <div class="rt-fecha">
                                <label for="rt-fecha1">Fecha:</label>
                                <input type="date" name="rt-fecha1" id="rt-fecha1" placeholder="" />
                            </div>
                            <div class="rt-hora">
                                <label for="rt-hora1">Hora:</label>
                                <input type="time" name="hora_salida" id="rt-hora1">
                            </div>
                            <div class="rt-pax">
                                <label for="rt-pax1">Pax:</label>
                                <input class="pax" type="number" name="" id="rt-pax1" placeholder="0">
                            </div>
                        </div>
                    </div>

                </form>

            </section>

            <section id="dest2" class="hidden">

                <form id="fdest2">
                    <div class="row gap-1 m-t1 nuevaRuta">
                        <div class="col-7">
                            <input type="text" id="cot-detIda1" class="hidden">
                            <p>Ruta <span>1</span></p>
                            <div class="row ruta-origen hr_separador">

                                <div class="col-6">
                                    <div class="vuelo-titulo">
                                        <select name="rt-origIda1" id="rt-origIda1" placeholder="">
                                            <option value=""></option>
                                        </select>

                                    </div>
                                    <i class="vuelo-icon fa-solid fa-plane-departure"></i>
                                    <div class="containerSearch origSearchIda">
                                        <input placeholder="Buscar..." class="inOrigSrchIda" type="search" name="inEmprSrch">
                                        <i class="fa-solid fa-magnifying-glass"></i>
                                    </div>
                                </div>

                                <div class="separador-icon">
                                    <i class=" fa-solid fa-arrow-right"></i>
                                </div>

                                <div class="col-6">
                                    <div class="vuelo-titulo">
                                        <select name="rt-destVue1" id="rt-destVue1" placeholder="">
                                            <option value=""></option>
                                        </select>
                                    </div>
                                    <i class="vuelo-icon fa-solid fa-plane-arrival"></i>
                                    <div class="containerSearch destSearchIda">
                                        <input placeholder="Buscar..." class="inDestSrchIda" type="search" name="inEmprSrch">
                                        <i class="fa-solid fa-magnifying-glass"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-5 row gap-1">
                            <div class="rt-fecha">
                                <label for="rt-fechaIda1">Fecha</label>
                                <input type="date" id="rt-fechaIda1" />
                            </div>
                            <div class="rt-hora">
                                <label for="rt-horaIda1">Hora:</label>
                                <input type="time" name="rt-horaIda1" id="rt-horaIda1">
                            </div>
                            <div class="rt-pax">
                                <label for="rt-paxIda1">Pax</label>
                                <input type="number" class="pax" name="" id="rt-paxIda1" min="0" placeholder="0">
                            </div>
                        </div>
                    </div>

                    <!-- Ruta 2 -->
                    <div class="row gap-1 m-t1 nuevaRuta">
                        <div class="col-7 ">
                            <input type="text" id="cot-detIda2" class="hidden">
                            <p>Ruta <span>2</span></p>
                            <div class="row ruta-origen hr_separador">

                                <div class="col-6">
                                    <div class="vuelo-titulo">
                                        <select name="rt-origIda2" id="rt-origIda2" placeholder="">
                                            <option value=""></option>
                                        </select>
                                    </div>
                                    <i class="vuelo-icon fa-solid fa-plane-departure"></i>
                                    <div class="containerSearch origSearchVue">
                                        <input placeholder="Buscar..." class="inOrigSrchVue" type="search" name="inEmprSrch">
                                        <i class="fa-solid fa-magnifying-glass"></i>
                                    </div>
                                </div>

                                <div class="separador-icon">
                                    <i class=" fa-solid fa-arrow-right"></i>
                                </div>

                                <div class="col-6">
                                    <div class="vuelo-titulo">
                                        <select name="rt-destVue2" id="rt-destVue2" placeholder="">
                                            <option value=""></option>
                                        </select>
                                    </div>
                                    <i class="vuelo-icon fa-solid fa-plane-arrival"></i>
                                    <div class="containerSearch destSearchVue">
                                        <input placeholder="Buscar..." class="inDestSrchVue" type="search" name="inEmprSrch">
                                        <i class="fa-solid fa-magnifying-glass"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-5 row gap-1">
                            <div class="rt-fecha">
                                <label for="rt-fechaIda2">Fecha</label>
                                <input type="date" id="rt-fechaIda2" />
                            </div>
                            <div class="rt-hora">
                                <label for="rt-horaIda2">Hora:</label>
                                <input type="time" name="rt-horaIda2" id="rt-horaIda2">
                            </div>
                            <div class="rt-pax">
                                <label for="rt-paxIda2">Pax</label>
                                <input type="number" class="pax" name="" id="rt-paxIda2" min="0" placeholder="0">
                            </div>
                        </div>
                    </div>

                </form>

            </section>

            <section id="dest3" class="hidden">
                <form id="fdest3">

                    <div class="row gap-1 nuevaRuta">

                        <div class="col-7">
                            <input type="text" id="cot-detMul1" class="hidden">
                            <p>Ruta <span>1</span></p>
                            <div class="row ruta-origen hr_separador">

                                <div class="col-6 listados">
                                    <div class="vuelo-titulo">
                                        <select name="rt-origMul1" id="rt-origMul1" placeholder="">
                                            <option value="">Origen</option>
                                        </select>

                                    </div>
                                    <i class="vuelo-icon fa-solid fa-plane-departure"></i>

                                    <div class="containerSearch origSchMul1">
                                        <input placeholder="Buscar..." class="inOrigSrchMul1" type="search" name="inOrigSrchMul1">
                                        <i class="fa-solid fa-magnifying-glass"></i>
                                    </div>

                                </div>

                                <div class="separador-icon">
                                    <i class=" fa-solid fa-arrow-right"></i>
                                </div>

                                <div class="col-6 listados">
                                    <div class="vuelo-titulo">
                                        <select name="rt-destinoMul1" id="rt-destinoMul1" placeholder="">
                                            <option value="">Destino</option>
                                        </select>

                                    </div>
                                    <i class="vuelo-icon fa-solid fa-plane-arrival"></i>

                                    <div class="containerSearch destSrchMul1">
                                        <input placeholder="Buscar..." class="inDestgSrchMul1" type="search" name="inDestgSrchMul1">
                                        <i class="fa-solid fa-magnifying-glass"></i>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div class="col-5 row gap-1">
                            <div class="rt-fecha">
                                <label for="rt-fechaMul1">Fecha</label>
                                <input type="date" id="rt-fechaMul1" />
                            </div>
                            <div class="rt-hora">
                                <label for="rt-horaMul1">Hora:</label>
                                <input type="time" name="rt-horaMul1" id="rt-horaMul1">
                            </div>
                            <div class="rt-pax">
                                <label for="rt-paxMul1">Pax</label>
                                <input class="pax" type="number" name="" id="rt-paxMul1" min="0" placeholder="0">
                            </div>
                        </div>
                    </div>

                </form>

                <button class="btn btn-mas m-t1" id="btnAddVuelo">Agregar Vuelo</button>

            </section>

        </div>

        <!-- grid  -->
        <div id="cont-detalle">
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

        </div>

        <!-- TOTALES -->
        <form id="formTotales" class="m-rl3">
            <div class="cont-form3">
                <div>
                    <h4 class="tl-azul">Resumen de Totales</h4>
                    <div class="totales_comment">
                        <label for="cot-comment">Comentarios:</label>
                        <textarea name="" id="cot-comment" cols="30" rows="10" placeholder=""></textarea>
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
                    <div class="totales_cont ">
                        <label for="tipo_cambio" class="hidden">Tipo de Cambio:</label>
                        <select class="txt-right hidden" name="tipo_cambio" id="tipo_cambio" placeholder="" disabled>
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

        <!-- Comentarios -->
        <div class="m-rl3 m-t3" id="cont-comment">
            <div class="form-group">
                <textarea name="" id="rt-comment" cols="30" rows="10" placeholder=""></textarea>
                <label for="rt-comment">Comentarios:</label>
            </div>
        </div>

        <!-- Pasajeros  -->
        <section id="costeo-pasajeros" class="costeo-pasajeros m-rl3">
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

        <!-- Asocioar Rutas Con Pasajeros -->
        <section id="costeo-relacion" class="m-rl3">
            <h4 class="tl-azul toggle-relRuta">Relación - Rutas y Pasajeros <span class="arrow"></span></h4>
            <form id="formRelRuta" class="m-rl3 toggle-relRuta-cont">

            </form>
        </section>

        <!-- Botones -->
        <div class="cont-btn txt-center m-t3">
            <button class="btn btn-cancelar m-b2" id="btnCancel">Cancelar</button>
            <button class="btn btn-guardar m-b2" id="btnGuardar">Guardar</button>
            <button class="btn btn-guardar2 m-b2 hidden" id="bt nServicio">Confirmar</button>
        </div>

    </div>

</section>

<script src="/build/js/solCotizacion.js"></script>