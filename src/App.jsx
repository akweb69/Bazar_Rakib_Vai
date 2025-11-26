import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePageLayout from './Layout/HomePageLayout';
import HomePage from './Layout/HomePage';
import NotFound404 from './Common/NotFound404';
import AdminLayout from './Admin/Layout/AdminLayout';
import { Toaster } from 'react-hot-toast';
import ProductsManagement from './Admin/Pages/ProductsManagement';
import AdminDash from './Admin/Pages/AdminDash';
import CategoryManagement from './Admin/Pages/CategoryManagement';
import SignupForm from './Pages/SignupForm';
import LoginForm from './Pages/LoginForm';


function App() {



  return (
    <>
      {/* react hot toast */}
      <Toaster />

      {/* Routes */}
      <Router>
        <Routes>
          {/* every page that needs the shell sits under this layout route */}
          <Route path="/" element={<HomePageLayout />}>
            {/* index => shows up by default when url is "/" */}
            <Route index element={<HomePage />} />
            <Route path="signup" element={<SignupForm />} />
            <Route path="login" element={<LoginForm />} />


          </Route>
          {/* admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDash />} />
            <Route path="products" element={<ProductsManagement />} />
            <Route path="category" element={<CategoryManagement />} />


          </Route>

          {/* Not Found 404 Page */}
          <Route path="*" element={<NotFound404 />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;