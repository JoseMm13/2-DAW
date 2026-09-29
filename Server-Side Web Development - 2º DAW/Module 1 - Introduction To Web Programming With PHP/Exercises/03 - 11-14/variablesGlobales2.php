<!-- 
    Nombre: José ángel García Martínez. 2ºDAW-Semi
    29/09/2026
    Ejercicio 12: Variables superglobales.
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
        function obtenerUriSinQueryString(){
            $uri = $_SERVER['REQUEST_URI'];
            
            $ruta = parse_url($uri, PHP_URL_PATH);
            return ltrim($ruta, '/');
        }
        echo obtenerUriSinQueryString();
    ?>
</body>
</html>