// import * as React from 'react';
// import { memo } from 'react';

// import Select from 'antd/lib/select';

// import './styles.less';

// const { Option } = Select;

// interface IProps {
//     className?: any;
//     value?: string | undefined;
//     onChange?: (value: string) => void;
//     containerId: string;
//     disabled?: boolean;
//     list: string[];
// }

// function ArrowDropDown(props: IProps) {
//     const { className, value, onChange, containerId, disabled, list } = props;
//     const options = list.map((item) => (
//         <Option key={item} value={item}>
//             {item}
//         </Option>
//     ));

//     return (
//         <Select
//             bordered
//             className={`arrow_drop_down ${className}`}
//             defaultActiveFirstOption
//             disabled={disabled}
//             filterOption={false}
//             getPopupContainer={() => document.getElementById(containerId)}
//             notFoundContent={null}
//             onChange={onChange}
//             // to not to allow pop up to scroll on page scroll example - https://codesandbox.io/s/4j168r7jw0
//             showArrow
//             value={value}
//         >
//             {options}
//         </Select>
//     );
// }

// export default memo(ArrowDropDown);
