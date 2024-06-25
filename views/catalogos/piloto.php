<section class="contenedor--md center-hv m-t3">
    <div class="flex-titulo">
        <h3><?php echo $titulo; ?></h3>
        <a class="btn btn-crear" id="crear-piloto">
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
            <h3>Piloto</h3>
        </div>

        <form id="formAltas" class="form-aeronave m-t3">

            <div class="hidden">
                <input type="text" id="piloto_id">
            </div>

            <div class="cont-form3">

                <div class="form-group">
                    <select name="empleado_id" id="empleado_id" placeholder="">
                        <option value=""></option>
                    </select>
                    <label for="empleado_id" class="labelImportant">Nombre Piloto:</label>

                    <div class="containerSearch pilotosSearch">
                        <input placeholder="Buscar..." class="inPilotoSrch" type="search">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>

                </div>

                <div class="form-group">
                    <input type="text" id="licencia" placeholder="" maxlength="100">
                    <label for="licencia" class="labelImportant">Licencia:</label>
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

            <div class="cont-form3">
                <div class="form-group">
                    <input type="text" id="tipo_licencia" placeholder="" maxlength="100">
                    <label for="tipo_licencia">Tipo de Licencia:</label>
                </div>
                <div class="form-group">
                    <input type="date" id="vence_licencia" placeholder="" maxlength="100">
                    <label for="vence_licencia">Vigencia:</label>
                </div>
                <div class="form-group">
                    <input type="text" id="horas_vuelo" placeholder="" maxlength="100">
                    <label for="horas_vuelo">Horas Vuelo:</label>
                </div>
            </div>

        </form>

        <div class="cont-btn txt-center m-t3">
            <button class="btn btn-cancelar m-b2" id="btnCancel">Cancelar</button>
            <button class="btn btn-guardar m-b2" id="btnGuardar">Guardar</button>
        </div>
    </div>
</section>

<script src="/build/js/pilotos.js"></script>