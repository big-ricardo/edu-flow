import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ChakraProvider } from "@chakra-ui/react";
import Theme from "./styles/theme";
import { QueryClient, QueryClientProvider } from "react-query";
import AuthContext from "./contexts/AuthContext";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider theme={Theme}>
      <QueryClientProvider client={queryClient}>
        <AuthContext>
          <App />
        </AuthContext>
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
);
