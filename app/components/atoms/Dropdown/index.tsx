// import React from 'react';
// import { config, Spring } from 'react-spring/renderprops-universal';

// import Select from 'antd/lib/select';

// import Text, { FontFamilyVariant, TextType } from '@components/Text';

// import './style.less';

// const { Option } = Select;

// interface IProps {
//   prefill?: string | number;
//   placeholder?: string;
//   label: string;
//   onChange: (value: string) => void;
//   error?: string;
//   onBlur?: () => void;
//   className?: any;
//   searchInputClassName?: any;
//   handleSearch?: (value: string) => void;
//   data: {
//     key: string;
//     value: string;
//   }[];
//   showSearch?: boolean;
//   emptyResult?: string;
//   isEmptyList?: boolean;
//   disabled?: boolean;
//   mode?: 'multiple';
//   dropDownErrorClassName?: string;
// }

// const AnimatedSearchDropdown = (props: IProps) => {
//   const inputRef = React.createRef();

//   const {
//     prefill,
//     placeholder,
//     label,
//     onChange,
//     error,
//     onBlur,
//     className,
//     handleSearch,
//     data,
//     showSearch,
//     emptyResult,
//     isEmptyList,
//     disabled,
//     searchInputClassName,
//     mode,
//     dropDownErrorClassName
//   } = props;

//   // states
//   const [reveal, setReveal] = React.useState(!!prefill);
//   const [isInputFocus, setFocus] = React.useState(false);
//   const [value, setValue] = React.useState(prefill);
//   const containerId = `${label}-search-input`
//   React.useEffect(() => {
//     setValue(prefill);
//   }, [prefill]);

//   const onClick = () => {
//     if (!isInputFocus || !reveal) {
//       setReveal(reveal => !reveal);
//         if(inputRef && inputRef.current){
//             // @ts-ignore
//             inputRef.current.focus();
//         }
//     }
//   };

//   const onFocusOut = () => {
//     setFocusFlag();
//     if (!value) {
//       setReveal(false);
//     }
//     if (onBlur) {
//       onBlur();
//     }
//   };

//   const setFocusFlag = () => setFocus(isInputFocus => !isInputFocus);

//   const onValueChange = (selected: string) => {
//     setValue(selected);
//     if (onChange) {
//       onChange(selected);
//     }
//   };
//   const select = (style: any) => {
//     const options = data.map(item => (
//       <Option key={item.key} value={item.value}>
//         {item.value}
//       </Option>
//     ));
//     return (
//       <Select
//         showSearch={showSearch}
//         value={value}
//         className={'search_input'}
//         placeholder={placeholder}
//         defaultActiveFirstOption={false}
//         showArrow={false}
//         filterOption={false}
//         mode={mode}
//         onSearch={handleSearch}
//         onChange={onValueChange}
//         notFoundContent={
//           isEmptyList ? <p>{emptyResult}</p> : null
//         }
//         style={style}
//         onFocus={setFocusFlag}
//         bordered={false}
//         // @ts-ignore
//         ref={inputRef}
//         onBlur={onFocusOut}
//         disabled={disabled}
//         // to not allow pop up to scroll on page scroll example - https://codesandbox.io/s/4j168r7jw0
//         getPopupContainer={() => document.getElementById(containerId)}
//       >
//         {options}
//       </Select>
//     );
//   };

//   return (
//     <>
//       <div className={`wf_animated_input ${className}`} onClick={onClick} id={containerId}>
//         {label && (
//           <Spring
//             config={config.default}
//             from={{
//               top: 16,
//             }}
//             to={{
//               top: reveal || value ? -20 : 16,
//             }}
//           >
//             {props => (
//               <label
//                 // @ts-ignore
//                 style={props}
//               >
//                 {label}
//               </label>
//             )}
//           </Spring>
//         )}
//         <Spring
//           config={config.default}
//           from={{
//             transform: value ? 'scaleY(1)' : 'scaleY(0)',
//           }}
//           to={{
//             transform: reveal || value ? 'scaleY(1)' : 'scaleY(0)',
//           }}
//         >
//           {props => select(props)}
//         </Spring>
//       </div>
//       {error && <Text className={`validation-error ${dropDownErrorClassName}`} textType={TextType.paragraph1} fontFamilyVariant={FontFamilyVariant.light} text={error} />}
//     </>
//   );
// }

// export default AnimatedSearchDropdown;
