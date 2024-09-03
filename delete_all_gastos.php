<?php
include 'db_connection.php';

$sql = "DELETE FROM gastos";
$conn->query($sql);

echo "Todos los gastos han sido eliminados.";
?>
