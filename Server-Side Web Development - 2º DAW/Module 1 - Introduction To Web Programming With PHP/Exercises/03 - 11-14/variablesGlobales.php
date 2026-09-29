<!-- 
    Nombre: José ángel García Martínez. 2ºDAW-Semi
    29/09/2026
    Ejercicio 11: Variables superglobales.
-->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ejercicio 11: Variables Superglobales.</title>
</head>
<body>
    <?php 
        function obtenerUriSinFowardSlash(){
            $uri = $_SERVER['REQUEST_URI'];
            return ltrim($uri, '/');
        }

        echo obtenerUriSinFowardSlash();
    ?>
</body>
</html>