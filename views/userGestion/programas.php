<section class="contenedor--md center-hv m-t3">
    <div class="flex-titulo">
        <h3><?php echo $titulo; ?></h3>
        <a class="btn btn-crear" id="crear-programa"><i class="fa-solid fa-plus"></i></i></a>
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
            <h3><?php echo $titulo; ?></h3>
        </div>

        <form id="formAltas" class="m-rl3 m-t3">

            <div class="hidden">
                <input type="text" id="programa_id">
            </div>

            <div class="cont-form2">

                <div class="form-group">
                    <input type="text" id="nombre" placeholder="" maxlength="60">
                    <label for="nombre" class="labelImportant">Nombre del Programa:</label>
                </div>
                <div class="form-group">
                    <input type="text" id="ruta" placeholder="" maxlength="60">
                    <label for="ruta">Ruta:</label>
                </div>

                <div class="form-group">
                    <select name="padre" id="padre">
                        <option value=""></option>
                    </select>
                    <label for="padre">Menu al que pertenecerá:</label>
                    
                    <div class="containerSearch menuSearch">
                        <input placeholder="Buscar..." class="inMenuSrch" type="search">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>
                </div>

                <div class="form-group">
                    <input type="text" id="nivel" placeholder="" maxlength="60" value="1" disabled>
                    <label for="nivel" class="labelImportant">Nivel de Profundidad:</label>
                </div>

            </div>

        </form>

        <div class="cont-btn txt-center m-t3">
            <button class="btn btn-cancelar m-b2" id="btnCancel">Cancelar</button>
            <button class="btn btn-guardar m-b2" id="btnGuardar">Guardar</button>
        </div>

    </div>
</section>

<div id="listKey"></div>

<script src="/build/js/programas.js"></script>