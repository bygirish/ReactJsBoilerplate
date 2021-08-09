// import React from 'react';
// import Img from 'react-cool-img';
// import { Retry, Options } from '../../Image';

// interface IProps {
//   className?: string;
//   // Aspect Ratio Examples - For 2:1, specify 0.5 (1/2)  & For 4:3, specify - 0.75 (3/4)
//   aspectRatio?: number;
//   placeholder?: string;
//   src: string;
//   error?: string;
//   decode?: boolean;
//   lazy?: boolean;
//   cache?: boolean;
//   debounce?: number;
//   observerOptions?: Options;
//   retry?: Retry;
//   srcSet?: string;
//   sizes?: string;
//   onError?: (event: any) => void;
//   onLoad?: (event: any) => void;
//   onClick?: () => void;
// }

// export default function (props: IProps) {
//     const { className, aspectRatio, ...rest } = props;

//     if (aspectRatio) {
//         const style = ['wf_image_container', className].join(' ');
//         return (
//             <div className={style} style={{ paddingTop: `${aspectRatio * 100}%` }}>
//                 <Img className="image" {...rest} />
//             </div>
//         );
//     }

//     const style = ['wf_image', className].join(' ');
//     return <Img className={style} {...rest} />;
// }
