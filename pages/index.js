import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';
import Navbar from '../components/navBar';
import DropdownMenu from '../components/dropdownmenu';

const Home = () => {

  
 
  
  const maxRetries = 20;
  const [input, setInput] = useState('');
  const [img, setImg] = useState('');
  const [retry, setRetry] = useState(0);
  const [retryCount, setRetryCount] = useState(maxRetries);
  const [isGenerating, setIsGenerating] = useState(false);   
  const [finalPrompt, setFinalPrompt] = useState('');
  const onChange = (event) => {
    setInput(event.target.value);
  };

  const generateAction = async () => {
    console.log('Generating...');
     // If this is a retry request, take away retryCount

    // Add this check to make sure there is no double click
     if (isGenerating && retry === 0) return;
   // Set loading has started
     setIsGenerating(true);

     if (retry > 0) {
      setRetryCount((prevState) => {
        if (prevState === 0) {
          return 0;
        } else {
          return prevState - 1;
        }
      });

      setRetry(0);
    }
  
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'image/jpeg',
      },
      body: JSON.stringify({ input }),
    });
    
    const data = await response.json();
  
    // If model still loading, drop that retry time
    if (response.status === 503) {
      setRetry(data.estimated_time);
      return;
    }
  
    // If another error, drop error
    if (!response.ok) {
      console.log(`Error: ${data.error}`);
      setIsGenerating(false);
      return;
    }
     // Set final prompt here
     setFinalPrompt(input);
     // Remove content from input box
     setInput('');
     setImg(data.image);
     // Everything is all done -- stop loading!
    setIsGenerating(false);
    
  };

  useEffect(() => {
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  
    const runRetry = async () => {
      if (retryCount === 0) {
        console.log(`Model still loading after ${maxRetries} retries. Try request again in 5 minutes.`);
        setRetryCount(maxRetries);
        return;
      }
  
      console.log(`Trying again in ${retry} seconds.`);
  
      await sleep(retry * 1000);
  
      await generateAction();
    };
  
    if (retry === 0) {
      return;
    }
  
    runRetry();
  }, [retry]);
  
  
   


  return (
    <div className="root border-4 border-pink-500 h-screen bg-black">
      
      <Navbar />
     
  <Head>
    <title>Just Prompt</title>
  </Head>
  
  <div className="w-full">
    <div className="header ">
     
      <div className="font p-2 sm:ml-24 flex items-center justify-center text-2xl sm:text-4xl header-title ">
      <span class="bg-gradient-to-br from-purple-600 to-blue-500 text-transparent bg-clip-text">Just Prompt!</span>
      </div>


      
      <div className="font p-2 sm:ml-24 flex items-center justify-center text-l sm:text-3xl">
      <span class="bg-gradient-to-br from-purple-600 to-blue-500 text-transparent bg-clip-text">Turn Ragnar to whoever you want!</span>
      </div>
      <div className='sm:flex justify-between p-1'>
      <DropdownMenu buttonText="Artist Style" menuoption1="hi" menuoption2="hi" menuoption3="hi" menuoption4="hi" menuoption5="hi" menuoption6="hi" />
      <DropdownMenu buttonText="Artist inspo" menuoption1="hi" menuoption2="hi" menuoption3="hi" menuoption4="hi" menuoption5="hi" menuoption6="hi" />
      <DropdownMenu buttonText="Landscape" menuoption1="hi" menuoption2="hi" menuoption3="hi" menuoption4="hi" menuoption5="hi" menuoption6="hi" />
      <DropdownMenu buttonText="Medium" menuoption1="hi" menuoption2="hi" menuoption3="hi" menuoption4="hi" menuoption5="hi" menuoption6="hi" />
      <DropdownMenu buttonText="Aesthetics" menuoption1="hi" menuoption2="hi" menuoption3="hi" menuoption4="hi" menuoption5="hi" menuoption6="hi" />
      <DropdownMenu buttonText="Time Descriptor" menuoption1="hi" menuoption2="hi" menuoption3="hi" menuoption4="hi" menuoption5="hi" menuoption6="hi" />
      <DropdownMenu buttonText="Season Descriptor" menuoption1="hi" menuoption2="hi" menuoption3="hi" menuoption4="hi" menuoption5="hi" menuoption6="hi" />
      <DropdownMenu buttonText="Modifiers" menuoption1="hi" menuoption2="hi" menuoption3="hi" menuoption4="hi" menuoption5="hi" menuoption6="hi" />
     </div>
      <div  className="prompt-container  flex items-center justify-center bg-lime-300">
        <input id="promptss" value={input} className="prompt-box bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={onChange} />
        
        <div className="prompt-buttons bg-pink-600 rounded-full">
          <a
            className={
              isGenerating ? 'generate-button loading' : 'generate-button'
            }
            onClick={generateAction}
          >
            <div className="generate">
              {isGenerating ? (
                <span className="loader"></span>
              ) : (
                <p className="cursor-pointer">Generate</p>
              )}
            </div>
          </a>
        </div>
      </div>
    </div>
    {/* Add output container */}
    {img && (
      

      <div className="output-content">
      <Image src={img} className="rounded" width={512} height={512} alt={finalPrompt} />
      {/* Add prompt here */}
      <p>{finalPrompt}</p>
    </div>
      
    )}
  </div>
  <div className="badge-container bg-orange-300">
    
      <div className="badge bg-green-700 h-18 w-20">
      <a
      href="https://buildspace.so/builds/ai-avatar"
      target="_blank"
      rel="noreferrer"
    >
        <p>build with buildspace</p>
        </a>
      </div>
   
  </div>
</div>
  );
};

export default Home;
