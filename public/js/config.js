var instance = "dev";

if (instance == "prod"){
	var baseurl = 'http://apps.popety.com:4444/api/';
}else if (instance == "dev"){
	var baseurl = 'http://n2.transparent.sg:9999/api/';
}else if(instance == "local"){
	var baseurl = 'http://localhost:9999/api/';
}
