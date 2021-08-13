export function AuthHelper(module,type) {
  let permissions = JSON.parse(localStorage.user).module_permissions;
  let result = false;
  if (permissions) {
      permissions.forEach(element => {
      if(element.name == module && element[type] == 1){
          result = true;
      }  
      if(element.child){
        element.child.map(el=>{
         if(el.name == module && el[type] == 1){
             result = true;
         }
        })
      }
      });
   }
   return result;
}