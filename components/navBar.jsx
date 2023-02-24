import Image from "next/image";
import Logo from "../public/images/navBar/Logo.png";
import React, { useState,useRef } from "react";


export default function Navbar() {
 

  return (
   <div className="flex items-center justify-center bg-blue-600 space-x-40" >
     
     
    
    
  <button class="rounded-full transition ease-in-out delay-150 bg-blue-600 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 flex items-center justify-center py-2 pl-3 pr-4 text-white text-lg md:bg-transparent md:text-white-700 md:p-0 dark:text-white font-medium" aria-current="page">
  <a href="#prompt">Generate</a>
</button>

      
      
      
        <a href="#" className="block py-2 pl-3 pr-4 text-white-700 rounded md:p-0 dark:text-white-400 text-xl font-medium hover:text-yellow-500 transition-all">ABOUT</a>
      
      
        <a href="https://buildspace.so/builds#ml-projects" target="_blank" className="block py-2 pl-3 pr-4 text-white-700 rounded md:p-0 dark:text-white-400 text-xl font-medium hover:text-yellow-500 transition-all">EXPLORE</a>
          
   
   
  
 <div>
    <a href="#" className="flex">Connect</a>
 </div>
 
  
  </div>
  );
  }
 