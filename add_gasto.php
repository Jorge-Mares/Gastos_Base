<?php
include 'db_connection.php';

$descripcion = $_POST['descripcion'];
$costo = $_POST['costo'];
$categoria = $_POST['categoria'];

$sql = "INSERT INTO gastos (descripcion, costo, categoria) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param('sds', $descripcion, $costo, $categoria);
$stmt->execute();

echo "Gasto agregado exitosamente.";
?>
