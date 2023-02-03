import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';

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
    <div className="root">
  <Head>
    <title>Just Prompt</title>
  </Head>
  <div className="container">
    <div className="header">
      <div className="header-title">
        <h1>Just Prompt!</h1>
      </div>
      <div className="header-subtitle">
        <h2>
          Turn Ragnar to whoever you want!
        </h2>
      </div>
      <div className="prompt-container">
        <input className="prompt-box" value={input} onChange={onChange} />
        <div className="prompt-buttons">
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
                <p>Generate</p>
              )}
            </div>
          </a>
        </div>
      </div>
    </div>
    {/* Add output container */}
    {img && (
      

      <div className="output-content">
      <Image src={img} width={512} height={512} alt={finalPrompt} />
      {/* Add prompt here */}
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
