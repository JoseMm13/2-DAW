<!-- 
    Nombre: José Ángel García Martínez. 2ºDAW-Semi
    29/09/2026
    Ejercicio 6: Función insert.
-->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ejercicio 6: Funcion insert SQL.</title>
</head>
<body>
    <?php 
        function insert($table, $param) {
            $nombres = implode(", ", array_keys($param));
            $valores = ":" .implode(", :", array_keys($param));

            return sprintf("INSERT INTO %s (%s) VALUES (%s)", $table, $nombres, $valores);
        }

        // Insertamos un dato
        $datos = [
            "nombre" => "José Ángel",
            "edad" => 28,
            "ciudad" => "Alicante",
            "email" => "joseangel@prueba.com"
        ];

        echo insert("Usuarios",$datos);

     ?>
</body>
</html>