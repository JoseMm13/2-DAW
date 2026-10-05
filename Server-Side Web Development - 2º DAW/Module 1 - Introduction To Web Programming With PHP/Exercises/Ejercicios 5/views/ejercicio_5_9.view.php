<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Ejercicio 5.9</title>
</head>
<body>

<h2>Búsqueda de canciones</h2>

<form action="<?= $_SERVER['PHP_SELF']; ?>" method="POST">

    <label>Texto a buscar:</label>
    <input type="text" name="texto" value="<?php echo $texto; ?>">
    <br><br>

    <label>Buscar en:</label><br>
    <input type="radio" name="campo" value="titulo" <?php if($campo==="titulo") echo "checked"; ?>> Títulos de canción<br>
    <input type="radio" name="campo" value="album" <?php if($campo==="album") echo "checked"; ?>> Nombres de álbum<br>
    <input type="radio" name="campo" value="ambos" <?php if($campo==="ambos") echo "checked"; ?>> Ambos campos<br><br>

    <label>Género musical:</label>
    <select name="genero">
        <?php
        $generos = ["Todos", "Blues", "Jazz", "Pop", "Rock"];
        foreach ($generos as $g) {
            $sel = ($genero === $g) ? "selected" : "";
            echo "<option $sel>$g</option>";
        }
        ?>
    </select>

    <br><br>
    <button type="submit">Buscar</button>
</form>

<hr>

<h2>Resultados</h2>

<?php if (!empty($resultados)): ?>
    <table border="1" cellpadding="5">
        <tr>
            <th>Título</th>
            <th>Álbum</th>
            <th>Género</th>
        </tr>

        <?php foreach ($resultados as $c): ?>
            <tr>
                <td><?php echo $c["titulo"]; ?></td>
                <td><?php echo $c["album"]; ?></td>
                <td><?php echo $c["genero"]; ?></td>
            </tr>
        <?php endforeach; ?>
    </table>
<?php else: ?>
    <p>No se encontraron resultados.</p>
<?php endif; ?>

</body>
</html>
