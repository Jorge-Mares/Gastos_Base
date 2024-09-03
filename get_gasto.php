<?php
header('Content-Type: application/json');
include 'db_connection.php'; 

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id > 0) {
    $query = "SELECT id, descripcion, costo, categoria FROM gastos WHERE id = $id";
    $result = mysqli_query($conn, $query);

    if ($result && mysqli_num_rows($result) > 0) {
        $gasto = mysqli_fetch_assoc($result);
        echo json_encode($gasto);
    } else {
        echo json_encode(['error' => 'Gasto no encontrado']);
    }
} else {
    echo json_encode(['error' => 'ID inválido']);
}
?>
