<?php
// $host = "Localhost";
// $user = "root";
// $password = "";
// $database = "user_system";

$conn = new mysqli("localhost", "root", "", "student_portal");

if($conn->connect_error) {
    die("Connection failed" . $conn->connect_error);
}

?>