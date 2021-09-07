const Auth = {
  login: '/login',
  register: '/register',
  forgotPassword: '/forgotPassword',
  resetPassword: '/resetPassword',
  changePassword: '/changePassword',
  logout: '/logout',
  guest: '/guest',
  enrollCohort: '/enroll-cohort'
};

const Home = {
  default: '/',
  home: '/dashboard',
  lang: '/:lang(en|es)',
};


const FormBuilder = {
  default: '/form-builder',

};


const PageNotFound = {
  notFound: '/404',
}



export const Routes = {
  Auth,
  Home,
  FormBuilder,
  PageNotFound,
};
