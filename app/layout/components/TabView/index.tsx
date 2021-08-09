// import React, { memo } from "react";
// import { useTranslation } from 'react-i18next';
// import { Tabs } from 'antd';
// import {
//   HomeOutlined,
//   HddOutlined,
//   UsergroupAddOutlined,
// } from '@assets/antdIcons';

// import { layoutMessages } from '@layout/messages';
// import { translate } from "@translations/Translater";
// import { APP_MENU_ITEM } from "@constants/config";


// const { TabPane } = Tabs;

// import "./styles.less";

// interface IProps {
//     className?: string;
//     activeKey: string;
//     onChange: (key: string) => void;
//     tabPosition?: string;
//     size?: any;
// }


// export const TabView = (props: IProps) => {

//   const { activeKey, size, className } = props;
//   const { t } = useTranslation();

//   const style = ["tab_container", className].join(' ');

//   const tabItemClicked = (item: string) => {
//     console.log('tabClicked key =>', item);

//     props.onChange(item);
//   }


//     return (
//       <Tabs
//         className={style}
//         onChange={tabItemClicked}
//         activeKey={activeKey}
//         size={size}
//         centered
//       >
//         <TabPane key={APP_MENU_ITEM.DASHBOARD}
//         tab={
//            <div className="tab_menu">
//              <HomeOutlined />
//              {translate(t, layoutMessages.dashboardMenu)}
//            </div>
//          }
//         >
//         </TabPane>
//         <TabPane key={APP_MENU_ITEM.COHORTS}
//           tab={
//           <div className="tab_menu">
//             {<UsergroupAddOutlined />}
//             {translate(t, layoutMessages.cohortsMenu)}
//           </div>
//         }
//         >
//         </TabPane>
//         <TabPane key={APP_MENU_ITEM.VENTURES}
//         tab={
//           <div className="tab_menu">
//             {<HddOutlined />}
//             {translate(t, layoutMessages.venturesMenu)}
//           </div>
//         }
//         >
//         </TabPane>
//       </Tabs>
//     );




// }

// export default memo(TabView);
