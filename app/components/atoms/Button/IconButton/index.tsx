// import React, { ReactNode } from "react";

// import { Button, ButtonProps } from "antd";
// import { SizeType } from "antd/lib/config-provider/SizeContext";

// import "./style.less";

// interface IProps extends ButtonProps {
//   className?: any;
//   size?: SizeType;
//   onClick: React.MouseEventHandler<HTMLElement>;
//   disabled?: boolean;
//   children?: React.ReactNode;
//   target?: string;
//   href?: string;

//   prefixIcon?: ReactNode;
//   suffixIcon?: ReactNode;
// }
// const IconButton = (props: IProps) => {
//   const { children, className, prefixIcon, suffixIcon, ...rest } = props;
//   const style = ["icon-button", className].join(" ");

//   return (
//     <Button className={style} {...rest}>
//       <div className="content_container">
//         {prefixIcon && <div className="prefix_icon">{prefixIcon}</div>}
//         {children}
//         {suffixIcon && <div className="suffix_icon">{suffixIcon}</div>}
//       </div>
//     </Button>
//   );
// };

// export default IconButton;
