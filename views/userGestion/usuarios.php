<section class="contenedor--md center-hv m-t3">
    <div class="flex-titulo">
        <h3><?php echo $titulo; ?></h3>
        <a class="btn btn-crear" id="crear-usuario"><i class="fa-solid fa-user-plus"></i></a>
    </div>

    <!-- DATA TAbles -->
    <!-- <table id="myTable" class="display"></table> -->

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
                <input type="text" id="usuario_id">
            </div>

            <div class="cont-form2">

                <div class="form-group ">
                    <input type="text" id="nombre_completo" placeholder="" maxlength="100" autocomplete="off">
                    <label for="nombre_completo" class="labelImportant">Nombre Completo:</label>
                </div>
                <div class="form-group ">
                    <input type="text" id="nombre_user" placeholder="" maxlength="60" autocomplete="off">
                    <label for="nombre_user" class="labelImportant">Nombre de Usuario:</label>
                </div>
                <div class="form-group ">
                    <input type="password" id="password" placeholder="" maxlength="30" autocomplete="none">
                    <label for="password" class="labelImportant">Contraseña:</label>
                </div>
                <div class="form-group">
                    <select name="estatus_user" id="estatus_user" placeholder="">
                        <option value="" disabled></option>
                        <option value="Activo" selected>Activo</option>
                        <option value="Inactivo">Inactivo</option>
                    </select>
                    <label for="estatus_user" class="labelImportant">Estatus:</label>
                </div>

                <div class="form-group">
                    <select name="empleado_user" id="empleado_user" placeholder="">
                        <option value=""></option>
                    </select>
                    <label for="empleado_user">Empleado:</label>

                    <div class="containerSearch empleadoSearch">
                        <input placeholder="Buscar..." class="inEmplSrch" type="search">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </div>
                </div>

                <div class="form-group">
                    <select name="rol_user" id="rol_user" placeholder="">
                        <option value=""></option>
                    </select>
                    <label for="rol_user">Rol:</label>

                    <div class="containerSearch rolSearch">
                        <input placeholder="Buscar..." class="inRollSrch" type="search">
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

<script src="/build/js/usuarios.js"></script>