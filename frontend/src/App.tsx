import { ComponentExample } from "@/components/component-example";
import { ThemeProvider } from "@/components/theme-provider"
import { useCafe } from "./hooks/useCafe";



export function App() {
    const { data } = useCafe();


    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <h1>{data!.cafe.name}</h1>
            <p>Роль: {data!.role}</p>

            <ComponentExample />
        </ThemeProvider>
    )
}
export default App;