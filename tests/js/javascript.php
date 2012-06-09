<?php
header('Content-Type: text/javascript');
if ( strrpos( $_SERVER['REQUEST_URI'], 'no-cache' ) === FALSE ) {
	header("Expires: Thu, 31 Dec 2020 20:00:00 GMT");
} else {
	$pretty_modtime = gmdate('D, d M Y H:i:s', time() - 2000) . 'GMT'; 
	header("Last-Modified: $pretty_modtime"); 
	header("Expires: $pretty_modtime"); 
	header("Pragma: no-cache"); 
}
$subject = $_SERVER['REQUEST_URI'];
$pattern = '/\/sleep-(\d+)\//';
preg_match($pattern, $subject, $matches);
if (sizeof($matches) > 1) {
  sleep($matches[1]);
}

$name = basename(array_shift(explode('?', $_SERVER['REQUEST_URI'])), '.js');

echo 'window.' . $name . 'time = (+new Date);';
echo 'window.' . $name . ' = true;';
