<!-- 
    Nombre: José Ángel García Martínez. 2ºDAW-Semi
    Fecha: 23/09/2026.
    Ejercicio 2.Cadenas
-->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ejercicio 2 : Cadenas2.</title>
</head>
<body>
    <?php
        $url = 'https://usuario:clave@midominio.com:8080/ruta/archivo.php?producto=libro&precio=20#seccion2';
        $partes = parse_url($url);

        echo "Protocolo utilizado: " . ($partes['scheme'] ?? 'No existe') . "<br>";
        echo "Nombre de usuario: " . ($partes['user'] ?? 'No existe') . "<br>";
        echo "Path de la URL: " . ($partes['path'] ?? 'No existe') . "<br>";
        echo "Querystring: " . ($partes['query'] ?? 'No existe') . "<br>";
    ?>
</body>
</html>
