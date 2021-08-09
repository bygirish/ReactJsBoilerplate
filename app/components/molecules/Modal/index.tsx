// import React, { ReactNode } from 'react';

// import Modal, { ModalProps } from 'antd/lib/modal';

// import './style.less';

// interface IProps extends ModalProps {
//   showModal: boolean;
//   onCancel: () => void;
//   style?: Object;
//   closable?: boolean;
//   destroyOnClose?: boolean;
//   maskClosable?: boolean;
//   okText?: string | ReactNode;
//   title?: string | ReactNode;
//   wrapClassName?: string;
//   width?: string | number;
//   cancelText?: string | ReactNode;
//   onOk?: () => void;
//   footer?: ReactNode | null;
//   children: React.ReactElement;
// }

// const WFModal = (props: IProps) => {
//     const { showModal, children,  onCancel, style, footer = null, ...rest } = props;

//     return (
//       <Modal
//         style={style}
//         centered
//         visible={showModal}
//         footer={footer}
//         onCancel={onCancel}
//         {...rest}
//       >
//         {children}
//       </Modal>
//     );
// }

// export default WFModal;

