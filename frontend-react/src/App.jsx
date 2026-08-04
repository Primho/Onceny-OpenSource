import Sidebar from "./components/Sidebar";
import SpacesPage from "./pages/SpacesPage";

function App() {
  return (
    <>
      <Sidebar />
      <main id="main" className="workspace">
        <SpacesPage />
      </main>
    </>
  )
}

export default App;