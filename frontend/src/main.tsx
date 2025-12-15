import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { CafeProvider } from "./context/CafeProvider";


import "./index.css"
import App from "./App.tsx"
import { CafeLayout } from "./components/CafeLayout.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CafeProvider>
      <CafeLayout>
        <App />
      </CafeLayout>
    </CafeProvider>
  </StrictMode>
)
