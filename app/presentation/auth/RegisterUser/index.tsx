// import React, { useEffect, useState } from 'react';
// import { useTranslation, withTranslation } from 'react-i18next';
// import { withRouter } from 'react-router-dom';

// import { DataUtility } from '@utils/DataUtility';
// import { displayErrorMessage } from '@utils/DisplayMessageUtility';
// import { ErrorParser } from '@utils/ErrorMessageUtils';
// import { StorageKeys } from '@utils/LocalStorage';
// import { handleAuthFlow, updateProfileCompletedFlag } from '@utils/UserUtils';

// import { ICreateProfilePayload } from '@redux/auth/interface';

// import { ICountry } from '@models/Country';
// import { IProfile } from '@models/Profile';

// import { SignIn } from '@assets/images';
// import { translate } from '@translations/Translater';

// import PrimaryButton from '@components/atoms/Button/PrimaryButton';
// import AnimatedSearchDropdown from '@components/atoms/Dropdown';
// import ArrowDropDown from '@components/atoms/Dropdown/ArrorDropDown/index';
// import { AnimatedInput } from '@components/atoms/Input/AnimatedInput';
// import { globalMessages } from '@components/messages';
// import { Alert, ALERT_TYPE } from '@components/old/atoms/Alert';
// import Text, { FontFamilyVariant, TextType } from '@components/Text';

// import Navigator from '@navigator/index';
// import { NavigationUrl, URLs } from '@navigator/NavigationUrl';

// import { DEFAULT_LANG, SUPPORTED_LANGUAGES } from '@constants/config';

// import { authMessages } from '@containers/Auth/message';

// import AuthForm from '@presentation/auth/components/AuthForm';
// import { TitleAndDescription } from '@presentation/auth/components/TitleAndDescription';

// import { ERR_USER_ALREADY_PRESENT } from '@network/constants';
// import './style.less';

// interface IProps {
//     location: any;
//     countriesList: ICountry[],
//     errorFetchingCountries: string;
//     registerUser: IProfile;
//     errorRegisterUser: string;
//     registerUserLoader: boolean;
//     fetchCountriesData: () => void;
//     createUserProfile: (payload: ICreateProfilePayload) => void;
// }

// const USER_FIELD_NAMES = Object.freeze({
//     firstName: 'firstName',
//     lastName: 'lastName',
//     email: 'email',
// });

// function RegisterUser(props: IProps) {
//     const {
//         countriesList, errorFetchingCountries, registerUser,
//         errorRegisterUser, fetchCountriesData, registerUserLoader, createUserProfile
//     } = props;

//     const { t } = useTranslation();
//     const [firstName, setFirstName] = useState('');
//     const [lastName, setLastName] = useState('');
//     const [email, setEmail] = useState('');
//     const [country, setCountry] = useState(null);
//     const [language, setLanguage] = useState(DEFAULT_LANG);

//     const [countryId, setCountryId] = useState(0);
//     const [dropdownCountries, setDropdownCountries] = useState([]);

//     // languages list
//     const languages = SUPPORTED_LANGUAGES.map((lang) => lang.value);

//     const localStorageEmail = localStorage.getItem(StorageKeys.EMAIL);

//     const onInputChange = (key, value) => {
//         if (key === USER_FIELD_NAMES.firstName) {
//             setFirstName(value);
//         }
//         if (key === USER_FIELD_NAMES.lastName) {
//             setLastName(value);
//         }
//         if (key === USER_FIELD_NAMES.email) {
//             setEmail(value);
//         }
//     };

//     useEffect(() => {
//         fetchCountriesData();

//         if (errorFetchingCountries) {
//             displayErrorMessage(translate(t, globalMessages.appError));
//         }
//     }, []);

//     useEffect(() => {
//         if (localStorageEmail) {
//             setEmail(localStorageEmail);
//         }
//     }, [localStorageEmail]);

//     useEffect(() => {
//         if(errorRegisterUser === ERR_USER_ALREADY_PRESENT) {
//             Navigator.push(NavigationUrl.generate(URLs.logout));
//         }
//         if (errorRegisterUser) {
//             Alert({
//                 type: ALERT_TYPE.ERROR,
//                 alertMessage: ErrorParser(errorRegisterUser)
//             });
//         }
//         if(registerUser && Object.keys(registerUser).length) {
//             // updated local storage;
//             updateProfileCompletedFlag('true');
//             handleAuthFlow();
//         }
//     }, [registerUser, errorRegisterUser]);

