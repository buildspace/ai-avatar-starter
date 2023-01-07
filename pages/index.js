import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';
import { render } from 'react-dom';

const Home = () => {
  const [hardInput1, setHardInput1] = useState('');
  const [hardInput2, setHardInput2] = useState('');
  const [hardInput3, setHardInput3] = useState('');
  const [hardInput4, setHardInput4] = useState('');
  const [input, setInput] = useState('');
  const [img, setImg] = useState('');
  const onChange = (event) => {
    setInput(event.target.value);
  };
  const maxRetries = 20;
  // Numbers of retries
  const [retry, setRetry] = useState(0);
  // Number of retries left
  const [retryCount, setRetryCount] = useState(maxRetries);
  const [isGenerating, setIsGenerating] = useState(false);

  const [finalPrompt, setFinalPrompt] = useState('');

  // New stateful variable to store image count
  const [imageCount, setImageCount] = useState(0);

//render button container for hardInputs
  const renderHardInputButtons = () => {
    return (
      <div className="input-button-ctnr">
        <button
          className="input-button"
          onClick={() => {
            setInput(hardInput1);
          }}
        >
          Rembrandt Portrait
        </button>
        <button
          className="input-button"
          onClick={() => {
            setInput(hardInput2);
          }}
        >
          Marvel Super Hero
        </button>
        <button
          className="input-button"
          onClick={() => {
            setInput(hardInput3);
          }}
        >
          Super Hero
        </button>
        <button
          className="input-button"
          onClick={() => {
            setInput(hardInput4);
          }}
        >
          Super Villian
        </button>
      </div>
    );
  };

  // Add generateAction
const generateAction = async () => {
  console.log('Generating...');

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

  if (response.status === 503) {
    setRetry(data.estimated_time);
    return;
  }

  if (!response.ok) {
    console.log(`Error: ${data.error}`);
    // Stop loading
    setIsGenerating(false);
    return;
  }

    // Set final prompt here
    setFinalPrompt(input);
    // Remove content from input box
    setInput('');
    setImg(data.image);
    setIsGenerating(false);
};

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}; 


  useEffect(() => {
    const runRetry = async () => {
      if (retryCount === 0) {
        console.log(
          `Model still loading after ${maxRetries} retries. Try request again in 5 minutes.`
        );
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

  //hard input useEffect, hard code pre scripted prompts for user to generate an image
  useEffect(() => {
    //rembrandt
    setHardInput1('matthewweichel portrait in the style of Rembrandt, paying attention to lighting and shadow to create a sense of depth and dimension, intricate, elegant, hgihly detailed, digital painting, smooth, sharp focus, concept art, highly detailed, uhd, 8k, artstation');
    //marvel/pixar super hero
    setHardInput2('matthewweichel as Marvel super hero in the style of Pixar animation, 3d render, futuristic art, highly detailed, uhd, 8k, artstation');
    setHardInput3('highly detailed digital portrait of matthewweichel as a marvel super hero, photo realism, uhd, vibrant colors, artstation, 8k');
    setHardInput4('highly detailed digital portrait of matthewweichel as a marvel super villian, evil grin, photo realism, uhd, dark colors, shadow depth, artstation, 8k');
  }, []);

  return (
    <div className="root">
      <Head>
        <title>Matt's AI Avatar Generator</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Matt's AI Avatar Generator</h1>
          </div>
          <div className="header-subtitle">
            <h2>
              Generate a unique avatar of me using AI. <br />
              Refer to me as 
                <span>"matthewweichel"</span> 
              in your prompt.
            </h2>
          </div>

            {renderHardInputButtons()}

          {/* Add prompt container here */}
          <div className="prompt-container">
            <input className="prompt-box" value={input} onChange={onChange} />
            <div className="prompt-buttons">
              {/* Tweak classNames to change classes */}
              <a
                className={
                  isGenerating ? 'generate-button loading' : 'generate-button'
                }
                onClick={generateAction}
              >
                {/* Tweak to show a loading indicator */}
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
        {img && (
          <div className="output-content">
            <Image src={img} width={512} height={512} alt={finalPrompt} />
            <p>{finalPrompt}</p>

          </div>
        )}
      </div>
      <div className="badge-container grow">
        
            <a href="https://www.buymeacoffee.com/beccaandmatt" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style={{height: "20px, !important", width: "180px !important"}} /></a>

      </div>
    </div>
  );
};

export default Home;