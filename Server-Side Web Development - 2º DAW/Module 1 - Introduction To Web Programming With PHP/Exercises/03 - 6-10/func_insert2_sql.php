<!-- 
    Nombre: José Ángel García Martínez. 2ºDAW-Semi
    29/09/2026
    Ejercicio 7: Función insert2.
-->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ejercicio 7: Función insert 2 SQL.</title>
</head>
<body>
    <?php 
        function insert2($table, $param, $booleanParam = true) {
            $nombres = implode(", ", array_keys($param));
            $valores = ":" .implode(", :", array_keys($param));

            if($booleanParam){
                return sprintf("INSERT INTO %s (%s) VALUES (%s)", $table, $nombres, $valores);
            }else{
                return sprintf("INSERT INTO %s  VALUES (%s)", $table, $valores);
            }
        }

        // Insertamos un dato
        $datos = [
            "nombre" => "José Ángel",
            "edad" => 28,
            "ciudad" => "Alicante",
            "email" => "joseangel@prueba.com"
        ];

        echo insert2("Usuarios", $datos);
        echo insert2("Usuarios", $datos, false);

     ?>
</body>
</html>