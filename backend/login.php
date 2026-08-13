<?php
session_start();

include "database.php";

$matric = $_POST["matric"] ?? '';
$password = $_POST["password"] ?? '';

if(empty($matric) || empty($password)) {
    echo "fields can't be empty";
    exit();
}

$query = "SELECT id, full_name, password, role FROM registered_students WHERE matric_number = ?";
$stmt = $conn->prepare($query);

$stmt->bind_param("s", $matric);
$stmt->execute();

$stmt->bind_result($id, $full_name, $hashed_password, $role);

if (!$stmt->fetch()) {
    echo "Not Found, Matric Number Not Registered";
    exit();
}

// verify password
if(!password_verify($password, $hashed_password)) {
    echo "incorrect password";
    exit();
}

//success
$_SESSION['user_id'] = $id;
$_SESSION['full_name'] = $full_name;
$_SESSION['role'] = $role;// user or admin
echo $role; // sends role back
?>