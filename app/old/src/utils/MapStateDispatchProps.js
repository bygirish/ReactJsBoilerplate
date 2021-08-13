import { setUserData , getUserData , updateUserData , removeUserData, changeOrganization, getModulePermission,updateModulePermission,getOrganizationData} from '../actions/';
export const mapStateToProps  = state  => (
    { 
        token : state.UserData.token,
        data : state.UserData.data,
        result : state.UserData.result
  });
export const mapDispatchToPros = dispatch => ({
    setUserData: data => dispatch(setUserData(data)),
    getUserData : data => dispatch(getUserData(data)),
    updateUserData : data => dispatch(updateUserData(data)),
    removeUserData : data => dispatch(removeUserData(data)),  
    changeOrganization : data => dispatch(changeOrganization(data)),  
    updateModulePermission : data => dispatch(updateModulePermission(data)),  
    getOrganizationData : data => dispatch(getOrganizationData(data)),   
    getModulePermission : (data,name,permission) => dispatch(getModulePermission(data,name,permission))    
});