<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

$fecha = trim($_POST['fecha'] ?? "");
$errores = [];
$fechaValida = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // 1. Validación con expresión regular (dd/mm/yyyy)
    if (!preg_match('/^\d{2}\/\d{2}\/\d{4}$/', $fecha)) {
        $errores[] = "La fecha debe tener el formato dd/mm/yyyy.";
    } else {

        // 2. Validación real con DateTime
        $obj = DateTime::createFromFormat('d/m/Y', $fecha);

        if (!$obj || $obj->format('d/m/Y') !== $fecha) {
            $errores[] = "La fecha no es válida.";
        } else {
            $fechaValida = $obj->format('d/m/Y');
        }
    }
}

require 'views/ejercicio_5_10.view.php';