//     useEffect(() => {
//         const countries = countriesList.map((item) => ({
//             key: item.id,
//             value: item.name
//         }));
//         setDropdownCountries(countries);
//     }, [countriesList]);


//     const handleSignIn = (e) => {
//         e.preventDefault();
//         const selectedLang = SUPPORTED_LANGUAGES.find((lang) => lang.value === language)
//         const payload = {
//             email,
//             firstName,
//             lastName,
//             countryId,
//             preferredLanguage: selectedLang.code,
//         };
//         createUserProfile(payload);
//     };

//     const redirectBack = () => {
//         Navigator.replace(NavigationUrl.generate(URLs.login));
//     };

//     const handleChangeCountry = (value) => {
//         const selectedCountry = countriesList.find((row) => row.name === value);
//         setCountry(value);
//         setCountryId(selectedCountry.id);
//     };

//     const filterCountries = (search: string): void => {
//         const filtered = countriesList
//             .filter((row) => row.name.toLowerCase().includes(search.toLowerCase()))
//             .map((item) => (
//                 {
//                     key: item.id,
//                     value: item.name
//                 }
//             ));
//         setDropdownCountries(filtered);
//     };

//     const onLangChange = (itemValue: string) => {
//         setLanguage(itemValue);
//     };

//     const onValueChange = (e) => {
//         const { name, value } = e.target;
//         onInputChange(name, value);
//     };

//     return (
//         <AuthForm formContainerStyle="pwd__container" image={SignIn}>
//             <form onSubmit={handleSignIn}>
//                 <div>
//                     <TitleAndDescription
//                         description={translate(t, authMessages.regSubtext)}
//                         title={translate(t, authMessages.regTitle)}
//                     />
//                     <AnimatedInput
//                         className="fname"
//                         error=""
//                         id={USER_FIELD_NAMES.firstName}
//                         label={translate(t, authMessages.firstName)}
//                         name={USER_FIELD_NAMES.firstName}
//                         onChange={onValueChange}
//                         type="text"
//                         value={firstName}
//                     />
//                     <AnimatedInput
//                         error=""
//                         id={USER_FIELD_NAMES.lastName}
//                         label={translate(t, authMessages.lastName)}
//                         name={USER_FIELD_NAMES.lastName}
//                         onChange={onValueChange}
//                         type="text"
//                         value={lastName}
//                     />
//                     <AnimatedSearchDropdown
//                         data={dropdownCountries}
//                         disabled={false}
//                         handleSearch={DataUtility.debounce(filterCountries, 200)}
//                         isEmptyList={false}
//                         label={translate(t, authMessages.country)}
//                         onChange={handleChangeCountry}
//                         placeholder={translate(t, authMessages.selectCountry)}
//                         prefill={country}
//                         searchInputClassName="location_selection"
//                         showSearch
//                     />
//                     <AnimatedInput
//                         disabled
//                         error=""
//                         id={USER_FIELD_NAMES.email}
//                         label={translate(t, authMessages.email)}
//                         name={USER_FIELD_NAMES.email}
//                         onChange={onValueChange}
//                         placeholder={translate(t, authMessages.emailPlaceholder)}
//                         type="email"
//                         value={email}
//                     />
//                     <div className="language_container" id="country">
//                         <Text
//                             className=""
//                             fontFamilyVariant={FontFamilyVariant.medium}
//                             text={`${translate(t, authMessages.language)} :`}
//                             textType={TextType.paragraph1}
//                         />
//                         <ArrowDropDown
//                             className=""
//                             containerId="country"
//                             disabled
//                             list={languages}
//                             onChange={onLangChange}
//                             value={language}
//                         />
//                     </div>
//                     <div>
//                         <PrimaryButton
//                             className="button-submit"
//                             disabled={!(firstName && lastName && country)}
//                             htmlType="submit"
//                             loading={registerUserLoader}
//                             type="primary"
//                         >
//                             {translate(t, authMessages.submit)}
//                         </PrimaryButton>
//                     </div>
//                 </div>
//             </form>
//         </AuthForm>
//     );
// }

// export default withTranslation()(withRouter(RegisterUser));
