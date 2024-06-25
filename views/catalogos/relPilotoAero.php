<section class="contenedor--sm center-hv m-t3">
    <div class="flex-titulo">
        <h3><?php echo $titulo; ?></h3>
        <a class="btn btn-crear" id="crear-pilotoAero">
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

<section class="contenedor-altas ">
    <div class="contenedor--sm center-hv" id="contenedor">
        <div class="flex-titulo">
            <h3>Agregar Relación</h3>
        </div>

        <form id="formAltas" class="form-aeronave m-t3">

            <div class="hidden">
                <input type="text" id="piloto_aero_id">
            </div>

            <div class="cont-form2">
                <div class="form-group">
                    <select name="piloto_id" id="piloto_id" placeholder="">
                        <option value=""></option>
                    </select>
                    <label for="piloto_id" class="labelImportant">Nombre Piloto:</label>

                    <div class="containerSearch pilotoSearch">
                        <input placeholder="Buscar..." class="inPilotoSrch" type="search">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>
                </div>

                <div class="form-group">
                    <select name="aeronave_id" id="aeronave_id" placeholder="">
                        <option value=""></option>
                    </select>
                    <label for="aeronave_id" class="labelImportant">Aeronave:</label>

                    <div class="containerSearch aeroSearch">
                        <input placeholder="Buscar..." class="inAeroSrch" type="search">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>
                    
                </div>
            </div>
        </form>

        <div class="cont-btn txt-center m-t3">
            <button class="btn btn-cancelar m-b2" id="btnCancel">Cancelar</button>
            <button class="btn btn-guardar m-b2" id="btnGuardar">Guardar</button>
        </div>
    </div>
</section>


<script src="/build/js/pilotoAero.js"></script>