<!--
    Nombre: José Ángel García Martínez. 2ºDAW-Semi
    30/09/2026
    Ejercicio 5: Formulario.
-->
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ejercicio 5: Formulario.</title>
</head>
<body>
    <form action="?= $_SERVER['PHP_SELF']; ?>" method="POST">
        <label>
            Fecha de nacimiento:
            <input type="date" name="fecha">
        </label>
        <br><br>
        <label>
            Email:
            <input type="email" name="email">
        </label>
        <br><br>
        <label>
            Observaciones:
            <textarea name="observaciones"></textarea>
        </label>
        <br><br>
        <button type="submit">Enviar</button>
    </form>

    <?php
        $fechaNacimiento = $_POST['fecha'] ?? "";
        $email = $_POST['email'] ?? "";
        $observaciones = $_POST['observaciones'] ?? "";
        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            
            echo "<h3>Datos recibidos: </h3><br>";
            echo "Fecha de nacimiento: $fechaNacimiento <br>";
            echo "Email: $email <br>";
            echo "Observaciones: $observaciones <br>";
        } else {
            echo "No se ha enviado el formulario";
        }
    ?>
</body>
</html>

<!-- 
    En este caso para el ejercicio 5, cuando se pregunta cual es mejor utilizar si
    Primero comprobando si se hay datos en POST con: 
    if ($_SERVER['REQUEST_METHOD'] === 'POST') { … } 
    
    o utilizar:
    Segundo utilizando el operador de fusión nula ¿? 
    $fecha = $_POST['fecha'] ?? ""; 

    Respuesta: En caso de un formulario no hay ninguna mejor, se deben utilizar ambos,
    para comprobar si se envian datos y para evitar errores de variables indefinidas.
    Ya que si utilizamos el operador de fusión nula sin comprobar si se han enviado datos, 
    dará un error de variable indefinida, y si utilizamos la comprobación de si se han enviado 
    datos sin el operador de fusión nula, dará un error de variable indefinida al intentar 
    acceder a una variable que no existe.

-->