import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './Signup'
import Login from './Login'
import UploadList from './UploadList'
import AddAgent from './AddAgent';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Header from './Header';
import ProtectedRoute from './ProtectedRoute';

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/register' element={<Signup />} />
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/upload-list' element={
          <ProtectedRoute>
            <UploadList />
          </ProtectedRoute>
        } />
        <Route path='/add-agent' element={
          <ProtectedRoute>
            <AddAgent />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App
