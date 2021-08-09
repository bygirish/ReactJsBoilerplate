// import React, { Component } from "react";
// import { withTranslation } from "react-i18next";
// import { connect } from "react-redux";
// import { compose } from "redux";
// import { withRouter } from "react-router-dom";
// import { Dropdown, Layout, Menu } from "antd";
// import { Logger } from "@utils/Logger";
// import { ChatIcon } from "@assets/images";
// import { Logo, NotificationBell, profile_icon } from "@assets/index";
// import { translate } from "@translations/Translater";

// import ContentWrapper from "@components/LayoutContainers/ContentWrapper";
// import WFMenuItem from "@components/Menu";
// import Text, { FontFamilyVariant, TextType } from "@components/Text";
// import Navigator from "@navigator/index";
// import { NavigationUrl, URLs } from "@navigator/NavigationUrl";
// import { LayoutUtil } from "@layout/LayoutUtil";
// import { BrowserScrollService } from "@utils/BrowserScrollService";
// import {
//   isAuthenticatedSelector,
//   isWebView,
// } from "@common/redux/auth/selectors";
// import { APP_MENU_ITEM } from "@constants/config";
// import {
//   CalendarOutlined,
//   LogoutOutlined,
//   UserOutlined,
// } from "@assets/antdIcons";
// import { layoutMessages } from "@layout/messages";

// import DashBoardMenu from "./components/DashBoardMenu";
// import TabView from "./components/TabView";
// import "./styles.less";

// const { Header, Sider, Content } = Layout;

// interface IProps {
//   component: React.ComponentType;
//   location: any;
//   isAuthenticated: boolean;
//   t: any;
//   isWebView?: boolean;
// }

// interface IState {
//   current: string;
//   selectedDesktopMenuKey: string;
//   selectedMobileTabKey: string;
// }

// export const mapStateToProps = (state: any) => {
//   return {
//     isAuthenticated: isAuthenticatedSelector(state),
//     location: state.router.location,
//     isWebView: isWebView(state),
//   };
// };

// export const mapDispatchToProps = (dispatch: any) => {
//   return {};
// };

// const setParentRef = (pRef: any) => {
//   BrowserScrollService.init(pRef);
// };

// class Dashboard extends React.Component<IProps, IState> {
//   scrollRef: any;

//   constructor(props) {
//     super(props);
//     this.scrollRef = React.createRef();
//   }

//   state = {
//     selectedDesktopMenuKey: APP_MENU_ITEM.DASHBOARD,
//     selectedMobileTabKey: APP_MENU_ITEM.DASHBOARD,
//     current: "",
//   };

//   public async componentDidMount() {
//     this.setDefaultSelectedMenu();
//     const reactNode = this.scrollRef.current;
//     setParentRef(reactNode);
//   }

//   render() {
//     const { isWebView } = this.props;

//     if (isWebView)
//       return (
//         <Content className="app__layout__inner_content_webview">
//           {this.renderContent()}
//         </Content>
//       );

//     return (
//       <ContentWrapper className="layout_wrapper">
//         <Layout className="app__layout__dash">
//           <Header className="layout_header">{this.renderHeader()}</Header>
//           <Layout className="app__layout__outer_content">
//             <Sider className="app_layout_sider">{this.renderMenu()}</Sider>
//             <Content className="app__layout__inner_content">
//               {this.renderContent()}
//             </Content>
//             <div className="app_layout_sm_tab">
//               <TabView
//                 activeKey={this.state.selectedMobileTabKey}
//                 onChange={this.tabItemClicked}
//               />
//             </div>
//           </Layout>
//         </Layout>
//       </ContentWrapper>
//     );
//   }

//   private renderContent = () => {
//     const Component = this.props.component;
//     return <Component {...this.props} />;
//   };

//   private setSelectedMenu = (selectedKey: string) => {
//     this.setState({
//       selectedDesktopMenuKey: selectedKey,
//       selectedMobileTabKey: selectedKey,
//     });
//   };

//   private setDefaultSelectedMenu = () => {
//     const pathName = this.props.location.pathname;
//     this.setState({
//       selectedDesktopMenuKey: LayoutUtil.getMenuByPathName(pathName),
//       selectedMobileTabKey: LayoutUtil.getMenuByPathName(pathName),
//     });
//   };

