<!-- 
    Nombre: José Ángel García Martínez. 2ºDAW-Semi
    Fecha: 24/09/2026.
    Ejercicio 3.Fechas
-->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Eejrcicio 3: Fechas.</title>
</head>
<body>
    <?php 
        echo "Fecha y hora actuales con formato (dd/mm/yyyy hh:mm:ss): ". date("d/m/Y H:i:s") . "<br>";

        echo "Nombre de la zona horaria (por defecto): ". date_default_timezone_get() . "<br>";

        echo "Fecha dentro de 45 días: " . date("d/m/Y", strtotime("+45 days")) . "</br>";

        $hoy = time();
        $UnoDeEnero = strtotime("1 January"); 
        $dias = ($hoy - $UnoDeEnero) / 86400;
        echo "Días que han pasado desde el 1 de Enero: " . floor($dias) . " días. </br>";

        date_default_timezone_set("America/New_York");
        echo "Fecha y hora actual en Nueva York: " . date("d/m/Y H:i:s");

        echo "Día de la semana del 1 de enero: " . date("l", strtotime("1 January")) . "<br>";
     ?>
</body>
</html>