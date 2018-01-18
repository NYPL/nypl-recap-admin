import ApplicationContainer from '../containers/ApplicationContainer/ApplicationContainer';
import SystemDashboard from '../containers/SystemDashboard/SystemDashboard';
import UpdateMetadata from '../containers/UpdateMetadata/UpdateMetadata';
import NotFound from '../components/NotFound/NotFound';

const routes = [
  {
    component: ApplicationContainer,
    routes: [
      {
        path: '/systems-status',
        exact: true,
        component: SystemDashboard
      },
      {
        path: '/update-metadata',
        exact: true,
        component: UpdateMetadata
      },
      {
        path: '*',
        component: NotFound
      }
    ]
  }
];

export default routes;
