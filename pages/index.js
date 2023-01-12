import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image'; 

//import buildspaceLogo from '../assets/logo.png';

const Home = () => {
  const [input, setInput] = useState('');
  const onChange = (event) => {
    setInput(event.target.value);
  };
  
  return (
<div className="root">
  <Head>
    <title> Jungkook Magic Mirror Portraits</title>
  </Head>
  <div className = "container">
    <div className="header">
      <div className="header-title">
        <h1>Jungkook Magic Mirror Portraits</h1>
      </div>
      <div className="header-subtitle">
        <h2>
          Re-imagine Jungkook as a pirate, cyberpunk, or anything!
        </h2>
      </div>
      <div className="prompt-container">
      <input className="prompt-box" value={input} onChange={onChange} />
        <div className="prompt-buttons">
          <a className="generate-button">
      <div className="generate">
        <p>Generate</p>
       </div>
          </a>
      </div>
</div>
    </div>
  </div>
</div>
  );
};

export default Home; 
