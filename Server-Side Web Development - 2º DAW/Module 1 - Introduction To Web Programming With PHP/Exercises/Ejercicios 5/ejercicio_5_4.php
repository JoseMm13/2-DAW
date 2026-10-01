<!--
    Nombre: José Ángel García Martínez. 2ºDAW-Semi
    30/09/2026
    Ejercicio 4: Formulario.
-->
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ejercicio 4: Formulario.</title>
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
        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            $fechaNacimiento = $_POST['fecha'];
            $email = $_POST['email'];
            $observaciones = $_POST['observaciones'];

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