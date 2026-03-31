import React from 'react'
import SellerCentralNav from './SellerCentralNav'
import SellerHomebannercard from './SellerCentralHomebanner'
import SelleCentralrApproval from './SellerApproval'
const SellerCentralHome = () => {
  return (
    

     <div>
         <SellerCentralNav/>
       <div className='pt-10 '>
   
   
           <SellerHomebannercard/>
       </div>
        <div >

       <SelleCentralrApproval/>

        </div>
       </div>


    
  )
}

export default SellerCentralHome