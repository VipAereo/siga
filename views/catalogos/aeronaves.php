<section class="contenedor--lg center-hv m-t3">
    <div class="flex-titulo">
        <h3><?php echo $titulo; ?></h3>
        <a class="btn btn-crear" id="crear-aeronave">
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

    <div class="contenedor--md center-hv" id="contenedor">

        <div class="flex-titulo">
            <h3><?php echo $titulo; ?></h3>
        </div>

        <form id="formAltas" class="form-aeronave m-t3">

            <div class="hidden">
                <input type="text" id="aeronave_id">
            </div>

            <div class="cont-form3">
                <div class="form-group">
                    <input type="text" id="modelo" placeholder="" maxlength="60">
                    <label for="modelo" class="labelImportant">Modelo:</label>
                </div>
                <div class="form-group">
                    <input type="text" id="matricula" placeholder="" maxlength="60">
                    <label for="matricula" class="labelImportant">Matricula:</label>
                </div>
                <div class="form-group">
                    <input type="text" id="ktas" placeholder="" maxlength="8">
                    <label for="ktas" class="labelImportant">Velocidad Ktas:</label>
                </div>
            </div>

            <div class="cont-form3">
                <div class="form-group">
                    <input type="text" id="fabricante" placeholder="" maxlength="60">
                    <label for="fabricante" class="labelImportant">Fabricante:</label>
                </div>
                <div class="form-group">
                    <input type="text" id="numero_serie" placeholder="" maxlength="60">
                    <label for="numero_serie">Número Serie:</label>
                </div>
                <div class="form-group">
                    <input type="number" id="anio_fabricante" placeholder="" min="1900" max="9999">
                    <label for="anio_fabricante">Año Fabricante:</label>
                </div>
            </div>

            <div class="cont-form3">
                <div class="form-group">
                    <input type="number" id="asientos" placeholder="" maxlength="60">
                    <label for="asientos">Asientos:</label>
                </div>
                <div class="form-group">
                    <input type="date" id="ultima_revision" placeholder="" maxlength="60">
                    <label for="ultima_revision">Ultima Revisión:</label>
                </div>
                <div class="form-group">
                    <input type="number" id="horas" placeholder="" maxlength="60">
                    <label for="horas">Horas:</label>
                </div>
            </div>

            <div class="cont-form2">

                <div class="form-group">
                    <select name="estado_actual" id="estado_actual">
                        <option value="" disabled selected></option>
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                        <option value="Mantenimiento">En Mantenimiento</option>
                    </select>
                    <label for="estado_actual">Estado Actual:</label>
                </div>

                <div class="form-group">
                    <input type="date" id="fecha_retiro" placeholder="" maxlength="60">
                    <label for="fecha_retiro">Fecha Retiro:</label>
                </div>

            </div>

        </form>

        <div class="cont-btn txt-center m-t3">
            <button class="btn btn-cancelar m-b2" id="btnCancel">Cancelar</button>
            <button class="btn btn-guardar m-b2" id="btnGuardar">Guardar</button>
        </div>
    </div>

</section>

<script src="/build/js/aeronaves.js"></script>