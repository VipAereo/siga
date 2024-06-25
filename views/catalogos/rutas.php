<section class="contenedor--lg center-hv m-t3">
    <div class="flex-titulo">
        <h3><?php echo $titulo; ?></h3>
        <a class="btn btn-crear" id="crear-ruta">
            <i class="fa-solid fa-plus"></i>
        </a>
    </div>

    <!-- AG-Grid -->
    <div class="quickFilterContent m-tb2">
        <div class="form-dsg">
            <div class="form-group">
                <input type="text"  id="searchInput" placeholder="" autocomplete="off" oninput="filtrarTabla('#myGrid', this.value)">
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
            <h3>Gestionar Ruta</h3>
        </div>

        <form id="formAltas" class="m-rl3 m-t3">

            <div class="hidden">
                <input type="text" id="ruta_id">
            </div>

            <div class="cont-form1">
                <div class="form-group">
                    <select name="aeropuerto_id" id="aeropuerto_id" placeholder="">
                        <option value=""></option>
                    </select>
                    <label for="aeropuerto_id" class="labelImportant">Aeropuerto:</label>

                    <div class="containerSearch aeropSearch">
                        <input placeholder="Buscar..." name="inAeropSrch" class="inAeropSrch" type="search">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>
                </div>
            </div>

            <div class="cont-form2">
                <div class="form-group">
                    <select name="origen" id="origen" placeholder="">
                        <option value=""></option>
                    </select>
                    <label for="origen" class="labelImportant">Origen:</label>

                    <div class="containerSearch origenSearch">
                        <input placeholder="Buscar..." name="inOrigenSrch" class="inOrigenSrch" type="search">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>
                </div>
                <div class="form-group">
                    <select name="destino" id="destino">
                        <option value=""></option>
                    </select>
                    <label for="destino" class="labelImportant">Destino:</label>

                    <div class="containerSearch destinoSearch">
                        <input placeholder="Buscar..." name="inDestinoSrch" class="inDestinoSrch" type="search">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>
                </div>
            </div>

            <div class="cont-form2">
                <div class="form-group">
                    <input type="text" id="distancia" placeholder="" maxlength="15" class="txt-right" disabled>
                    <label for="distancia">Distancia:</label>
                </div>
                <div class="form-group">
                    <select name="estado_ruta" id="estado_ruta">
                        <option value="" disabled selected></option>
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                    </select>
                    <label for="estado_ruta">Estatus:</label>
                </div>
            </div>

        </form>

        <div class="cont-btn txt-center m-t3">
            <button class="btn btn-cancelar m-b2" id="btnCancel">Cancelar</button>
            <button class="btn btn-guardar m-b2" id="btnGuardar">Guardar</button>
        </div>

    </div>
</section>


<script src="/build/js/rutas.js"></script>