<section class="contenedor--lg center-hv m-t3">
    <div class="flex-titulo">
        <h3><?php echo $titulo; ?></h3>
        <a class="btn btn-crear" id="crear-tarifa">
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

<section class="contenedor-altas">
    <div class="contenedor--sm center-hv" id="contenedor">
        <div class="flex-titulo">
            <h3>Gestionar Tarifa</h3>
        </div>

        <form id="formAltas" class="m-rl3 m-t3">

            <div class="hidden">
                <input type="text" id="tarifa_id">
            </div>

            <div class="cont-form1">
                <div class="form-group">
                    <select name="ruta_id" id="ruta_id" placeholder="">
                        <option value=""></option>
                    </select>
                    <label for="ruta_id" class="labelImportant">Ruta:</label>
                    
                    <div class="containerSearch rutaSearch">
                        <input placeholder="Buscar..." class="inRutaSrch" type="search" name="inRutaSrch">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>

                </div>
            </div>

            <div class="cont-form2">
                <div class="form-group">
                    <select name="aeronave_id" id="aeronave_id" placeholder="">
                        <option value=""></option>
                    </select>
                    <label for="aeronave_id">Aeronave:</label>
                                        
                    <div class="containerSearch aeronSearch">
                        <input placeholder="Buscar..." class="inAeronSrch" type="search" name="inAeronSrch">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>
                </div>
                <div class="form-group">
                    <input type="text" id="tiempo_estimado" placeholder="">
                    <label for="tiempo_estimado">Tiempo Estimado:</label>
                </div>
                <div class="form-group">
                    <input type="text" id="concepto" placeholder="" maxlength="255">
                    <label for="concepto">Concepto:</label>
                </div>
                <div class="form-group">
                    <select name="tipo_vuelo" id="tipo_vuelo" placeholder="">
                        <option value="" disabled></option>
                        <option value="N" selected>Nacional</option>
                        <option value="I">Internacional</option>
                    </select>
                    <label for="tipo_vuelo" class="labelImportant">Tipo de Vuelo:</label>
                </div>
            </div>

            <div class="cont-form3">
                <div class="form-group">
                    <input type="text" id="costo" placeholder="" maxlength="15" class="txt-right">
                    <label for="costo" class="labelImportant">Costo:</label>
                </div>
                <div class="form-group">
                    <input type="text" id="impuesto" placeholder="" maxlength="15">
                    <label for="impuesto">Impuesto:</label>
                </div>
                <div class="form-group">
                    <input type="text" id="descuento" placeholder="" maxlength="15">
                    <label for="descuento">Descuento:</label>
                </div>
            </div>

        </form>

        <div class="cont-btn txt-center m-t3">
            <button class="btn btn-cancelar m-b2" id="btnCancel">Cancelar</button>
            <button class="btn btn-guardar m-b2" id="btnGuardar">Guardar</button>
        </div>

    </div>
</section>

<script src="/build/js/tarifas.js"></script>