// import React, { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';

// import { FormHelper } from '@utils/FormHelper';
// import { handleAuthFlow, storeUserData } from '@utils/UserUtils';

// import { ICheckUserExist, ILoginPayload } from '@redux/auth/interface';

// import { LoginModel } from '@models/Login';

// import { SignIn } from '@assets/images';
// import { translate } from '@translations/Translater';

// import PrimaryButton from '@components/atoms/Button/PrimaryButton';
// import { AnimatedInput } from '@components/atoms/Input/AnimatedInput';
// import Text, { FontFamilyVariant, TextType } from '@components/Text';

// import Navigator from '@navigator/index';
// import { NavigationUrl, URLs } from '@navigator/NavigationUrl';

// import { authMessages } from '@containers/Auth/message';

// import AuthForm from '@presentation/auth/components/AuthForm';

// import { TitleAndDescription } from '../components/TitleAndDescription';
// import './styles.less';

// interface IProps {
//     login: (payload: ILoginPayload) => void;
//     loginError: string;
//     t: any;
//     checkUserExist: (payload: ICheckUserExist) => void;
//     checkUserExistData: any;
//     checkUserExistError: string;
//     history?: any;
//     loginData?: LoginModel;
// }

// function Login(props: IProps) {
//     const { login, loginError, loginData } = props;

//     const { t } = useTranslation();

//     // states
//     const [email, setEmail] = useState(null);
//     const [password, setPassword] = useState(null);
//     const [emailError, setEmailError] = useState('');
//     const [passwordError, setPasswordError] = useState('');

//     const [loading, setLoading] = useState(false);
//     const [flag, setFlag] = useState(false);

//     // effects
//     useEffect(function onMount() {
//         handleAuthFlow();
//     }, [])

//     const onEmailChange = (e) => {
//         const { value } = e.target;
//         setEmail(value);
//         const isValidEmail = !value || !FormHelper.validateEmail(value);
//         setEmailError(isValidEmail ? translate(t, authMessages.emailError) : '');
//     };

//     const onPasswordChange = (e) => {
//         const { value } = e.target;
//         setPassword(value);
//         setPasswordError(!value ? translate(t, authMessages.passwordError) : '');
//     };

//     const forgotPassword = () => {
//         Navigator.push(NavigationUrl.generate(URLs.forgotPassword));
//     };

//     const handleNewPage = () => {
//         handleAuthFlow();
//     };

//     const handleCheck = (e): void => {
//         e.preventDefault();
//         if (!(email && password)) {
//             return;
//         }
//         const payload = {
//             userName: email,
//             password
//         };
//         setLoading(true);
//         login(payload);
//         setFlag(true);
//     };

//     useEffect(() => {
//         if (loginError) {
//             setLoading(false);
//         }
//     }, [loginError]);

//     useEffect(() => {
//         if (loginData && Object.keys(loginData).length && email) {
//             storeUserData(loginData, email.toLowerCase());
//             setLoading(false);
//             if (flag) {
//                 handleNewPage();
//             }
//         }
//     }, [loginData]);

//     return (
//         <div className="sign_in__container">
//             <div className="sign_in__sub_container">
//                 <AuthForm image={SignIn}>
//                     <form onSubmit={handleCheck}>
//                         <div>
//                             <TitleAndDescription
//                                 description={translate(t, authMessages.letsBegin)}
//                                 title={translate(t, authMessages.welcome)}
//                             />
//                             <AnimatedInput
//                                 className="sign_in__input_first"
//                                 error={emailError}
//                                 id="email"
//                                 label={translate(t, authMessages.emailPlaceholder)}
//                                 name="email"
//                                 onChange={onEmailChange}
//                                 type="email"
//                                 value={email}
//                             />
//                             <AnimatedInput
//                                 className="sign_in__input"
//                                 error={passwordError}
//                                 id="password"
//                                 label={translate(t, authMessages.passwordPlaceholder)}
//                                 name="password"
//                                 onChange={onPasswordChange}
//                                 type="password"
//                                 value={password}
//                             />
//                             <div
//                                 className="sign_in__forgot_container"
//                                 onClick={forgotPassword}
//                             >
//                                 <Text
//                                     className="sign_in__forgot"
//                                     fontFamilyVariant={FontFamilyVariant.regular}
//                                     text={translate(t, authMessages.forgotPassword)}
//                                     textType={TextType.h8}
//                                 />
//                             </div>
//                             {loginError && (
//                                 <Text
//                                     className="validation-error sign_in__error"
//                                     fontFamilyVariant={FontFamilyVariant.light}
//                                     text={translate(t, authMessages.loginError, { context: loginError })}
//                                     textType={TextType.paragraph1}
//                                 />
//                             )}
//                             <div>
//                                 <PrimaryButton
//                                     className="sign_in__button"
//                                     disabled={false}
//                                     htmlType="submit"
//                                     loading={loading}
//                                     type="primary"
//                                 >
//                                     {translate(t, authMessages.signInTitle)}
//                                 </PrimaryButton>
//                             </div>
//                             <div className="sign_in__helper">
//                                 <Text
//                                     className="sign_in__dont_have"
//                                     fontFamilyVariant={FontFamilyVariant.regular}
//                                     text={translate(t, authMessages.dontHaveAcc)}
//                                     textType={TextType.h8}
//                                 />
//                                 <a
//                                     className="sign_in__sign_up "
//                                     href={NavigationUrl.generate(URLs.register)}
//                                 >
//                                     <Text
//                                         fontFamilyVariant={FontFamilyVariant.semibold}
//                                         text={translate(t, authMessages.signUp)}
//                                         textType={TextType.h8}
//                                     />
//                                 </a>
//                             </div>
//                         </div>
//                     </form>
//                 </AuthForm>
//             </div>
//         </div>
//     );
// }

// export default Login;
