<?php
include 'db_connection.php';

$id = $_POST['id'];

$sql = "DELETE FROM gastos WHERE id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $id);
$stmt->execute();

echo "Gasto eliminado exitosamente.";
?>
