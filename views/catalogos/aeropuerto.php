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
    <div class="contenedor--sm center-hv" id="contenedor">
        <div class="flex-titulo">
            <h3>Aeropuerto</h3>
        </div>

        <form id="formAltas" class="form-aeronave m-t3">

            <div class="hidden">
                <input type="text" id="aeropuerto_id">
            </div>

            <div class="cont-form3">
                <div class="form-group form-consesionario">
                    <input type="text" id="nombre" placeholder="" maxlength="100">
                    <label for="nombre" class="labelImportant">Nombre:</label>
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
                    <input type="text" id="codigo_iata" placeholder="" maxlength="3">
                    <label for="codigo_iata" class="labelImportant">Código IATA:</label>
                </div>
                <div class="form-group">
                    <input type="text" id="codigo_icao" placeholder="" maxlength="4">
                    <label for="codigo_icao">Código ICAO:</label>
                </div>
                <div class="form-group">
                    <input type="text" id="costo_tua" placeholder="" maxlength="14">
                    <label for="costo_tua">Costo TUA:</label>
                </div>
            </div>

            <div class="cont-form3">
                <div class="form-group">
                    <input type="text" id="pais" placeholder="" maxlength="60">
                    <label for="pais">País:</label>
                </div>
                <div class="form-group">
                    <input type="text" id="estado" placeholder="" maxlength="60">
                    <label for="estado">Estado:</label>
                </div>
                <div class="form-group">
                    <input type="text" id="municipio" placeholder="" maxlength="60">
                    <label for="municipio">Municipio:</label>
                </div>
            </div>

            <div class="cont-form3">
                <div class="form-group form-consesionario">
                    <input type="text" id="concesionario" placeholder="" maxlength="255">
                    <label for="concesionario">Concesionario:</label>
                </div>
                <div class="form-group">
                    <input type="text" id="permisionario" placeholder="" maxlength="60">
                    <label for="permisionario">Permisionario:</label>
                </div>
            </div>

            <div class="cont-form3">

                <div class="form-group">
                    <input type="text" id="latitud" placeholder="" maxlength="60">
                    <label for="latitud">Latitud:</label>
                </div>
                <div class="form-group">
                    <input type="text" id="longitud" placeholder="" maxlength="60">
                    <label for="longitud">Longitud:</label>
                </div>
                <div class="form-group">
                    <input type="text" id="altitud" placeholder="" maxlength="60">
                    <label for="altitud">Altitud:</label>
                </div>

            </div>



        </form>

        <div class="cont-btn txt-center m-t3">
            <button class="btn btn-cancelar m-b2" id="btnCancel">Cancelar</button>
            <button class="btn btn-guardar m-b2" id="btnGuardar">Guardar</button>
        </div>
    </div>
</section>


<script src="/build/js/aeropuerto.js"></script>