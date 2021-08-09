// import React, { ReactNode } from "react";

// import "./styles.less";

// export enum TextType {
//   display1 = "display1",
//   display2 = "display2",

//   h1 = "h1",
//   h2 = "h2",
//   h3 = "h3",
//   h4 = "h4",
//   h5 = "h5",
//   h6 = "h6",
//   h7 = "h7",
//   h8 = "h8",

//   subHeading1 = "subHeading1",
//   subHeading2 = "subHeading2",

//   paragraph1 = "paragraph1",
//   paragraph2 = "paragraph2",

//   caption1 = "caption1",
//   caption2 = "caption2",
// }

// export enum FontFamilyVariant {

//     light = 'light',
//     regular = 'regular',
//     medium = 'medium',
//     bold = 'bold',
//     semibold = 'semibold',
//     black = 'black',
//     regular1 = 'regular1',
//     medium1 = 'medium1',
//     bold1 = 'bold1',
//     bold2 = 'bold2',
//     bold3 = 'bold3',
//     medium2 = 'medium2',
//     bold4 = 'bold4'
// }

// interface IProps {
//   textType: TextType;
//   fontFamilyVariant: FontFamilyVariant;
//   text: string | ReactNode;

//   // other font properties

//   className?: string;
//   // Please don't override following properties in the className
//   //  font-family, font-size, line-height, letter-spacing, opacity

//   // ellipsis?: boolean; // after how many lines?
// }

// const Text = (props: IProps) => {
//     const { text, textType, fontFamilyVariant, className } = props;

//     const customStyle = className ? `${fontFamilyVariant} ${className}` : fontFamilyVariant;

//     switch (textType) {
//         case TextType.display1:
//             return <span className={`display1 ${customStyle}`}>{text}</span>;
//         case TextType.display2:
//             return <span className={`display2 ${customStyle}`}>{text}</span>;
//         case TextType.h1:
//             return <h1 className={`h1 ${customStyle}`}>{text}</h1>;
//         case TextType.h2:
//             return <h2 className={`h2 ${customStyle}`}>{text}</h2>;
//         case TextType.h3:
//             return <h3 className={`h3 ${customStyle}`}>{text}</h3>;
//         case TextType.h4:
//             return <h4 className={`h4 ${customStyle}`}>{text}</h4>;
//         case TextType.h5:
//             return <h5 className={`h5 ${customStyle}`}>{text}</h5>;
//         case TextType.h6:
//             return <h6 className={`h6 ${customStyle}`}>{text}</h6>;
//         case TextType.h7:
//             return <span className={`h7 ${customStyle}`}>{text}</span>;
//         case TextType.h8:
//             return <span className={`h8 ${customStyle}`}>{text}</span>;
//         case TextType.subHeading1:
//             return <h1 className={`sub-h1 ${customStyle}`}>{text}</h1>;
//         case TextType.subHeading2:
//             return <h2 className={`sub-h2 ${customStyle}`}>{text}</h2>;
//         case TextType.paragraph1:
//             return <p className={`para1 ${customStyle}`}>{text}</p>;
//         case TextType.paragraph2:
//             return <p className={`para2 ${customStyle}`}>{text}</p>;
//         case TextType.caption1:
//             return <caption className={`caption1 ${customStyle}`}>{text}</caption>;
//         case TextType.caption2:
//             return <caption className={`caption2 ${customStyle}`}>{text}</caption>;
//     }

// }

// export default Text;
