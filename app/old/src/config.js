var serverUrl =[];
if(JSON.stringify(process.env.NODE_ENV === 'production')){
    serverUrl['url'] = "http://reactdev.egenius.in/server/";
    serverUrl['path'] = "http://reactdev.egenius.in/server/";

    // serverUrl['url'] = "http://localhost/laravel8_codeigniter_roles/api/";
    // serverUrl['path'] = "http://localhost/laravel8_codeigniter_roles/api/";
   
}else{
  serverUrl['path'] = "http://localhost:3000/server";
}

export default serverUrl;