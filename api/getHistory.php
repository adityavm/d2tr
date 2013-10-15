<?php
	header("Content-type:text/json");
	
	$config = json_decode(file_get_contents("config.json"), true);
	$url = "http://api.openkeyval.org/{$config["key"]}";
	echo file_get_contents($url);
?>