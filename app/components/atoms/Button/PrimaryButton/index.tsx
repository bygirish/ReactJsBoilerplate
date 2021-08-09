// import React from 'react';
// import { Button } from 'antd';
// import { SizeType } from 'antd/lib/config-provider/SizeContext';
// import { ButtonShape, ButtonType } from 'antd/lib/button';
// import './index.less';

// interface IProps {
//   className?: any;
//   htmlType: 'button' | 'reset' | 'submit' | undefined;
//   type?: ButtonType;
//   icon?: React.ReactNode;
//   shape?: ButtonShape;
//   size?: SizeType;
//   loading?:
//     | boolean
//     | {
//         delay?: number;
//       };
//   ghost?: boolean;
//   danger?: boolean;
//   block?: boolean;
//   children?: React.ReactNode;
//   onClick?: React.MouseEventHandler<HTMLElement>;
//   disabled?: boolean;
//   href?: string;
//   id?: string;
//   style?: any;
// }

// export default function(props: IProps) {
//   const { children, className , ...rest} = props;
//   const style = ["primary_button", className].join(' ');
//   return <Button {...rest} type="primary" block className={style}>{children}</Button>;
// };
