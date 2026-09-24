
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadenas repaso </title>
</head>
<body>
    <?php
        $cadena="   Esto es un ejercicio con PHP.  ";
        echo $cadena;
        echo "</br>";
        echo "Eliminando espacios del principio y del final: ", trim($cadena);
        echo "</br>";
        echo "Eliminando espacios del principio: ", ltrim($cadena);
        echo "</br>";
        echo "Eliminando espacios  del final: ", rtrim($cadena);
        echo "</br>";
        $cadena="/Esto es un ejercicio con PHP.//";
        echo "Eliminando espacios del principio y del final: ", trim($cadena, '/');
        echo "</br>";
        $cadena="HOLA ESTO ES UNA CADENA DE PRUEBA";
        echo "Cadena en mayúsculas: ", strtoupper($cadena);
        echo "</br>";
        echo "Cadena en minúsculas: ", strtolower($cadena);
        echo "</br>";
        echo "Cadena con la primera en mayuscula y el resto en minúsculas: ", ucfirst(strtolower($cadena));
        echo "</br>";
        echo "Código ASCII de la primera palabra es: ", ord($cadena[0]); //-> [0] 1º 
        echo "</br>";
        $cadena = "José Ángel Martínez Martínez";
        echo "Longítud del nombre: ", strlen($cadena);
        echo "</br>";
        $cadena = "EstA frase Alberga la cantidad de aes ";
        echo "Cantidad de AES: ", substr_count(strtolower($cadena), "a");
        echo "</br>";
        echo "Cantidad de AES: ", substr_count(strtolower($cadena), "a");
        echo "</br>";
        echo "Primera posición de 'a': ";
        $posPrimeraA = stripos($cadena, "a");
        echo ($posPrimeraA !== false) ? $posPrimeraA : -1;
        echo "</br>";
        echo "Última posición de 'a': ";
        $posUltimaA = strripos($cadena, "a");
        echo ($posUltimaA !== false) ? $posUltimaA : -1;
        echo "</br>";
        $cadena = "Los códigos son infalibles para php y albion.";
        echo "Sustituyendo 'o' por '0': ", str_ireplace("o", "0", $cadena);
        echo "</br>";
        echo "¿Comienza por 'al'?: ";
        echo str_starts_with(strtolower($cadena), "al") ? "Sí" : "No";
        echo "</br>";
    ?>
</body>
</html>
