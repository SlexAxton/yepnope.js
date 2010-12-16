<?php
header('Content-Type: text/javascript');
$qs = '';
if (isset($_GET['sleep'])) {
  sleep($_GET['sleep']);
  $qs = '?sleep=' . $_GET['sleep'];
}
echo 'window.' . basename($_SERVER['REQUEST_URI'], '.js' . $qs) . ' = true;';
