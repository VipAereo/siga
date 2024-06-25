<header class="header center js-sb">
    <div class="header_logo m-left2 ">
        <a href="/"></a>
    </div>
    <div class="header_cuenta m-right2 row">
        <div class="header_perfil col4 m-tb1">
            <img class="img_profile" src="../build/img/perfil.jpg" alt="">
        </div>
        <div class="header_info col4 row">
            <div class="col6"><?php echo $_SESSION['nombre_user']; ?></div>
        </div>
        <div class="header_icon col4 ">
            <i class="fas fa-angle-down"></i>
        </div>

        <div class="header_icon_info ocultar" id="perfilInfo">
            <img class="img_profile m-t1" src="../build/img/perfil.jpg" alt="">
            <p> <?php echo $_SESSION['nombre_user']; ?> </p>
            <p> <?php echo "Sistemas Full" ?> </p>

            <hr class="hr_separador">
            <div class="item">
                <a class="m-left1" href="/logout">Log Out</a>
            </div>
            <hr class="hr_separador">
        </div>
        
    </div>
</header>

<!-- Responsive BURGER-->
<div class="navigation_menu">
    <div class="burger" id="burger-menu">
        <input type="checkbox" class="menu" name="cbxMenu" onclick="toggleMenu()">
    </div>
</div>

<nav id="menu" class="ocultar">
    <ul class="menu-item">
    </ul>
</nav>
<!-- Responsive BURGER -->

<nav class="navigation ">
    <ul class="navigation_list flex "></ul>
</nav>

<div class="secciones"></div>

<script src="/build/js/header.js" defer></script>