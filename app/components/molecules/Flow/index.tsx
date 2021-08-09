// import React, { ReactNode } from "react";
// import "./styles.less";


// export enum FlowItemState {
//     disabled = "disabled",
//     inProgress = "inProgress",
//     complete = "complete",
// }

// export interface IFlowItem {
//     itemState: FlowItemState
//     title: string;
//     status?: ReactNode;
//     onClick?: () => void;    
// }
 
// interface IProps {
//     className?: string;
//     sectionTitle?: string;
//     flowItems: IFlowItem[]
// }

// export const Flow = (props: IProps) => {
//   const { flowItems, sectionTitle, className } = props;

//   const style = ["container", className].join(' ');

//   return (
//     <div className={style}>
//       {sectionTitle && <div className="section_title">{sectionTitle}</div>}
//       <div className="flow_container">
//         {flowItems.map(
//           (item: IFlowItem, index: number) => {

//             const onClick = () => {
//                 item.onClick && item.onClick()
//             };

//             const Separator = () => {
//               return <div className="separator" />;
//             };

//             const badgeStyle = (): string => {
//                 switch (item.itemState) {
//                     case FlowItemState.disabled:
//                         return "disabled"
//                     case FlowItemState.inProgress:
//                         return "inprogress"
//                     case FlowItemState.complete:
//                         return "complete"
//                     default:
//                         return "disabled"
//                 }
                
//             }

//             return (
//               <>
//                 <div className="item_wrapper">
//                     <div className={"badge " + badgeStyle()} >{index + 1}</div>
//                   <div className="title" onClick={onClick}>{item.title}</div>
//                   {item.status}
//                 </div>
//                 {index < flowItems.length - 1 && <Separator />}
//               </>
//             );
//           }
//         )}
//       </div>
//     </div>
//   );
// };
