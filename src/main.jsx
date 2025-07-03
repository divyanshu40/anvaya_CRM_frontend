import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import App from "./App";
import LeadListPage from "./pages/LeadList";
import LeadManagementPage from "./pages/LeadManagement";
import SalesAgentManagementPage from "./pages/SalesAgentManagement";
import LeadsByStatusPage from "./pages/LeadsByStatus";
import LeadsBySalesAgentPage from "./pages/LeadsBySalesAgent";
import ReportPage from "./pages/Report";

const routerInstance = createBrowserRouter([
  {
    path: "/",
    element: <App/>
  },
  {
    path: "/leads",
    element: <LeadListPage/>
  },
  {
    path: "/lead/:id",
    element: <LeadManagementPage/>
  },
  {
    path: "/salesAgents",
    element: <SalesAgentManagementPage/>
  },
  {
    path: "/leadsByStatus",
    element: <LeadsByStatusPage/>
  },
  {
    path: "/leadsBySalesAgent",
    element: <LeadsBySalesAgentPage/>
  },
  {
    path: "/report",
    element: <ReportPage/>
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={routerInstance}/>
  </StrictMode>
)