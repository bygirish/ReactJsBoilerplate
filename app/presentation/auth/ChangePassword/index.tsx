// import React, { useEffect } from 'react';
// import { useTranslation } from 'react-i18next';

// import { ErrorParser } from '@utils/ErrorMessageUtils';
// import { getUserEmail, handleAuthFlow, updateTempPasswordFlag } from '@utils/UserUtils';

// import { ILoginPayload } from '@redux/auth/interface';

// import { SignIn } from '@assets/images';
// import { translate } from '@translations/Translater';

// import { Alert, ALERT_TYPE } from '@components/old/atoms/Alert';

// import { authMessages } from '@containers/Auth/message';

// import AuthForm from '@presentation/auth/components/AuthForm';
// import PasswordAndTerms from '@presentation/auth/components/PasswordForm';

// import { TitleAndDescription } from '../components/TitleAndDescription';
// import './styles.less';

// interface IProps {
//     changePasswordAction: (payload: ILoginPayload) => void;
//     loading: boolean;
//     changePasswordErrorData: string;
//     changePasswordData: any;
// }

// function ChangePassword(props: IProps) {
//     const { changePasswordAction, loading, changePasswordErrorData, changePasswordData } = props;

//     const { t } = useTranslation();
//     const error = ErrorParser(changePasswordErrorData);

//     useEffect(function processResponse() {
//         if (changePasswordData) {
//             Alert({ type: ALERT_TYPE.SUCCESS, alertMessage: t('changePassword.passwordUpdateSuccessful') });
//             updateTempPasswordFlag('false');
//             handleAuthFlow(true);
//         }
//     }, [changePasswordData, changePasswordErrorData]);


//     const handleChangePassword = (password) => {
//         const email: string = getUserEmail();
//         const payload: ILoginPayload = {
//             userName: email,
//             password
//         };
//         changePasswordAction(payload);
//     };


//     return (
//         <AuthForm
//             formContainerStyle="pwd__container"
//             image={SignIn}
//         >
//             <div>
//                 <TitleAndDescription
//                     description={translate(t, authMessages.createPasswordSubtext)}
//                     title={translate(t, authMessages.createPassword)}
//                 />
//                 <PasswordAndTerms
//                     apiError={error}
//                     className="pwd__form"
//                     loading={loading}
//                     onSubmit={handleChangePassword}
//                     t={t}
//                 />
//             </div>
//         </AuthForm>
//     );
// }

// export default ChangePassword;
