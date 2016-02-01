var instance = "prod";

if (instance == "prod"){
	var baseurl = 'api/';
	var imageurl = 'https://apps.popety.com/temp_images/';
}else if (instance == "dev"){
	var baseurl = 'http://n2.transparent.sg:9999/api/';
}else if(instance == "local"){
	var baseurl = 'http://localhost:9999/api/';
	var imageurl = 'http://localhost:9999/temp_images/';
}
