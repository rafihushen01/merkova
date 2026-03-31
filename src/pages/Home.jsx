import React from 'react'
import { useSelector } from 'react-redux'
import UserDashboard from './Daahboard/UserDashboard'
import SellerDashboard from './Daahboard/SellerDashboard'
import AdminDashboard from './Daahboard/AdminDashboard'
import SuperAdminDashboard from './Daahboard/SuperAdminDashboard'

const Home = () => {
  const {userData}=useSelector(state=>state.user)
  const role=userData?.role
  return (
    
    <div> 
      {role ==="User" && <UserDashboard/>}
         {role === "Seller" && <SellerDashboard/>}
        {role === "Admin" && <AdminDashboard/>}
        {role === "SuperAdmin" && <SuperAdminDashboard/>}
  



    </div>
  )
}

export default Home