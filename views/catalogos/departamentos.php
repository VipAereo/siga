<section class="contenedor--sm center-hv m-t3">
    <div class="flex-titulo">
        <h3><?php echo $titulo; ?></h3>
        <a class="btn btn-crear" id="crear-departamento"><i class="fa-solid fa-plus" title="Crear Departamento"></i></a>
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
                <input type="text" id="departamento_id">
            </div>

            <div class="cont-form2">

                <div class="form-group">
                    <input type="text" id="nombre" placeholder="" maxlength="60">
                    <label for="nombre" class="labelImportant">Nombre Departamento:</label>
                </div>

                <div class="form-group">
                    <select name="estatus" id="estatus">
                        <option value=""></option>
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                    </select>
                    <label for="estatus">Estatus:</label>
                </div>

            </div>

        </form>

        <div class="cont-btn txt-center m-t3">
            <button class="btn btn-cancelar m-b2" id="btnCancel">Cancelar</button>
            <button class="btn btn-guardar m-b2" id="btnGuardar">Guardar</button>
        </div>
    </div>

</section>

<script src="/build/js/departamentos.js"></script>