//   private menuItemClicked = (key, value) => {
//     this.tabItemClicked(key);
//   };

//   private tabItemClicked = (key: string) => {
//     this.setSelectedMenu(key);
//     let route = "";
//     switch (key) {
//       case APP_MENU_ITEM.DASHBOARD:
//         route = NavigationUrl.generate(URLs.home);
//         break;
//       case APP_MENU_ITEM.COHORTS:
//         route = NavigationUrl.generate(URLs.cohorts);
//         break;
//       case APP_MENU_ITEM.VENTURES:
//         route = NavigationUrl.generate(URLs.venture);
//         break;
//       default:
//         route = NavigationUrl.generate(URLs.home);
//     }
//     Navigator.push(route);
//   };

//   private renderMenu = () => {
//     return (
//       <DashBoardMenu
//         onMenuChange={this.menuItemClicked}
//         selectedKey={this.state.selectedDesktopMenuKey}
//       />
//     );
//   };

//   private renderLogo = () => {
//     return (
//       <div onClick={null} className="layout_logo">
//         <img src={Logo} width={80} />
//       </div>
//     );
//   };

//   private renderHeader = () => {
//     return (
//       <>
//         {this.renderLogo()}
//         {this.renderHeaderMenu()}
//       </>
//     );
//   };

//   private renderHeaderMenu = () => {
//     const { t } = this.props;

//     const USER_OPTIONS: string[] = [
//       translate(t, layoutMessages.myProfileTitle),
//       translate(t, layoutMessages.logoutTitle),
//     ];

//     return (
//       <div className="header_menu_container">
//         <div onClick={this.gotoChat} className="chat_container">
//           <img src={ChatIcon} width={20} />
//         </div>
//         <div onClick={null} className="notification_container">
//           <img src={NotificationBell} width={20} />
//         </div>
//         <div onClick={this.goToCalendar} className="notification_container">
//           <CalendarOutlined size={20} />
//         </div>
//         <Dropdown overlay={this.userOptions(USER_OPTIONS)} trigger={["click"]}>
//           <div className="ml-3 profile_container" onClick={this.avoidDefault}>
//             <img src={profile_icon} width={20} />
//           </div>
//         </Dropdown>
//       </div>
//     );
//   };

//   private gotoChat = () => {
//     Navigator.push(NavigationUrl.generate(URLs.messages));
//   };

//   private goToCalendar = () => {
//     Navigator.push(NavigationUrl.generate(URLs.calendar));
//   };

//   private logOut = () => {
//     Navigator.push(NavigationUrl.generate(URLs.logout));
//   };

//   private openUserProfile = () => {};

//   private menuItem = (key, value) => {
//     const { t } = this.props;

//     let icon = null;
//     if (value === translate(t, layoutMessages.myProfileTitle)) {
//       icon = <UserOutlined />;
//     } else if (value === translate(t, layoutMessages.logoutTitle)) {
//       icon = <LogoutOutlined />;
//     }

//     return (
//       <WFMenuItem key={key}>
//         <div className="app__layout_menu_item">
//           {icon}&nbsp;
//           <Text
//             textType={TextType.subHeading1}
//             fontFamilyVariant={FontFamilyVariant.semibold}
//             text={value}
//             className="menu_dropdown_style"
//           />
//         </div>
//       </WFMenuItem>
//     );
//   };

//   private userOptions = (USER_OPTIONS: string[]) => {
//     const userOptions = USER_OPTIONS.map((item: string, index: number) =>
//       this.menuItem(index, item)
//     );
//     return <Menu onClick={this.handleUserOptionSelection}>{userOptions}</Menu>;
//   };

//   private avoidDefault = (e) => e.preventDefault();

//   private handleUserOptionSelection = ({ key }) => {
//     if (key === "1") {
//       this.logOut();
//     } else if (key === "0") {
//       this.openUserProfile();
//     } else {
//       Logger.info(
//         "Dashboard - handleUserOptionSelection() Option not handled - " + key
//       );
//     }
//   };
// }

// export default compose(
//   connect(
//     mapStateToProps,
//     mapDispatchToProps
//   ),
//   withTranslation()
// )(withRouter(Dashboard));
