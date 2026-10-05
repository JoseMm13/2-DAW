<!--
    Nombre: José Ángel García Martínez. 2ºDAW-Semi
    30/09/2026
    Ejercicio 6: Formulario.
-->
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ejercicio 6: Formulario.</title>
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
        $fechaNacimiento = trim($_POST['fecha'] ?? "");
        $email = trim($_POST['email'] ?? "");
        $observaciones = trim($_POST['observaciones'] ?? "");

        $fecha = htmlspecialchars($fechaNacimiento);
        $email = htmlspecialchars($email);
        $observaciones = htmlspecialchars($observaciones);

        $errores = [];

        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            if (!DateTime::createFromFormat('Y/m/d', $fecha)) {
                $errores[] = "La fecha no tiene el formato correcto (Y/m/d).";
            }

            // Validación de email
            if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
                $errores[] = "El email no es válido.";
            }

            // Validación de observaciones
            if ($observaciones === "") {
                $errores[] = "Las observaciones no pueden estar vacías.";
            }

            // Mostrar resultados
            if (empty($errores)) {
                echo "<h3>Datos válidos recibidos:</h3>";
                echo "Fecha: $fecha <br>";
                echo "Email: $email <br>";
                echo "Observaciones: $observaciones <br>";
            } else {
                echo "<h3>Errores encontrados:</h3>";
                foreach ($errores as $e) {
                    echo "- $e <br>";
                }
            }
        } else {
            echo "No se ha enviado el formulario";
        }
    ?>
</body>
</html>