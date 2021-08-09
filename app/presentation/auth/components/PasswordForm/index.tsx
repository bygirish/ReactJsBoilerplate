// import React from 'react';

// import { FormHelper } from '@utils/FormHelper';

// import { translate } from '@translations/Translater';

// import PrimaryButton from '@components/atoms/Button/PrimaryButton';
// import { AnimatedInput } from '@components/atoms/Input/AnimatedInput';
// import Text, { FontFamilyVariant, TextType } from '@components/Text';

// import { authMessages } from '@containers/Auth/message';

// import './styles.less';

// interface IProps {
//     t: any;
//     className?: any;
//     onSubmit: (newPassword: string) => void;
//     loading?: boolean;
//     apiError?: string;
// }

// interface IState {
//     newPassword: string;
//     confirmPassword: string;
//     newPasswordError: string;
//     confirmPasswordError: string;
//     isValidPassword: boolean | null;
//     isValidRegex: boolean | null;
//     error: string;
// }

// export default class PasswordAndTerms extends React.Component<IProps, IState> {
//     public state: IState = {
//         newPassword: '',
//         confirmPassword: '',
//         newPasswordError: '',
//         confirmPasswordError: '',
//         isValidPassword: true,
//         isValidRegex: true,
//         error: '',
//     };

//     private setNewPassword = (e) => {
//         const { value } = e.target;
//         this.setState({ newPassword: value });
//     };

//     private setConfirmPassword = (e) => {
//         const { value } = e.target;
//         this.setState({ confirmPassword: value });
//     };

//     private handleOnBlurPassword = () => {
//         this.setState((state: IState) => ({
//             isValidPassword: !FormHelper.isBlankOrUndefined(state.newPassword),
//             isValidRegex: FormHelper.validatePassword(state.newPassword),
//         }));
//     };

//     public toggle = (value: boolean): boolean => !value;

//     private validateFields = () => {
//         const { newPassword, confirmPassword } = this.state;
//         const { t } = this.props;
//         let isValidNewPassword;
//         let isValidConfirmPassword;

//         if (FormHelper.isBlankOrUndefined(newPassword)) {
//             this.setState({
//                 newPasswordError: translate(
//                     t,
//                     authMessages.newPasswordError,
//                 ),
//             });
//             isValidNewPassword = false;
//         } else if (!FormHelper.validatePassword(newPassword)) {
//             this.setState({
//                 newPasswordError: translate(
//                     t,
//                     authMessages.newPasswordErrorRegex,
//                 ),
//             });
//             isValidNewPassword = false;
//         } else {
//             this.setState({ newPasswordError: '' });
//             isValidNewPassword = true;
//         }

//         if (FormHelper.isBlankOrUndefined(confirmPassword)) {
//             this.setState({
//                 confirmPasswordError: translate(
//                     t,
//                     authMessages.confirmPasswordError,
//                 ),
//             });
//             isValidConfirmPassword = false;
//         } else if (newPassword !== confirmPassword) {
//             this.setState({
//                 confirmPasswordError: translate(
//                     t,
//                     authMessages.passwordNotMatched,
//                 ),
//             });
//             isValidConfirmPassword = false;
//         } else {
//             this.setState({ confirmPasswordError: '' });
//             isValidConfirmPassword = true;
//         }

//         return isValidNewPassword && isValidConfirmPassword;
//     };

//     public handleSubmit = async e => {
//         e.preventDefault();
//         const { newPassword } = this.state;
//         const { onSubmit } = this.props;
//         if (this.validateFields()) {
//             onSubmit(newPassword);
//         }
//     };

//     public showError = () => {
//         const { error } = this.state;
//         const { t } = this.props;
//         const errs = error.split('-');
//         return (
//             <div className="errors">
//                 {errs.map(
//                     (err) => err &&  <Text
//                         className="sign_in__forgot"
//                         fontFamilyVariant={FontFamilyVariant.regular}
//                         text={translate(t, authMessages.forgotPassword)}
//                         textType={TextType.h8}
//                     />,
//                 )}
//             </div>
//         );
//     };

//     public render() {
//         const { t, className, loading, apiError } = this.props;
//         const { newPasswordError, confirmPasswordError, error, newPassword, confirmPassword } = this.state;

//         return (
//             <div className={`password_and_terms ${className}`}>
//                 <form onSubmit={this.handleSubmit} className="password_form">
//                     <div>
//                         <AnimatedInput
//                             id="password1"
//                             name="password1"
//                             type="password"
//                             label={translate(t, authMessages.newPassword)}
//                             error={newPasswordError}
//                             onChange={this.setNewPassword}
//                             value={newPassword}
//                         />
//                         <AnimatedInput
//                             id="password2"
//                             name="password2"
//                             type="password"
//                             label={translate(t, authMessages.confirmPassword)}
//                             error={confirmPasswordError}
//                             onChange={this.setConfirmPassword}
//                             onBlur={this.handleOnBlurPassword}
//                             value={confirmPassword}
//                         />
//                         {error && this.showError()}
//                         {apiError &&  <Text
//                             className="validation-error sign_in__error"
//                             fontFamilyVariant={FontFamilyVariant.light}
//                             text={apiError}
//                             textType={TextType.paragraph1}
//                         />}
//                     </div>
//                     <div>
//                                <PrimaryButton
//                                    className="pwd_button"
//                                    disabled={false}
//                                    htmlType="submit"
//                                    loading={loading}
//                                    type="primary"
//                                >
//                                    {translate(t, authMessages.setPassword)}
//                                </PrimaryButton>
//                     </div>
//                 </form>
//             </div>
//         );
//     }
// }
