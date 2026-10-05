<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Ejercicio 5.10</title>
</head>
<body>

    <h2>Validación de fecha (Ejercicio 5.10)</h2>

    <?php
    if (!empty($errores)) {
        echo "<h3>Errores:</h3>";
        foreach ($errores as $e) {
            echo "- $e <br>";
        }
    }

    if ($fechaValida !== "") {
        echo "<h3>Fecha válida: $fechaValida</h3>";
    }
    ?>

    <form action="<?= $_SERVER['PHP_SELF']; ?>" method="POST">
        <label>
            Introduce una fecha (dd/mm/yyyy):
            <input type="text" name="fecha" value="<?php echo $fecha; ?>">
        </label>
        <br><br>

        <button type="submit">Validar</button>
    </form>

</body>
</html>
