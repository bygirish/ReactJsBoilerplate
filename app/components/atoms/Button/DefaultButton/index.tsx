// import React from 'react';
// import { Button } from 'antd';
// import { SizeType } from 'antd/lib/config-provider/SizeContext';
// import { ButtonShape, ButtonType } from 'antd/lib/button';
// import './index.less';

// interface IProps {
//     className?: any;
//     htmlType: 'button' | 'reset' | 'submit' | undefined;
//     type?: ButtonType;
//     icon?: React.ReactNode;
//     shape?: ButtonShape;
//     size?: SizeType;
//     loading?:
//         | boolean
//         | {
//         delay?: number;
//     };
//     ghost?: boolean;
//     danger?: boolean;
//     block?: boolean;
//     children?: React.ReactNode;
//     onClick?: React.MouseEventHandler<HTMLElement>;
//     disabled?: boolean;
//     target?: string;
//     href?: string;
// }

// export default function(props: IProps) {
//     const { children, className ,...rest } = props;
//     const style = ["default_button", className].join(' ');
// return <Button type="default" className={style} {...rest}  style={{ paddingLeft: 40, paddingRight: 40, borderRadius: 4}}>{children}</Button>;
// };
