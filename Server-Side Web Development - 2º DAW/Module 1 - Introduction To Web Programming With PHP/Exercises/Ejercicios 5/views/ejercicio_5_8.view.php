<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Ejercicio 5.8</title>
</head>
<body>

<h2>Formulario Ejercicio 5.8</h2>

<?php
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
        <input type="text" name="fecha" value="<?php echo $fecha; ?>">
    </label>
    <br><br>

    <label>
        Email:
        <input type="email" name="email" value="<?php echo $email; ?>">
    </label>
    <br><br>

    <label>
        Observaciones:
        <textarea name="observaciones"><?php echo $observaciones; ?></textarea>
    </label>
    <br><br>

    <button type="submit">Enviar</button>
</form>

<hr>

<h2>Datos almacenados</h2>

<table border="1" cellpadding="5">
    <tr>
        <th>Fecha</th>
        <th>Email</th>
        <th>Observaciones</th>
    </tr>

    <?php foreach ($datos as $fila): ?>
        <tr>
            <td><?php echo $fila["fecha"]; ?></td>
            <td><?php echo $fila["email"]; ?></td>
            <td><?php echo $fila["observaciones"]; ?></td>
        </tr>
    <?php endforeach; ?>
</table>

</body>
</html>
