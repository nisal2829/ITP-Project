import {BrowserRouter ,Routes,Route } from 'react-router-dom';
//index
import Home from './Pages/Home';

//savinda
import SAbout from './Pages/savinda/About';
import SSignin from './Pages/savinda/Signin';
import SSignUp from './Pages/savinda/SignUp';
import SProfile from './Pages/savinda/Profile';
import SHeader from './components/savinda/header';
import SPrivateRoutes from './components/savinda/PrivateRoutes';
import SAddItem from './Pages/savinda/AddItem';
import SItemProfile from './Pages/savinda/ItemProfile';
import SAllDetails from './Pages/savinda/AllDetails';
import SUpdateItem from './Pages/savinda/UpdateItem';
import SOneShow from './Pages/savinda/OneSHow';
import SCreateInvoice from './Pages/savinda/InvoiceComponent/createInvoice';

//hiruni
import HAbout from './Pages/hiruni/About';
import HSignin from './Pages/hiruni/Signin';
import HSignUp from './Pages/hiruni/SignUp';
import HProfile from './Pages/hiruni/Profile';
import HHeader from './components/hiruni/header';
import HPrivateRoutes from './components/hiruni/PrivateRoutes';
import HAddItem from './Pages/hiruni/AddItem';
import HItemProfile from './Pages/hiruni/ItemProfile';
import HAllDetails from './Pages/hiruni/AllDetails';
import HUpdateItem from './Pages/hiruni/UpdateItem';

//nisal
import NSignin from './Pages/nisal/Signin';
import NSignUp from './Pages/nisal/SignUp';
import NProfile from './Pages/nisal/Profile';
import NHeader from './components/nisal/header';
import NMHeader from './components/nisal/managerHeader.';
import NFooter from './components/nisal/Footer';
import NPrivateRoutes from './components/nisal/PrivateRoutes';
import NAddStaff from './Pages/nisal/AddStaff';
import NStaffDetailsProfile from './Pages/nisal/StaffDetailsProfile';
import NUpdateStaff from './Pages/nisal/UpdateStaff';
import NManagerSignUp from './Pages/nisal/Manager/ManagerSignUp';
import NManagerSignin from './Pages/nisal/Manager/ManagerSignin';
import NManagerProfile from './Pages/nisal/Manager/ManagerProfile';
import NAddTask from './Pages/nisal/Tasks/AddTask';
import NAllTask from './Pages/nisal/Tasks/AllTask';
import NUpdateTask from './Pages/nisal/Tasks/UpdateTask';
import NManagerAllDetails from './Pages/nisal/Manager/ManagerAllDetails';
import NAdminAllTask from './Pages/nisal/Manager/AdminAllTask';
import NHome from './Pages/nisal/Home'







export default function App() {
  return <BrowserRouter>

  <Routes>
  <Route path="/" element={<Home/>}></Route>
    //savinda
    <Route path="/savinda" element={<div><SHeader /><SAllDetails/></div>}></Route>
    <Route path="/sabout" element={<div><SHeader /><SAbout/></div>}></Route>
    <Route path="/ssign-in" element={<div><SHeader /><SSignin/></div>}></Route>
    <Route path="/sadditem" element={<div><SHeader /><SAddItem/></div>}></Route>
    <Route path="/ssign-up" element={<div><SHeader /><SSignUp/></div>}></Route>
    <Route path="/sonepet/:id" element={<div><SHeader /><SOneShow/></div>}></Route>
    <Route path="/sCreateInvoice" element={<div><SHeader /><SCreateInvoice/></div>}></Route>
    <Route element={<SPrivateRoutes/>}>
    <Route path="/sprofile" element={<div><SHeader /><SProfile/></div>}></Route>
    <Route path="/sitems" element={<div><SHeader /><SItemProfile/></div>}></Route>
    <Route path="/supdate-item/:id" element={<div><SHeader /><SUpdateItem/></div>}></Route>
    </Route>


    //hiruni
    <Route path="/hiruni" element={<div><HHeader /><HAllDetails/></div>}></Route>
    <Route path="/about" element={<div><HHeader /><HAbout/></div>}></Route>
    <Route path="/sign-in" element={<div><HHeader /><HSignin/></div>}></Route>
    <Route path="/additem" element={<div><HHeader /><HAddItem/></div>}></Route>
    <Route path="/sign-up" element={<div><HHeader /><HSignUp/></div>}></Route>
    <Route element={<HPrivateRoutes/>}>
    <Route path="/profile" element={<div><HHeader /><HProfile/></div>}></Route>
    <Route path="/items" element={<div><HHeader /><HItemProfile/></div>}></Route>
    <Route path="/update-item/:id" element={<div><HHeader /><HUpdateItem/></div>}></Route>
    </Route>

    //nisal
    <Route path="/nisal" element={<div><NHeader/><NHome/><NFooter/></div>}></Route>
    <Route path="/Nlogin-manager" element={<div><NHeader/><NManagerAllDetails/><NFooter/></div>}></Route>
    <Route path="/NAllTask" element={<div><NHeader/><NAllTask/><NFooter/></div>}></Route>
    <Route path="/NAdminAllTask" element={<div><NHeader/><NAdminAllTask/><NFooter/></div>}></Route>
    <Route path="/Nmanager-sign-up" element={<div><NMHeader/><NManagerSignUp/><NFooter/></div>}></Route>
    <Route path="/Nmanager-sign-in" element={<div><NMHeader/><NManagerSignin/><NFooter/></div>}></Route>
    <Route path="/NAddTask" element={<div><NHeader/><NAddTask/><NFooter/></div>}></Route>
    <Route path="/Nsign-in" element={<div><NHeader/><NSignin/><NFooter/></div>}></Route>
    <Route path="/NAddStaff" element={<div><NHeader/><NAddStaff/><NFooter/></div>}></Route>
    <Route path="/Nsign-up" element={<div><NHeader/><NSignUp/><NFooter/></div>}></Route>
    <Route element={<NPrivateRoutes/>}>
    <Route path="/Nprofile" element={<div><NHeader/><NProfile/><NFooter/></div>}></Route>
    <Route path="/NManagerProfile" element={<div><NHeader/><NManagerProfile/><NFooter/></div>}></Route>
    <Route path="/NStaffDetailsProfile" element={<div><NHeader/><NStaffDetailsProfile/><NFooter/></div>}></Route>
    <Route path="/Nupdate-staff/:id" element={<div><NHeader/><NUpdateStaff/><NFooter/></div>}></Route>
    <Route path="/Nupdate-task/:id" element={<div><NHeader/><NUpdateTask/><NFooter/></div>}></Route>
    </Route>
 
  </Routes>
  
  </BrowserRouter>
  
}
