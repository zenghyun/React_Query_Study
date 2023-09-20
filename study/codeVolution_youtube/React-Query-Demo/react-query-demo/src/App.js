import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./App.css";
import { HomePage } from "./components/HomePage";
import { RQSuperHeroesPage } from "./components/RQSuperHeroesPage";
import { SuperHeroesPage } from "./components/SuperHeroesPage";
import RootLayout from "./components/RootLayout";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/super-heroes",
        element: <SuperHeroesPage />,
      },
      {
        path: "/rq-super-heroes",
        element: <RQSuperHeroesPage />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

export default App;
