// import React from 'react';

// import { BackBigger } from '@assets/images';

// import { WFImg } from '@components/index';
// import Text, { FontFamilyVariant, TextType } from '@components/Text';

// import './styles.less';

// interface IProps {
//     title: string;
//     description: any;
//     onBackPress?: () => void;
// }
// export function TitleAndDescription(props: IProps) {
//     const { title, description, onBackPress } = props;
//     return (
//         <div className="td__container">
//             {onBackPress && (
//                 <div className="td__back_container" onClick={onBackPress}>
//                     <WFImg src={BackBigger} className="td__back" />
//                 </div>
//             )}
//             <Text
//                 className={'td__title'}
//                 fontFamilyVariant={FontFamilyVariant.medium2}
//                 text={title}
//                 textType={TextType.h2}
//             />
//             {description && (
//                 <Text
//                     className={'td__desc'}
//                     fontFamilyVariant={FontFamilyVariant.regular}
//                     text={description}
//                     textType={TextType.h8}
//                 />
//             )}
//         </div>
//     );
// }
