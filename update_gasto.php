<?php
include 'db_connection.php';

$id = $_POST['id'];
$descripcion = $_POST['descripcion'];
$costo = $_POST['costo'];
$categoria = $_POST['categoria'];

$sql = "UPDATE gastos SET descripcion=?, costo=?, categoria=? WHERE id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('sdsi', $descripcion, $costo, $categoria, $id);
$stmt->execute();

echo "Gasto actualizado exitosamente.";
?>
