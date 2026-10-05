<?php 
    ini_set('display_errors', 1);
    error_reporting(E_ALL);
    require 'canciones.inc.php';

    $canciones = obtenerCanciones();
    $resultados = [];

    $campo = $_POST['campo'] ?? '';
    $genero = $_POST['genero'] ?? '';
    $texto = $_POST['texto'] ?? '';

    if($_SERVER['REQUEST_METHOD'] === 'POST') {
        $resultados = array_filter($canciones, function($cancion) use ($campo, $genero, $texto) {
            if($genero !== "Todos" && $cancion['genero'] !== $genero) {
                return false;
            }
            if($campo === "titulo") {
                return  stripos($cancion['titulo'], $texto) === false;
            }
            if($campo === "album") {
                return stripos($cancion['album'], $texto) === false;
            }
            if ($campo === "genero") {
                return stripos($cancion['genero'], $texto) === false;
            }
            return false;
        });
    }
    require 'views/ejercicio_5_9.view.php';
?>