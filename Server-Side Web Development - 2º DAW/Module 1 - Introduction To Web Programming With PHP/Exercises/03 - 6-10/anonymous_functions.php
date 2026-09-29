<!-- 
    Nombre: José Ángel García Martínez. 2ºDAW-Semi
    29/09/2026
    Ejercicio 10: Funciónes anónimas.
-->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ejercicio 10: Funciones anónimas.</title>
</head>
<body>
    <?php 
        function operacion(int $a, int $b,  callable $funcion){
            return $funcion($a, $b);
        }

        $suma = function($x, $y){
            return $x + $y;
        };

        $resta = function($x, $y){
            return $x - $y;
        };

        $multiplicacion = function($x, $y){
            return $x * $y;
        };

        $division = function($x, $y) {
            return $y !== 0 ? $x / $y : "Error: división por cero";
        };

        echo "Suma: " . operacion(10, 5, $suma) . "<br>";
        echo "Resta: " . operacion(10, 5, $resta) . "<br>";
        echo "Multiplicación: " . operacion(10, 5, $multiplicacion) . "<br>";
        echo "División: " . operacion(10, 5, $division) . "<br>";
     ?>
</body>
</html>