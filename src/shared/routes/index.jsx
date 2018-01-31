import ApplicationContainer from '../containers/ApplicationContainer/ApplicationContainer';
import TransferMetadata from '../containers/TransferMetadata/TransferMetadata';
import UpdateMetadata from '../containers/UpdateMetadata/UpdateMetadata';
import NotFound from '../components/NotFound/NotFound';

const routes = [
  {
    component: ApplicationContainer,
    routes: [
      {
        path: '/transfer-metadata',
        exact: true,
        component: TransferMetadata
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
