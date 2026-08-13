<?php
include 'database.php';
session_start();

if(!isset($_SESSION["user_id"])){
    die("User ID not found in session");
}

// logged in user's id
$user_id = $_SESSION["user_id"];

$complaintTitle = $_POST["complaintTitle"];
$complaintCategory = $_POST["complaintCategory"];
$complaintDescription = $_POST["complaintDescription"];
// $evidencePicture = $_FILES["evidencePicture"]["name"];

if (
    empty($complaintTitle) ||
    empty($complaintCategory) ||
    empty($complaintDescription)
) {
    echo "All fields are required";
    exit();
}

$uploadedImages = [];

// echo "<pre>";
// print_r($_FILES);
// echo "</pre>";

if (!empty($_FILES["evidencePicture"]["name"][0])) {

    foreach ($_FILES["evidencePicture"]["name"] as $key => $fileName) {

        $image = time() . "_" . $fileName;
        $temp = $_FILES["evidencePicture"]["tmp_name"][$key];

        if (move_uploaded_file($temp, "complaint_uploads/" . $image)) {
            $uploadedImages[] = $image;
        }
    }
}

$image = implode(",", $uploadedImages);

$query = "INSERT INTO complaints
(student_id, category, complaint_title, complaint_message, attachment)
VALUES (?, ?, ?, ?, ?)";

$stmt = $conn->prepare($query);

$stmt->bind_param(
    "issss",
    $user_id,
    $complaintCategory,
    $complaintTitle,
    $complaintDescription,
    $image
);

if ($stmt->execute()) {
    echo "success";
} else {
    echo "Error: " . $stmt->error;
}
?>