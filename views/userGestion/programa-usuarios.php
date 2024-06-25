<section class="contenedor--sm center-hv m-t3">
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

<section class="contenedor-altas">
    <div class="contenedor--sm center-hv" id="contenedor">
        <div class="flex-titulo">
            <h3 id="user-title">Usuarios</h3>
        </div>

        <form id="formAltas" class="cont-form">
            <div class="hidden">
                <input type="text" id="usuario_id">
            </div>
        </form>

        <div class="quickFilterContent m-tb2">
            <div class="form-dsg">
                <div class="form-group">
                    <input type="text" id="searchInput1" placeholder="" autocomplete="off" oninput="filtrarTabla('#myGrid2', this.value)">
                    <label for="searchInput1">Buscar</label>
                </div>
            </div>
        </div>

        <!-- AG-Grid -->
        <div class="grid-progRole">
            <div id="myGrid2" class="ag-theme-balham"></div>
        </div>

        <div class="cont-btn txt-center m-t3">
            <button class="btn btn-cancelar m-b2" id="btnCancel">Cancelar</button>
            <button class="btn btn-guardar m-b2" id="btnGuardar">Guardar</button>
        </div>

    </div>
</section>


<script src="/build/js/progUser.js"></script>