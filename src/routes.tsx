import type { RouteObject } from "react-router";
import NavBar from "./components/NavBar";
import RequireAuth from "./components/RequireAuth";

import Home from "./routes/Home";
import About from "./routes/About";
import LogIn from "./routes/LogIn";
import SignUp from "./routes/SignUp";
import EmailVerification from "./routes/EmailVerification";
import ResetPassword from "./routes/ResetPassword";
import TripDetails from "./routes/TripDetails";

import AddTrip from "./routes/AddTrip";
import MyTrips from "./routes/MyTrips";
import UpdateTrip from "./routes/UpdateTrip";
import { ToastContainer } from "react-toastify";
import  { UserProvider } from "./services/useAuth";

const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <UserProvider>
        <>
          <NavBar />
          <ToastContainer />
        </>
      </UserProvider>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "login", element: <LogIn /> },
      { path: "sign-up", element: <SignUp /> },
      { path: "verify-email", element: <EmailVerification /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "trip-details/:id", element: <TripDetails /> },
      {
        element: <RequireAuth />,
        children: [
          { path: "add-destination", element: <AddTrip /> },
          { path: "my-trips", element: <MyTrips /> },
          { path: "update-trip/:id", element: <UpdateTrip /> },
        ],
      },
    ],
  },
];

export default routes;