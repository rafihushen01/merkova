import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { AnimatePresence, motion } from 'framer-motion'
import { useSelector } from 'react-redux'

import Home from './pages/Home'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import ForgetPassword from './pages/components/ForgetPassword'
import Homebanner from './pages/Admin/Homebanner'
import useGetCurrentUser from './Hooks/Usegetcurrentuser'
import SellerSignup from './seller/SellerSignup'
import SellerProfile from './seller/SellerProfile'
import CreateShop from './seller/CreateShop'
import EditShop from './seller/EditShop'
import Navcus from './pages/superadmin/Navcus'
import Campaign from './pages/superadmin/Campaign'
import SellerShopapproval from './pages/superadmin/SellerShopapproval'
import SellerApproval from './seller/SellerApproval'
import CreatedShop from './pages/superadmin/CreatedShop'
import ClaimShop from './seller/ClaimShop'
import useCurrentShopOwner from './Hooks/useCurrentShopOwner'
import CreateItem from './seller/CreateItem'
import Allitem from './seller/Allitem'
import Edititem from './seller/Edititem'
import SellerShopView from './seller/SellerShopView'
import CreateCategory from './pages/superadmin/CreateCategory'
import Productpage from './pages/Customers/Productpage'
import Storepage from './pages/Customers/Storepage'
import SellerHomeBanner from './pages/superadmin/SellerHomebanner'
import SellerCentralDash from './pages/SellerCentral/SellerCentralDash'
import StoreDecor from './seller/StoreDecor'
import MerkovaChat from './seller/MerkovaChat'
import MerkovaSuperAdminChat from './pages/superadmin/MerkovaSuperAdminChat'
import WhyChooseMerkova from './pages/Customers/securtiy/Security'
import AboutMerkova from './pages/Customers/FooterComponents/AboutMerkova'



export const serverurl = import.meta.env.VITE_SERVER_URL

// ================== PAGE ANIMATION ==================
const pageanimation = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
  transition: { duration: 0.4, ease: 'easeInOut' },
}

// ================== PROTECTED ROUTE ==================
const ProtectedRoute = ({ children }) => {
  const { userData } = useSelector(state => state.user)
  return userData ? children : <Navigate to="/signin" replace />
}

// ================== PUBLIC ROUTE ==================
const PublicRoute = ({ children }) => {
  const { userData } = useSelector(state => state.user)
  return !userData ? children : <Navigate to="/" replace />
}

