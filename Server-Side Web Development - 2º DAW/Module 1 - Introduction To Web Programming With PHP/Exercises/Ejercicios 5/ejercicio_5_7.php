<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Inicializar variables evitando errores en la primera carga
$fecha = trim($_POST['fecha'] ?? "");
$email = trim($_POST['email'] ?? "");
$observaciones = trim($_POST['observaciones'] ?? "");

// Evitar código HTML
$fecha = htmlspecialchars($fecha);
$email = htmlspecialchars($email);
$observaciones = htmlspecialchars($observaciones);

$errores = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Validación de fecha
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
}

// Cargar la vista
require 'views/ejercicio_5_7.view.php';
?>
