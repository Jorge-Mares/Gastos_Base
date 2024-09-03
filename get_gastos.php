<?php
include 'db_connection.php';

$sql = "SELECT * FROM gastos";
$result = $conn->query($sql);

$gastos = [];
while ($row = $result->fetch_assoc()) {
    $gastos[] = $row;
}

header('Content-Type: application/json');
echo json_encode($gastos);
?>
