import Sidebar from "./components/Sidebar";
import SpacesPage from "./pages/SpacesPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <>
      <Sidebar />
      <main id="main" className="workspace">
        <SpacesPage />
        <HomePage />
      </main>
    </>
  )
}

export default App;