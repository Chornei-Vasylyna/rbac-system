import { RouterProvider } from "react-router-dom";
import { AppProviders } from "./providers/AppProviders.tsx";
import { router } from "./router/router.tsx";

export const App = () => (
   <AppProviders>
      <RouterProvider router={router} />
   </AppProviders>
);
