<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Ejercicio 5.7</title>
</head>
<body>

<h2>Formulario Ejercicio 5.7</h2>

<?php
// Mostrar errores si existen
if (!empty($errores)) {
    echo "<h3>Errores encontrados:</h3>";
    foreach ($errores as $e) {
        echo "- $e <br>";
    }
}
?>

<form action="<?= $_SERVER['PHP_SELF']; ?>" method="POST">

    <label>
        Fecha de nacimiento:
        <input type="text" name="fecha" value="<?= $fecha ?>">
    </label>
    <br><br>

    <label>
        Email:
        <input type="email" name="email" value="<?= $email ?>">
    </label>
    <br><br>

    <label>
        Observaciones:
        <textarea name="observaciones"><?= $observaciones ?></textarea>
    </label>
    <br><br>

    <button type="submit">Enviar</button>
</form>

</body>
</html>
