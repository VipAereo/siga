<section class="contenedor--md center-hv m-t3">
    <div class="flex-titulo">
        <h3><?php echo $titulo; ?></h3>
        <a class="btn btn-crear" id="crear-prod">
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

<section class="contenedor-altas productos">
    <div class="contenedor--md center-hv " id="contenedor">
        <div class="flex-titulo">
            <h3><?php echo $titulo; ?></h3>
        </div>

        <!-- Encabezado -->
        <form id="formAltas" class="m-rl3 m-t3">
            <div class="hidden">
                <input type="text" id="producto_id">
            </div>

            <div class="cont-form2">

                <div class="form-group">
                    <input type="text" id="nombre" placeholder="">
                    <label for="nombre" class="labelImportant">Nombre:</label>
                </div>

                <div class="form-group">
                    <select name="categoria_id" id="categoria_id" placeholder="">
                        <option value=""></option>
                    </select>
                    <label for="categoria_id" class="labelImportant">Categoria:</label>

                    <div class="containerSearch categSearch">
                        <input placeholder="Buscar..." class="inCategSrch" type="search" name="inCategSrch">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>

                </div>

                <div class="form-group">
                    <input type="text" id="descripcion" placeholder="">
                    <label for="descripcion">Descripción:</label>
                </div>

                <div class="form-group">
                    <input type="text" id="precio" placeholder="">
                    <label for="precio" class="labelImportant">Precio:</label>
                </div>



            </div>


        </form>

        <!-- Botones -->
        <div class="cont-btn txt-center m-t3">
            <button class="btn btn-cancelar m-b2" id="btnCancel">Cancelar</button>
            <button class="btn btn-guardar m-b2" id="btnGuardar">Guardar</button>
        </div>

    </div>
</section>

<script src="/build/js/producto.js"></script>