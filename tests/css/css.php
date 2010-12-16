<?php

header('Content-Type: text/css');
$num = basename($_SERVER['REQUEST_URI'], '.css');
echo '#item_' . $num . ' { z-index:' . $num  . '; }';
