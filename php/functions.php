<?php

require 'vendor/autoload.php';

/**
 * Отправка письма с сайта
 *
 */

function sendEmail() {

  $name = $_POST['name'];
  $email = $_POST['email'];
  $sub = "Письмо с сайта портфолио";
  $msg = $_POST['msg'];

  if( is_Valid()['result'] ) {
    $mail = new PHPMailer;

    $mail->setFrom($name, $email);
    $mail->addAddress('andrey.semenoff@gmail.com', 'Andrey Semenoff');

    $mail->isHTML(true);

    $mail->Subject = $sub;
    $mail->Body    = $msg;

    if(!$mail->send()) {
      $return['type'] = 'error';
      $return['text'] = 'Ошбика отправки сообщения. Приносим извинения за временные неудобства!';
      $return['info'] = $mail->ErrorInfo;
    } else {
      $return['type'] = 'success';
      $return['text'] = 'Сообщение успешно отправлено!<br> Спасибо за обращение!';
    }

    return json_encode($return);
  } else {
    return json_encode(array(
        'type' => 'error',
        'text' => 'Ошибка валидации! Заполните форму и отправьте сообщение еще раз!',
        'info' => is_Valid()
    ));
  }
}

/**
 * Валидация данных с форм сайта
 *
 */

function is_Valid() {

  $array = array(
      'name' => $_POST['name'],
      'email' => $_POST['email'],
      'msg' => $_POST['msg'],
  );
  $v = new Valitron\Validator( $array );

  $v->rule('required', ['name', 'email', 'msg']);

  $v->rule('lengthMin', 'name', 2);
  $v->rule('email', 'email');
  $v->rule('lengthMin', 'msg', 5);

  if($v->validate()) {
    return [
      'result' => true
    ];
  } else {
    // Errors
    return [
      'result' => false,
      'error' => $v->errors()
    ];
  }
}