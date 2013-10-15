<?php
	header("Content-type:text/json");
	echo file_get_contents("http://api.dotaprj.me/rankings/v150/api.json");
?>