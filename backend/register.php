<?php
include "database.php";

// collect data from form
$fullname = $_POST["fullName"];
$matric = $_POST["matric"];
$profilePicture = $_FILES["profilePicture"]["name"];
$department = $_POST["department"];
$gender = $_POST["gender"];
$dob = $_POST["dob"];
$phone = $_POST["phone"];
$email = $_POST["email"];
$password = $_POST["password"];
$confirmPassword = $_POST["confirmPassword"];


$allowed_gender = ['Male', 'Female', 'Prefer Not To Say'];//allowed gender


$role = "user";


if(empty($fullname) || empty($matric) || empty($profilePicture) || empty($department) 
|| empty($gender) || empty($dob) || empty($phone) || empty($email ) || empty($password) || empty($confirmPassword)){
    echo "All fields are required";
    exit();
}

if(!in_array($gender, $allowed_gender)) {
    echo "invalid gender value";
    //confirm invalid gender
    exit();
}

if ($password !== $confirmPassword) {
    echo "Passwords do not match.";
    exit();
}

// to check valid matric number
$query = "Select * FROM allowed_students WHERE matric_number = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $matric);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 0) {
    echo "Matric is Invalid, get in touch with admin";
    exit();
}

// for duplicate matric number
$query = "SELECT id FROM registered_students WHERE matric_number = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $matric);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo "This matric number has already been registered.";
    exit();
}


// To confirm image type
$allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

if (!in_array($_FILES['profilePicture']['type'], $allowedTypes)) {
    echo "Only JPG and PNG images are allowed";
    exit();
}

// IMAGE Name to avoid duplicate image by users
$image = time() . "_" . $_FILES["profilePicture"]["name"];

$temp = $_FILES["profilePicture"]["tmp_name"];

// move picture file
if (!move_uploaded_file($temp, "uploads/" . $image)) {
    echo "Failed to upload image";
    exit();
}

// hash password
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// insert user into database
$query = "INSERT INTO registered_students
(full_name, matric_number, phone, picture, department, gender, dob, email, password, role)
VALUES (?,?,?,?,?,?,?,?,?,?)";

$stmt = $conn->prepare($query);
$stmt->bind_param("ssssssssss", $fullname, $matric, $phone, $image, $department, $gender, $dob, $email, $hashed_password, $role);

if($stmt->execute()) {
    echo "success";
} else {
    echo "Error: " . $stmt->error;
}




?>