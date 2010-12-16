<?php
header("Expires: Thu, 31 Dec 2020 20:00:00 GMT");
header('Content-Type: text/css');
$qs = '';
if (isset($_GET['sleep'])) {
  sleep($_GET['sleep']);
  $qs = '?sleep=' . $_GET['sleep'];
}
$num = basename($_SERVER['REQUEST_URI'], '.css' . $qs);
echo '#item_' . $num . ' { z-index:' . $num  . '; }';
