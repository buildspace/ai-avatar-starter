import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';

const Home = () => {
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

  // // Replace "raza" or "Raza" in input with "abraza"
  const input = finalPrompt.replace(/matt/gi, 'matthewweichel');

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
              Turn me into anyone you want! Make sure you refer to me as "matt" in the prompt
            </h2>
          </div>
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
        <a
          href="https://buildspace.so/builds/ai-avatar"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <a href="https://www.buymeacoffee.com/beccaandmatt" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style={{height: "60px, !important", width: "217px !important"}} /></a>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;