<?php 
include("../../dbconn.php");
	$q=pg_query("SELECT * FROM bodegas order by bodegas ASC") or die(pg_last_error());
	$str = "";
	while($row=pg_fetch_array($q)){
		$str.=$row['bodega'] . "@" .  $row['id']."|";
	}	
	
	echo substr($str, 0,-1);
	


?>