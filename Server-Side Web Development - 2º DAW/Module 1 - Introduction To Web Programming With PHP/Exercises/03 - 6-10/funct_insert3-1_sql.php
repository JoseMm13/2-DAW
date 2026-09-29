<!-- 
    Nombre: José Ángel García Martínez. 2ºDAW-Semi
    29/09/2026
    Ejercicio 9: Función insert 3 + Modificaciones.
-->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ejercicio 9: Función insert 3.1 SQL.</title>
</head>
<body>
    <?php 
        declare(strict_types=1);
        function insert3(string $table, array $param, string &$cadena) {
            $cadena = "INSERT INTO tabla (campos) VALUES (valores)";
            $cadena = str_replace("tabla", $table, $cadena);

            $nombres = implode(", ", array_keys($param));
            $cadena = str_replace("campos", $nombres, $cadena);

            $valores = ":" . implode(", :", array_keys($param));
            $cadena = str_replace("valores", $valores, $cadena);
        }

        // Insertamos un dato
        $datos = [
            "nombre" => "José Ángel",
            "edad" => 28,
            "ciudad" => "Alicante",
            "email" => "joseangel@prueba.com"
        ];

        $resultado ="";
        insert3("Usuarios", $datos, $resultado);
        echo $resultado;
        
     ?>
</body>
</html>