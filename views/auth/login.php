<section class="centrado center-hv vh-100">

    <div class="contenedor--lg row cont-login">

        <div class="gray col-5 center login">
            <p class="bg-white">Iniciar Sesión</p>
        </div>

        <div class="col-7 m-t2">

            <div class="txt-center form-dsg ">

                <div class="">
                    <img loading="lazy" width="80" height="80" src="build/img/fluter_icon.png" alt="Logo SIGA">
                    <p class="login__titulo">SI<span>GA</span></p>
                </div>

                <?php
                    // require_once __DIR__ . '/../templates/alertas.php';
                ?>

                <form>
                    <div class="cont-form1">
                        <div class="form-group">
                            <input type="text" class="form_txt" placeholder="" id="nombre_user" name="nombre_user" maxlength="60" value="<?php echo $usuario->nombre_user ?? ''; ?>" autocomplete="off">
                            <label for="nombre_user">Tu Usuario</label>
                        </div>
                        <div class="form-group">
                            <input type="password" placeholder="" id="password" name="password" autocomplete="current-password">
                            <label for="password">Tu Contraseña</label>
                        </div>
                    </div>

                </form>

                <div class="m-b5">
                    <button class="btn btn-login" id="logeo">Iniciar Sesión</button>
                </div>

            </div>
        </div>
    </div>
</section>

<script src="/build/js/login.js"></script>