// import React, { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';

// import { displaySuccessMessage } from '@utils/DisplayMessageUtility';
// import { ErrorParser } from '@utils/ErrorMessageUtils';

// import { IJoinBatchPayload } from '@redux/batch/interfaces';

// import { BatchModel } from '@models/Batch';

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
//     fetchDashboardCourses: (email: string) => void;
//     joinBatch: (payload: IJoinBatchPayload) => void;
//     joinBatchResponse: any;
//     isJoiningBatch: boolean;
//     joinBatchError: string;
//     fetchBatchByUUID: (batchKey: string) => void;
//     batchDetails: BatchModel;
//     isFetchingBatchDetails: boolean;
//     fetchingBatchError: string;
// }

// function EnrollCohort(props: IProps) {
//     const { fetchBatchByUUID, isFetchingBatchDetails, joinBatchError,
//         fetchingBatchError, batchDetails, isJoiningBatch, joinBatch } = props;

//     const { t } = useTranslation();

//     // states
//     const [batchId, setBatchId] = useState(null);
//     const [loader, setLoader] = useState(false);

//     // error
//     const error = ErrorParser(fetchingBatchError || joinBatchError);

//     // effects
//     useEffect(() => {
//         if (batchDetails && Object.keys(batchDetails).length > 0) {
//             // call enroll api
//             const payload: IJoinBatchPayload = {
//                 batchKey: batchId,
//             };
//             setLoader(true);
//             joinBatch(payload);
//         }
//     }, [batchDetails]);

//     useEffect(() => {
//         if (loader && !isJoiningBatch) {
//             if (!joinBatchError) {
//                 // successfully joined.
//                 displaySuccessMessage(translate(t, authMessages.enrollCohort));
//                 Navigator.replace(NavigationUrl.generate(URLs.default));
//             }
//             setLoader(false);
//         }
//     }, [loader, isJoiningBatch, joinBatchError]);

//     const onBatchIdChange = (e) => {
//         const { value } = e.target;
//         setBatchId(value);
//     };

//     const handleCheck = (e): void => {
//         e.preventDefault();
//         if (!batchId) {
//             return;
//         }
//         fetchBatchByUUID(batchId);
//     };

//     return (
//         <div className="sign_in__container">
//             <div className="sign_in__sub_container">
//                 <AuthForm image={SignIn}>
//                     <form onSubmit={handleCheck}>
//                         <div>
//                             <TitleAndDescription
//                                 description={translate(t, authMessages.enrollSubtext)}
//                                 title={translate(t, authMessages.enrollTitle)}
//                             />
//                             <AnimatedInput
//                                 className="sign_in__input_first"
//                                 id="batchId"
//                                 label={translate(t, authMessages.cohortUuid)}
//                                 name="batchId"
//                                 onChange={onBatchIdChange}
//                                 type="text"
//                                 value={batchId}
//                             />
//                             {error && (
//                                 <Text
//                                     className="validation-error"
//                                     fontFamilyVariant={FontFamilyVariant.light}
//                                     text={error}
//                                     textType={TextType.paragraph1}
//                                 />
//                             )}
//                             <div>
//                                 <PrimaryButton
//                                     className="enroll_cohort_button"
//                                     disabled={!batchId}
//                                     htmlType="submit"
//                                     loading={loader || isFetchingBatchDetails || isJoiningBatch}
//                                     type="primary"
//                                 >
//                                     {translate(t, authMessages.enroll)}
//                                 </PrimaryButton>
//                             </div>
//                         </div>
//                     </form>
//                 </AuthForm>
//             </div>
//         </div>
//     );
// }

// export default EnrollCohort;
