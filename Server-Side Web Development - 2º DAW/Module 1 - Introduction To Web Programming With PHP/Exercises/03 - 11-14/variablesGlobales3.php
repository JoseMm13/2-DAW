<!-- 
    Nombre: José ángel García Martínez. 2ºDAW-Semi
    29/09/2026
    Ejercicio 12: Variables superglobales.
-->
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ejercicio 12: Variables Superglobales.</title>
</head>
<body>
    <?php 
        function getRequestMethd(){
            return $_SERVER['REQUEST_URI'];
        }
        echo "Método usado: " . getRequestMethd();
    ?>
</body>
</html>