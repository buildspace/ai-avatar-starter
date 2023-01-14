import { useState, useEffect } from 'react';

import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';

const Home = () => {
  
  const maxRetries = 20; // Don't retry more than 20 times
  
  const [input, setInput] = useState(''); // creating input state property
  const [img, setImg] = useState(''); // creating new state property for img
  const [retry, setRetry] = useState(0); // Numbers of retries
  const [retryCount, setRetryCount] = useState(maxRetries);// Number of retries left 
  const  [isGenerating, setIsGenerating] = useState(false);// adding isGenerating state
  const [finalPrompt, setFinalPrompt] = useState(''); // state for finalPrompt
  

  // function that take the text
  const onChange = (event) => {
    setInput(event.target.value);
  };
  //  function that generateAction
  const generateAction = async () => {
    console.log("Generating...");
    
    if (isGenerating && retry === 0) return; // making sure there is no double click 
    setIsGenerating(true); // Set loading has started

    // if this is a retry request, take away retryCount
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
    
    const finalInput = input.replace(/phil/gi, "timiphil")

    // adding the fetch request
    const response = await fetch("/api/generate", {  
      method: "POST",
      headers: {
        "Content-Type": "image/jpeg",
      },
      body: JSON.stringify({ input: finalInput }),
    });

    const data = await response.json();

    
    if (response.status === 503) { // if model still loading, drop retry time
      setRetry(data.estimated_time);  // setting estimated_time property in state
      return;
    }

    if (!response.ok) { // if another error, drop error
      console.log(`Error: ${data.error}`);
      setIsGenerating(false); // stop loading
      return;
    }
    
    setFinalPrompt(input); // setting final prompt
    setInput(''); // remove content from input box
    setImg(data.image); //set image data into state property
    setIsGenerating(false); // everything is all done -- stop loading
  };

  // sleep function 
  const sleep = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };

  // Adding useEffect
  useEffect(() => {
    const runRetry = async () => {
      if (retryCount === 0) {
        console.log(`Model still loading after ${maxRetries} retries. Try request again in 5 minutes.`);
        setRetryCount(maxRetries);
        // setIsGenerating(false);
        return;
      } 
      console.log(`Try again in ${retry} seconds.`);

      await sleep(retry * 1000);

      await generateAction();
    };
    if (retry === 0) {
      return;
    }

    runRetry();
  }, [retry]);

  return (
    <div className="root">
      <Head>
        <title>AI Avatar Generator | buildspace</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Timiphil Avatar Generator</h1>
          </div>
          <div className="header-subtitle">
            <p> Make me into whoever you want! Make sure you refer to me as "timiphil" using the prompt</p>
          </div>
          <div className="prompt-container">
            <input className="prompt-box" value={input} onChange={onChange} />

            <div className="prompt-buttons">
              <a 
                className={
                 isGenerating ? "generate-button loading" : "generate-button"
                }
                onClick={generateAction} 
              >
                {/* tweak to show loading indicator */}
                <div className="generate">
                  {isGenerating ? (
                    <span className="loader"></span>
                  ) : (
                    <p>Generate</p>
                  )}
                </div>
              </a>
            </div>
          </div>
        </div>
        {/* output container */}
        {img && (
          <div className="output-content">
            <Image src={img} width={512} height={512} alt={finalPrompt} />
            <p>{finalPrompt}</p>
          </div>
        )}
      </div>
      <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-avatar"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
