<!-- 
    Nombre: José ángel García Martínez. 2ºDAW-Semi
    29/09/2026
    Ejercicio 14: Operadores.
-->
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ejercicio 14: Operadores.</title>
</head>
<body>
    <?php 
        $numero = $_GET['numero'] ?? null;
        if($numero === null){
            echo "No se ha recibido ningún número";
        } else {
            $comparacion =$numero <=> 10;

            if($comparacion === -1){
                echo "El número es menor que 10";
            }elseif($comparacion === 0){
                echo "El número es igual a 10";
            }else{
                echo "El número es igual a 10";
            }
        }
    ?>
</body>
</html>