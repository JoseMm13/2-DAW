<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

$datos = [
    ["fecha" => "2000/01/01", "email" => "ejemplo1@mail.com", "observaciones" => "Texto de prueba 1"],
    ["fecha" => "1999/05/20", "email" => "ejemplo2@mail.com", "observaciones" => "Texto de prueba 2"]
];

$fecha = trim($_POST['fecha'] ?? "");
$email = trim($_POST['email'] ?? "");
$observaciones = trim($_POST['observaciones'] ?? "");

$fecha = htmlspecialchars($fecha);
$email = htmlspecialchars($email);
$observaciones = htmlspecialchars($observaciones);

$errores = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if (!DateTime::createFromFormat('Y/m/d', $fecha)) {
        $errores[] = "La fecha no tiene el formato correcto (Y/m/d).";
    }

    if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
        $errores[] = "El email no es válido.";
    }

    if ($observaciones === "") {
        $errores[] = "Las observaciones no pueden estar vacías.";
    }

    // Si no hay errores → añadir nueva fila al array
    if (empty($errores)) {
        $datos[] = [
            "fecha" => $fecha,
            "email" => $email,
            "observaciones" => $observaciones
        ];
    }
}

require 'views/ejercicio_5_8.view.php';
