<?php

header('Content-Type: text/css');
$qs = '';
if (isset($_GET['sleep'])) {
  sleep($_GET['sleep']);
  $qs = '?sleep=' . $_GET['sleep'];
}
$num = basename($_SERVER['REQUEST_URI'], '.css' . $qs);
echo '#item_' . $num . ' { z-index:' . $num  . '; }';
