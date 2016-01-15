var instance = "local";

if (instance == "dev"){
	var baseurl = 'http://n2.transparent.sg:9999/api/';
}else if(instance == "local"){
	var baseurl = 'http://localhost:9999/api/';
}
