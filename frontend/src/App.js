import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import Login from './components/Login';
import Register from './components/Register';
import AuthLogin from './components/AuthLogin';
import AuthRegister from './components/AuthRegister';
import RoleBased from './components/RoleBased';
import FileUpload from './components/FileUpload';
import RoleUser from './components/RoleUser';
import FileDownload from './components/FileDownload';
import Home from './components/Home';
import FileShare from './components/FileShare';
import RoleAdmin from './components/RoleAdmin';
const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth-login" element={<AuthLogin />} />
          <Route path="/auth-register" element={<AuthRegister />} />
          <Route path="/rolebased" element={<RoleBased />} />
          <Route path="/fileupload" element={<FileUpload />} />
          <Route path="/roleuser" element={<RoleUser />} />
          <Route path="/filedownload" element={<FileDownload />} />
          <Route path="/fileshare" element={<FileShare />} />
          <Route path="/roleadmin" element={<RoleAdmin />} />
        </Routes>
      </Router>
    </Provider>
  );
};
 
export default App;