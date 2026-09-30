<!--
    Nombre: José Ángel García Martínez. 2ºDAW-Semi
    30/09/2026
    Ejercicio 3: Ejercicio_5_3 Llamada get
-->
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ejercicio 3: Llamada get</title>
</head>
<body>
    <?php
        $nombre = $_GET['nombre'] ?? '';
        
        echo "Bienvenido $nombre!!!";
    ?>
</body>
</html>