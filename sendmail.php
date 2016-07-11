<?php
  $name = $_POST['name'];
  $email = $_POST['email'];
  $msg = $_POST['msg'];

  $to = "andrey.semenoff@gmail.com";
//  $to = "scorpion_antares@bigmir.net";
  $subject = "Cообщение из localhost";

  if (mail( $to, $subject, $msg, "From: ".$email)) {
    echo "Mail sent successfully!";
  } else {
    echo "some error happen";
  }
