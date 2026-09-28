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
        echo "<h1>Ejercicio 4. Arrays</h1>";
        $alumnos = ["Gloria", "Sergio", "Jose Angel","Aitor", "Oscar", "Tania"];
        echo "Número de alumnos: " . count($alumnos);
        echo "<br> <br>";

        echo "<b>Cadena de alumnos: </b>" . implode(" ", $alumnos);
        echo "<br><br>";
        
        $aleatorio = $alumnos;
        shuffle($aleatorio);
        echo " <b>Array en orden aleatorio: </b><br>";
        foreach ($aleatorio as $nombre) 
        {
            echo $nombre . " ";
        }
        echo "<br><br>";   

        $ordenado = $alumnos;
        sort($ordenado);

        echo "<b>Array ordenado alfabéticamente: </b><br>";
        foreach ($ordenado as $nombre) 
        {
            echo $nombre . " ";
        }
        echo "<br><br>";

        echo "<b>Alumnos con al menos una 'a': </b><br>";
        foreach ($alumnos as $nombre) 
        {
            if (stripos($nombre, "a") !== false) 
                {
                echo $nombre . " ";
            }
        }
        echo "<br><br>";

        $inverso = array_reverse($alumnos);
        echo "<b>Array en orden inverso: </b><br>";
        foreach($inverso as $nombre)
        {
            echo $nombre . " ";
        }
        echo "<br><br>";

        $posicion = array_search("Jose Angel", $alumnos);

        echo "<b>Posición de tu nombre está en el array: </b>";
        echo ($posicion !== false) ? $posicion : "No se encuentra";
        echo "<br><br>";
    ?>
</body>
</html>