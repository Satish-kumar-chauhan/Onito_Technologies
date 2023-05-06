import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DataTables from "./Components/DataTables";
import Navbar from "./Components/Navbar";
import DetailForm from "./Components/form";

function App() {
  return (
    <Router>
      <div className="App p-2 bg-gray-200 h-screen w-screen text-[14px] text-gray-900">
        <div className="shadow-lg p-2 rounded-lg">
        <Navbar />
        <div className="mt-2">
          <Routes>
            <Route index path="/" element={<DetailForm />} />
            <Route path="/saved" element={<DataTables />} />
          </Routes>
        </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
