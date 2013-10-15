<?php
	$config = json_decode(file_get_contents("config.json"), true);
	$data = json_decode(file_get_contents("php://input"), true);

	$url = "http://api.openkeyval.org/{$config["key"]}";
	$fields = array(
		"data" => $data["history"]
	);

	$ch = curl_init();
	curl_setopt($ch,CURLOPT_URL, $url);
	curl_setopt($ch,CURLOPT_POST, TRUE);
	curl_setopt($ch,CURLOPT_POSTFIELDS, $fields);

	$result = curl_exec($ch);
	curl_close($ch);
?>