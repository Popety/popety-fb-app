var instance = "dev";

if (instance == "dev"){
	var socketUrl = 'http://tradealert.fountaintechies.com:5555/';
}else if(instance == "local"){
	var socketUrl = 'http://localhost:5555';
}
