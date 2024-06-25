<?php

foreach ($alertas as $key => $alerta) {
    foreach ($alerta as $mensaje) {
?>
        <div class="txt-left alerta alerta_<?php echo $key; ?>">
            <?php echo $mensaje; ?>
        </div>
<?php
    }
}
?>
 