const App = () => {
  const { userData } = useSelector(state => state.user)

  const { loading: currentUserLoading } = useGetCurrentUser()
  useCurrentShopOwner(Boolean(userData))

  if (currentUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black">
        Loading application...
      </div>
    )
  }

  return (



    <div className="min-h-screen   overflow-hidden">

      <AnimatePresence mode="wait">
        <Routes>

          {/* ================= HOME ================= */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <motion.div {...pageanimation}>
                  <Home />
                </motion.div>
              </ProtectedRoute>
            }
          />

          {/* ================= SIGNUP ================= */}
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <motion.div {...pageanimation}>
                  <Signup />
                </motion.div>
              </PublicRoute>
            }
          />
             <Route
            path="/sellersignup"
            element={
         
                <motion.div {...pageanimation}>
                  <SellerSignup />
                </motion.div>
            
            }
          />
                <Route
            path="/sellerhomebanner"
            element={
         
                <motion.div {...pageanimation}>
                  <SellerHomeBanner />
                </motion.div>
            
            }
          />
                    <Route
            path="/whychooseus"
            element={
         
                <motion.div {...pageanimation}>
                  <WhyChooseMerkova />
                </motion.div>
            
            }
          />
                       <Route
            path="/AboutMerkova"
            element={
         
                <motion.div {...pageanimation}>
                  <AboutMerkova />
                </motion.div>
            
            }
          />
                    <Route
            path="/MerkovaSellerCentral"
            element={
         
                <motion.div {...pageanimation}>
                  <SellerCentralDash/>
                </motion.div>
            
            }
          />

               <Route
            path="/categorycreator"
            element={
         
                <motion.div {...pageanimation}>
                  <CreateCategory />
                </motion.div>
            
            }
          />
                         <Route
            path="seller/storedecor"
            element={
         
                <motion.div {...pageanimation}>
                  <StoreDecor />
                </motion.div>
            
            }
          />








          
                       <Route
            path="/createitem"
            element={
         
                <motion.div {...pageanimation}>
                  <CreateItem />
                </motion.div>
            
            }
          />


                           <Route
            path="/products/:itemid"
            element={
         
                <motion.div {...pageanimation}>
                  <Productpage />
                </motion.div>
            
            }
          />


                       <Route
            path="/SellerShopView"
            element={
         
                <motion.div {...pageanimation}>
                  <SellerShopView />
                </motion.div>
            
            }
          />
                             <Route
            path="/seller/edititem/:itemid"
            element={
         
                <motion.div {...pageanimation}>
                  <Edititem />
                </motion.div>
            
            }
          />
                           <Route
            path="/AllShopItems"
            element={
         
                <motion.div {...pageanimation}>
                  <Allitem />
                </motion.div>
            
            }
          />
          {/* ================= SIGNIN ================= */}
          <Route
            path="/signin"
            element={
              <PublicRoute>
                <motion.div {...pageanimation}>
                  <Signin />
                </motion.div>
              </PublicRoute>
            }
          />


              <Route
            path="/sellerprofile"
            element={
        
                <motion.div {...pageanimation}>
                  <SellerProfile/>
                </motion.div>
         
            }
          />

          {/* ================= FORGET PASSWORD ================= */}
          <Route
            path="/forgetpass"
            element={
              
                <motion.div {...pageanimation}>
                  <ForgetPassword />
                </motion.div>
            
            }
          />


                  <Route
            path="/store/:shopid"
            element={
              
                <motion.div {...pageanimation}>
                  <Storepage/>
                </motion.div>
            
            }
          />
               <Route
            path="/sellershopapproval"
            element={
              
                <motion.div {...pageanimation}>
                  <SellerApproval />
                </motion.div>
            
            }
          />
                    <Route
            path="/creator"
            element={
              
                <motion.div {...pageanimation}>
                  <CreatedShop />
                </motion.div>
            
            }
          />
                       <Route
            path="/claimshop"
            element={
              
                <motion.div {...pageanimation}>
                  <ClaimShop />
                </motion.div>
            
            }
          />

                       <Route
            path="/MerkovaSellerChats"
            element={
              
                <motion.div {...pageanimation}>
                  <MerkovaChat />
                </motion.div>
            
            }
          />
          
                       <Route
            path="/MerkovaOrganizeChats"
            element={
              
                <motion.div {...pageanimation}>
                  <MerkovaSuperAdminChat />
                </motion.div>
            
            }
          />


                <Route
            path="/sellerapproval"
            element={
              
                <motion.div {...pageanimation}>
                  <SellerShopapproval />
                </motion.div>
            
            }
          />

          {/* ================= ADMIN HOME BANNER ================= */}
          <Route
            path="/homebanner"
            element={
              <motion.div {...pageanimation}>
                <Homebanner />
              </motion.div>
            }
          />
                <Route

            path="/createshop"

            element={
              


              <motion.div {...pageanimation}>
                <CreateShop/>
              </motion.div>
            
            }
          />
                <Route
            path="/editshop"
            element={
          



              <motion.div {...pageanimation}>
                <EditShop />
              </motion.div>
           
            }
          />


                 <Route
            path="/navcus"
            element={
          



              <motion.div {...pageanimation}>
                <Navcus/>
              </motion.div>
           
            }
          />
            <Route
            path="/campaign"
            element={
          



              <motion.div {...pageanimation}>
                <Campaign/>
              </motion.div>
           
            }
          />

          <Route
            path="*"
            element={<Navigate to={userData ? '/' : '/signin'} replace />}
          />

        </Routes>
      </AnimatePresence>

    </div>
  )
}

export default App







