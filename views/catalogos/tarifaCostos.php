<section class="contenedor--md center-hv m-t3">

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
                <input type="text" id="costo_id">
            </div>

            <div class="cont-form2">
                <div class="form-group">
                    <select name="aeronave_id" id="aeronave_id" placeholder="">
                        <option value=""></option>
                    </select>
                    <label for="aeronave_id" class="labelImportant">Aeronave:</label>

                    <div class="containerSearch aeronSearch">
                        <input placeholder="Buscar..." class="inAeronSrch" type="search" name="inAeronSrch">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>
                </div>

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

                <!-- <div class="form-group">
                    <input type="text" id="preferencia" placeholder="" maxlength="60">
                    <label for="preferencia" class="labelImportant">Nombre Preferencia:</label>
                </div> -->

                <div class="form-group">
                    <input type="text" id="costo_mx" placeholder="" maxlength="15">
                    <label for="costo_mx">Costo Nacional:</label>
                </div>
                <div class="form-group">
                    <input type="text" id="costo_usd" placeholder="" maxlength="15">
                    <label for="costo_usd">Costo Internacional:</label>
                </div>

            </div>

        </form>

        <div class="cont-btn txt-center m-t3">
            <button class="btn btn-cancelar m-b2" id="btnCancel">Cancelar</button>
            <button class="btn btn-guardar m-b2" id="btnGuardar">Guardar</button>
        </div>

    </div>
</section>

<script src="/build/js/tarifaCostos.js"></script>