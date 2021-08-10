const lStrUserData = localStorage.getItem('user') ? localStorage.getItem('user') : '{}';
const lStrToken = localStorage.getItem('token') ? localStorage.getItem('token') : null;
const lStrResult = localStorage.getItem('result') ? localStorage.getItem('result') : '';

export default function UserData(
    state = {
        token : lStrToken,
        data : JSON.parse(lStrUserData),
        result : lStrResult
    },
    action
  ) {
    switch(action.type){
        
        case 'CREATE_USER_DATA':{
            localStorage.setItem('user',JSON.stringify(action.payload.data));
            localStorage.setItem('token',JSON.stringify(action.payload.token));
            return {
                token : action.payload.token,
                data : action.payload.data
            };
        }

        case 'UPDATE_USER_DATA':{
            localStorage.setItem('user',JSON.stringify(action.payload.data));
            return {
                data : action.payload.data
            };
        }

        case 'GET_USER_DATA':{
            return {
                token : state.token,
                data : state.data
            };
        }

        case 'DELETE_USER_DATA':{
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            return {
                token : null,
                data : null
            };
        }

        case 'CHANGE_ORGANIZATION_INSTITUTION':{
           const data = state.data;
            data.selectedOrganizationId = action.payload.selectedOrganizationId;
            data.selectedInstitutionId = action.payload.selectedInstitutionId;
            data.selectedOrgIndex = action.payload.selectedOrgIndex;
            data.selectedInstIndex = action.payload.selectedInstIndex;
            data.selectedBoardId = action.payload.selectedBoardId;
            data.selectedAcademicId = action.payload.selectedAcademicId;
            data.selectedBoardIndex = action.payload.selectedBoardIndex;
            data.selectedAcademicIndex = action.payload.selectedAcademicIndex;
            localStorage.setItem('user',JSON.stringify(data));
            return {
              data:data
            };
        }

        case 'UPDATE_MODULE_PERMISSION':{
            const data = state.data;
             data.module_permissions = action.payload.module_permissions;
             localStorage.setItem('user',JSON.stringify(data));
             return {
               data:data
             };
         }


         case 'GET_MODULE_PERMISSION':{
            const data = state.data;
            let result = false;
            if (data.module_permissions) {
                data.module_permissions.forEach(element => {
                if(element.child){
                  element.child.map(el=>{
                   if(el.name == action.payload.name && el[action.payload.permission] == 1){
                       result = true;
                   }
                  })
                }
                });
             }
             return {
                ...state,
                result
            };
         }

         case 'GET_ORGANIZATION_DATA':{
            const data = state.data;
             data.org_id = action.payload.org_id;
             data.org_name = action.payload.org_name;
             data.org_logo = action.payload.org_logo;
             data.inst_id = action.payload.inst_id;
             data.inst_logo = action.payload.inst_logo;
             data.inst_name = action.payload.inst_name;
             data.inst_district = action.payload.inst_district;
             data.inst_state = action.payload.inst_state;
             data.inst_pincode = action.payload.inst_pincode;
             data.inst_taluk = action.payload.inst_taluk;
             data.inst_address1 = action.payload.inst_address1;
             data.inst_address2 = action.payload.inst_address2;
             data.inst_district = action.payload.inst_district;
             data.inst_state = action.payload.inst_state;
             data.inst_pincode = action.payload.inst_pincode;
             data.inst_contact1 = action.payload.inst_contact1;
             data.inst_contact2 = action.payload.inst_contact2;
             data.inst_email1 = action.payload.inst_email1;
             data.inst_email2 = action.payload.inst_email2;
             localStorage.setItem('user',JSON.stringify(data));
             return {
               data:data
             };
         }

        default : 
            return state;
    }
}
