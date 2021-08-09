// import { PlaceholderImage } from '@assets/images';
// import WFImg from '@components/atoms/Image/Img';
// import { Col, Row } from 'antd/lib/grid';
// import React from 'react';

// import './styles.less';

// interface IProps {
//     image: string;
//     children: any;
//     className?: string;
//     formContainerStyle?: string;
// }
// export default function RegistrationForm(props: IProps) {
//     const { image, children, className, formContainerStyle } = props;
//     return (
//         <Row className={`reg_form__container ${formContainerStyle}`}>
//             <Col
//                 className="reg_form__left_container"
//                 md={11}
//                 xs={24}
//             >
//                 <WFImg className="reg_form__image" placeholder={PlaceholderImage} src={image} />
//             </Col>
//             <Col md={1} xs={0} />
//             <Col
//                 className={`reg_form__right_container ${className}`}
//                 md={11}
//                 xs={24}
//             >
//                 {children}
//             </Col>
//             <Col md={1} xs={0} />

//         </Row>
//     );
// }
