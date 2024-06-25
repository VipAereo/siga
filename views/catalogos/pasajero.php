<section class="contenedor--sm center-hv m-t3">
    <div class="flex-titulo">
        <h3><?php echo $titulo; ?></h3>
        <a class="btn btn-crear" id="crear-pax">
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


<section class="contenedor-altas pasajeros">

    <div class="contenedor--md center-hv " id="contenedor">
        <div class="flex-titulo">
            <h3><?php echo $titulo; ?></h3>
        </div>

        <!-- Encabezado -->
        <form id="formAltas" class="m-rl3 m-t3">

            <div class="hidden">
                <input type="text" id="pasajero_id">
            </div>

            <div class="cont-form2">
                <div class="form-group">
                    <input type="text" id="nombre" placeholder="">
                    <label for="nombre" class="labelImportant">Nombre:</label>
                </div>
                <div class="form-group">
                    <select name="nacionalidad" id="nacionalidad" placeholder="">
                        <option value="" disabled>Elige una opción</option>
                        <option value="N">Nacional</option>
                        <option value="I">Internacional</option>
                    </select>
                    <label for="nacionalidad">Nacionalidad:</label>
                </div>
            </div>

            <div class="cont-form1">

                <div class="fomr-group">
                    <label for="docPax">Documentos:</label>
                    <input name="docPax" id="docPax" type="file" accept="image/*">
                </div>

            </div>

            <div id="contenedor-docs" class="flex gap-1">

            </div>

        </form>

        <!-- Botones -->
        <div class="cont-btn txt-center m-t3">
            <button class="btn btn-cancelar m-b2" id="btnCancel">Cancelar</button>
            <button class="btn btn-guardar m-b2" id="btnGuardar">Guardar</button>
        </div>

    </div>

</section>

<script src="/build/js/pasajero.js"></script>