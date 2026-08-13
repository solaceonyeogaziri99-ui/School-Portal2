<?php
include "database.php";
session_start();

// echo "<pre>";
// print_r($_POST);
// echo "</pre>";

// exit();

$fullname = $_POST["fullName"];
$department = $_POST["department"];
$phone = $_POST["phone"];
$email = $_POST["email"];
$currentPassword = $_POST["currentPassword"];
$newPassword= $_POST["newPassword"];
$confirmNewPassword = $_POST["confirmNewPassword"];

if(!isset($_SESSION["user_id"])){
    die("User ID not found in session");
}

// logged in user's id
$user_id = $_SESSION["user_id"];

// Change password only if user entered a new one
if (!empty($newPassword) || !empty($confirmNewPassword)) {

    if (empty($currentPassword)) {
        die("Current password is required");
    }

    $query = "SELECT password FROM registered_students WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();

    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if (!$user) {
        die("User not found");
    }

    if (!password_verify($currentPassword, $user["password"])) {
        die("Current password is incorrect");
    }

    if ($newPassword !== $confirmNewPassword) {
        die("New passwords do not match");
    }

    if (strlen($newPassword) < 8) {
        die("Password must be at least 8 characters");
    }

    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

    $query = "UPDATE registered_students SET password = ? WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("si", $hashedPassword, $user_id);

    if (!$stmt->execute()) {
        die("Failed to update password");
    }
}

if(isset($_FILES["profilePicture"]) && $_FILES["profilePicture"]["error"] === 0){

    $filename = time() . "_" . $_FILES["profilePicture"]["name"];

    move_uploaded_file(
        $_FILES["profilePicture"]["tmp_name"],
        "uploads/" . $filename
    );

    $query = "UPDATE registered_students
              SET full_name = ?,
                  department = ?,
                  phone = ?,
                  email = ?,
                  picture = ?
              WHERE id = ?";

    $stmt = $conn->prepare($query);

    $stmt->bind_param(
        "sssssi",
        $fullname,
        $department,
        $phone,
        $email,
        $filename,
        $user_id
    );

} else {

    $query = "UPDATE registered_students
              SET full_name = ?,
                  department = ?,
                  phone = ?,
                  email = ?
              WHERE id = ?";

    $stmt = $conn->prepare($query);

    $stmt->bind_param(
        "ssssi",
        $fullname,
        $department,
        $phone,
        $email,
        $user_id
    );
}

if($stmt->execute()){
    echo "success";
} else {
    echo $stmt->error;
}