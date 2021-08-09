// import React, { memo } from 'react';
// import { Menu } from 'antd';
// import { useTranslation } from 'react-i18next';
// import {
//   HomeOutlined,
//   HddOutlined,
//   UsergroupAddOutlined,
// } from '@assets/antdIcons';

// import WFMenuItem  from '@components/Menu';
// import { layoutMessages } from '@layout/messages';
// import { translate } from "@translations/Translater";
// import { APP_MENU_ITEM } from "@constants/config";

// import './style.less';

// interface IProps {
//   className?: string;
//   onMenuChange: (key: string, index: number) => void;
//   selectedKey: string;
// }


// function DashBoardMenu(props: IProps) {

//   const { selectedKey } = props;

//   const { t } = useTranslation();


//   const renderMainMenu = () => {

//     return (
//         <Menu
//           mode="inline"
//           theme='dark'
//           defaultSelectedKeys={[APP_MENU_ITEM.DASHBOARD]}
//           selectedKeys={[selectedKey]}
//           onClick={menuItemClicked}
//         >
//            <WFMenuItem key={APP_MENU_ITEM.DASHBOARD}>
//              <div className="vertical_menu">
//                {<HomeOutlined />}
//                {translate(t, layoutMessages.dashboardMenu)}
//              </div>
//            </WFMenuItem>
//            <WFMenuItem key={APP_MENU_ITEM.COHORTS}>
//              <div className="vertical_menu">
//               {<UsergroupAddOutlined />}
//               {translate(t, layoutMessages.cohortsMenu)}
//             </div>
//            </WFMenuItem>
//            <WFMenuItem key={APP_MENU_ITEM.VENTURES}>
//              <div className="vertical_menu">
//                {<HddOutlined />}
//                {translate(t, layoutMessages.venturesMenu)}
//              </div>
//            </WFMenuItem>
//         </Menu>
//     );

//   }


//   const menuItemClicked = (item: any) => {
//     props.onMenuChange(item.key,  item.item.props.index);
//   }


//   return (
//     <div className="dashboard_menu_container">
//       {renderMainMenu()}
//     </div>
//   );
// }

// export default memo(DashBoardMenu);
