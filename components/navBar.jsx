import Image from "next/image";
import React, { useState,useRef } from "react";


export default function Navbar() {
 

  return (
   <div className="flex font p-2 items-center sm:mx-auto justify-center" >
     
     
    
    <div>
      <a href="#promptss">
     <button type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
      Get Started</button>
      </a>
      </div>
      
      
      <div>
      <button type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">About</button>
      </div>
      <div>
      <button type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
        <a href="https://buildspace.so/builds#ml-projects" target="_blank">
        Explore</a></button>
        </div>
          
   
   
  
  
  </div>
  );
  }
 