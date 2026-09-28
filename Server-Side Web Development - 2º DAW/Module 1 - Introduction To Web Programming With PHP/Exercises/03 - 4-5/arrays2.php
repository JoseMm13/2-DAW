<!-- 
    Nombre: José Ángel García Martínez. 2ºDAW-Semi
    28/09/2026
    Ejercicio 4: Arays
-->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Apartado 3: Ejercicio 4. Arrays</title>
</head>
<body>
    <?php
        $alumnos  = [
            ["id" => 1, "nombre" => "Gloria", "edad" => 29 ],
            ["id" => 2, "nombre" => "Sergio", "edad" => 32 ],
            ["id" => 3, "nombre" => "Jose Angel", "edad" => 28 ],
            ["id" => 4, "nombre" => "Aitor", "edad" => 33 ],
            ["id" => 5, "nombre" => "Oscar", "edad" => 34 ],
            ["id" => 6, "nombre" => "Tania", "edad" => 30 ]
        ];

        echo "<h2>Tabla de alumnos</h2>";

        echo "<table border='1' cellpadding='5'>";
        echo "<tr><th>ID</th><th>Nombre</th><th>Edad</th></tr>";

        foreach ($alumnos as $alumno) 
        {
            echo "<tr>";
            echo "<td>" . $alumno["id"] . "</td>";
            echo "<td>" . $alumno["nombre"] . "</td>";
            echo "<td>" . $alumno["edad"] . "</td>";
            echo "</tr>";
        }

        echo "</table><br><br>";

        
        $soloNombres = array_column($alumnos, "nombre");

        echo "<h3>Array con solo los nombres:</h3>";
        foreach ($soloNombres as $nombre) {
            echo $nombre . "<br>";
        }

        echo "<br><hr><br>";

        $numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        // Suma con array_sum
        $suma = array_sum($numeros);

        echo "Suma de los 10 números: $suma<br><br>";

        // Multiplicación utilizando array_reduce
        $multiplicacion = array_reduce($numeros, function($acc, $n) {
            return $acc * $n;
        }, 1);

        echo "Multiplicación de los 10 números: $multiplicacion<br><br>";
    ?>
</body>
</html>