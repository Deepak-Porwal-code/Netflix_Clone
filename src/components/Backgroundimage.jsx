import React from 'react'
import background from "../assets/login.jpg"


const Backgroundimage = () => {
  return (

    <div className='h-[100vh] w-[100vw] img'>
      <img src={background} alt="background" className="h-screen w-screen" />
    </div>
  );
}

export default Backgroundimage

