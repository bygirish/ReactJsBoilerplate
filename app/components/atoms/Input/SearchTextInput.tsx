// import React, { useEffect, useState } from 'react';
// import { WFImg, WFNormalInput } from '@components/index';
// import { CloseModal, SearchInputIcon } from '@assets/index';
// import { MINIMUM_SEARCH_CHAR_LIMIT } from '@constants/config';

// interface IProps {
//   searchKeyword: string;
//   onSearchKeywordChange: (keyword: string) => void;
//   onEnterPressed?: (e: any) => void;
//   onCancelPressed?: () => void;
//   isModalTextInput?: boolean;
//   placeholder?: string;
//   className?: string;
// }

// const SearchTextInput = (props: IProps) => {
//   const {
//     searchKeyword,
//     onSearchKeywordChange,
//     onEnterPressed,
//     placeholder,
//     className
//   } = props;

//   let [updatedKeyword, setUpdatedKeyword] = useState<string>(searchKeyword);

//   const onChange = e => {
//     const keyword = e.target.value;
//     setUpdatedKeyword(keyword);
//   };

//   const onPressCancel = () => {
//     setUpdatedKeyword('');
//     const { onCancelPressed } = props;
//     onCancelPressed && onCancelPressed();
//   };

//   const onPressEnter = (e: any) => {
//     const keyword: string = e.target.value;
//     onEnterPressed && onEnterPressed(keyword);
//   };

//   useEffect(() => {
//     var timer = setTimeout(() => {
//         const updatedKeywordTrimmed = updatedKeyword.trim();
//       if (updatedKeywordTrimmed.length >= MINIMUM_SEARCH_CHAR_LIMIT || updatedKeywordTrimmed.length === 0)
//         onSearchKeywordChange && onSearchKeywordChange(updatedKeywordTrimmed);
//     }, 500);

//     return function() {
//       clearTimeout(timer);
//     };
//   }, [updatedKeyword]);

//   useEffect(() => {
//     setUpdatedKeyword(searchKeyword);
//   }, [searchKeyword]);


//   const style = className || 'wf_search_input';

//   return (
//     <div className={style}>
//       <WFNormalInput
//         placeholder={placeholder}
//         suffix={
//           <div>
//             <WFImg src={SearchInputIcon} className="search_icon" />
//             <span onClick={onPressCancel}>
//               <WFImg src={CloseModal} className="close_modal_button" />
//             </span>
//           </div>
//         }
//         prefix={<div className="prefix" />}
//         className="input"
//         autoFocus={true}
//         type={'search'}
//         value={updatedKeyword}
//         onChange={onChange}
//         onPressEnter={onPressEnter}
//       />
//     </div>
//   );
// };


// export default SearchTextInput;
