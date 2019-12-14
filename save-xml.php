<?php
if (isset($_POST)){
    if(!file_exists("config/carte-consos.xml")){
        echo "erreur: fichier XML non-existant";
    }
    $text = $_POST["xmlfile"];
    file_put_contents("config/carte-consos.xml", $text);

    header('Location: index.html');
}
?>
