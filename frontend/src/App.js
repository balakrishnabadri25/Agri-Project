import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Dashboard from '@/pages/Dashboard';
import UploadImage from '@/pages/UploadImage';
import UploadSoilData from '@/pages/UploadSoilData';
import ReportPage from '@/pages/ReportPage';
import '@/App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload-image/:fieldId" element={<UploadImage />} />
          <Route path="/upload-soil/:fieldId" element={<UploadSoilData />} />
          <Route path="/report/:fieldId" element={<ReportPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;