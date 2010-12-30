<?php
header('Content-Type: text/css');
header("Expires: Thu, 31 Dec 2020 20:00:00 GMT");

$qs = '';
if (isset($_GET['sleep'])) {
  sleep($_GET['sleep']);
  $qs = '?sleep=' . $_GET['sleep'];
}

$num = basename($_SERVER['REQUEST_URI'], '.css' . $qs);
echo '#item_' . str_replace(',','',$num) . ' { color: rgb(' . $num . '); }';
