// import React from 'react';

// import PrimaryButton from '@components/atoms/Button/PrimaryButton';
// import WFModal from '@components/molecules/Modal';
// import Text, { FontFamilyVariant, TextType } from '@components/Text';

// import './style.less';

// interface IProps {
//     t?: any;
//     title?: string;
//     confirmationText?: string;
//     closeConfirmationPopUp?: () => void;
//     deleteAction?: () => void;
//     primaryButtonText: string;
//     secondaryButtonText: string;
// }

// const ConfirmationModal = (props: IProps) => {
//     const { title, closeConfirmationPopUp, confirmationText, t, 
//         deleteAction, primaryButtonText, secondaryButtonText } = props;

//     return (
//         <WFModal
//             title={title}
//             centered={true}
//             visible
//             showModal={true}
//             onCancel={closeConfirmationPopUp}
//             width={500}
//         >
//             <>
//                 <Text
//                     textType={TextType.paragraph1}
//                     fontFamilyVariant={FontFamilyVariant.light}
//                     text={confirmationText}
//                 />
//                 <div className="delete-event">
//                     <PrimaryButton
//                         htmlType={'button'}
//                         onClick={closeConfirmationPopUp}
//                         className="cancel-button"
//                     >
//                         {primaryButtonText}
//                     </PrimaryButton>
//                     <PrimaryButton
//                         htmlType={'button'}
//                         onClick={deleteAction}
//                         className="delete-button"
//                     >
//                         {secondaryButtonText}
//                     </PrimaryButton>
//                 </div>
//             </>
//         </WFModal>
//     )
// }

// export default ConfirmationModal;


