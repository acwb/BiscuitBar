<?php
    $text = file_get_contents('config/carte-consos.backup.xml');
	file_put_contents("config/carte-consos.xml", $text);
    header('Location: index.html');
?> 