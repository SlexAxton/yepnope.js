<?php

	header('Content-Type: text/javascript');
	echo 'window.' . basename($_SERVER['REQUEST_URI'], '.js') . ' = true;';