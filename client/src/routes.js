import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Connect from './components/layout/Connect';
import Verify from './components/auth/Verify';
import Forget from './components/auth/Forget';
import Reset from './components/auth/Reset';
import Dashboard from './components/dashboard/Dashboard';
import DashboardEdit from './components/editprofile/DashboardEdit';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import FirstVisit from './components/firstvisit/FirstVisit';
import Notifications from './components/notification/Notifications';
import Chat from './components/chat/chat';
import Conversation from './components/chat/conversation';

const routes = [
    {
      path: '/login',
      component: Login,
      privateRoute: false,
    },
    {
      path: '/register',
      component: Register,
      privateRoute: false,
    },
    {
      path: '/verify',
      component: Verify,
      privateRoute: false,
    },
    {
      path: '/forget',
      component: Forget,
      privateRoute: false,
    },
    {
      path: '/reset',
      component: Reset,
      privateRoute: false,
    },
    {
      path: '/connect',
      component: Connect,
      privateRoute: true,
    },
    {
      path: '/firstvisit',
      component: FirstVisit,
      privateRoute: true,
    },
    {
      path: '/profiles',
      component: Profiles,
      privateRoute: true,
    },
    {
      path: '/profile/:id',
      component: Profile,
      privateRoute: true,
    },
    {
      path: '/dashboard',
      component: Dashboard,
      privateRoute: true,
    },
    {
      path: '/editprofile',
      component: DashboardEdit,
      privateRoute: true,
    },
    {
      path: '/notifications',
      component: Notifications,
      privateRoute: true,
    },
    {
      path: '/conversation/:id',
      component: Conversation,
      privateRoute: true,
    },
    {
      path: '/chat',
      component: Chat,
      privateRoute: true,
    },
  ];

export default routes;