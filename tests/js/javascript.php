<?php
header('Content-Type: text/javascript');
header("Expires: Thu, 31 Dec 2020 20:00:00 GMT");
$subject = $_SERVER['REQUEST_URI'];
$pattern = '/\/sleep-(\d+)\//';
preg_match($pattern, $subject, $matches);
if (sizeof($matches) > 1) {
  sleep($matches[1]);
}
echo 'window.' . basename($_SERVER['REQUEST_URI'], '.js') . ' = true;';
