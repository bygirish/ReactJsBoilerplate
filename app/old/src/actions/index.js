const CREATE_USER_DATA = 'CREATE_USER_DATA';
const DELETE_USER_DATA = 'DELETE_USER_DATA';
const UPDATE_USER_DATA = 'UPDATE_USER_DATA';
const GET_USER_DATA = 'GET_USER_DATA';
const CHANGE_ORGANIZATION_INSTITUTION = 'CHANGE_ORGANIZATION_INSTITUTION';
const GET_MODULE_PERMISSION = 'GET_MODULE_PERMISSION';
const UPDATE_MODULE_PERMISSION = 'UPDATE_MODULE_PERMISSION';
const GET_ORGANIZATION_DATA = 'GET_ORGANIZATION_DATA';

export const setUserData =  pData => ({
    type : CREATE_USER_DATA,
    payload : pData
});

export const getUserData =  pData => ({
    type : GET_USER_DATA,
    payload : pData
});

export const updateUserData =  pData => ({
    type : UPDATE_USER_DATA,
    payload : pData
});

export const removeUserData =  pData => ({
    type : DELETE_USER_DATA,
    payload : pData
});

export const changeOrganization =  pData => ({
    type : CHANGE_ORGANIZATION_INSTITUTION,
    payload : pData
});

export const updateModulePermission =  pData => ({
    type : UPDATE_MODULE_PERMISSION,
    payload : pData
});

export const getModulePermission =  (module_name,module_permission) => ({
    type : GET_MODULE_PERMISSION,
    payload : {
        name:module_name,
        permission:module_permission,
    },
});

export const getOrganizationData =  pData => ({
    type : GET_ORGANIZATION_DATA,
    payload : pData
});