<?php
  $name = $_POST['name'];
  $email = $_POST['email'];
  $msg = $_POST['msg'];

  $to = "andrey.semenoff@gmail.com";
  $subject = "Cообщение из localhost";

//  if (mail( $to, $subject, $msg, "From: ".$email)) {
  if ( true ) {
    echo "Mail sent successfully!";
  } else {
    echo "some error happen";
  }
