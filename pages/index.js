import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';

const Home = () => {
  const maxRetries = 20;
  const [input, setInput] = useState("");
  const [img, setImg] = useState("");
  // Numbers of retries
  const [retry, setRetry] = useState(0);
  // Number of retries left
  const [retryCount, setRetryCount] = useState(maxRetries);
  // Add isGenerating state
  const [isGenerating, setIsGenerating] = useState(false);
  // Add new state here
  const [finalPrompt, setFinalPrompt] = useState('');

  const sleep = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };

  useEffect(() => {
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

  const onChange = (event) => {
    setInput(event.target.value);
  };
  // Add generateAction
  const generateAction = async () => {
    console.log("Generating...");
    // Add this check to make sure there is no double click
    if (isGenerating && retry === 0) return;

    // Set loading has started
    setIsGenerating(true);

    // If this is a retry request, take away retryCount
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

    // const finalInput = input.replace(/raza/gi, 'abraza');

    // Add the fetch request
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "image/jpeg",
      },
      // body: JSON.stringify({ finalInput }),
      body: JSON.stringify({ input }),
    });

    const data = await response.json();
    if (response.status === 503) {
      setRetry(data.estimated_time);

      return;
    }

    // If another error, drop error
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

  return (
    <div className="root">
      <Head>
        <title>AI Avatar Generator</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>FFS Generator</h1>
          </div>
          <div className="header-subtitle">
            <h2>Write the name of the FFS member and a prompt of your choice. Available FFS members so far: "stephane"</h2>
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
                    <p>Generate pictures</p>
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

            </a>
          </div>
        </div>
  );
};

export default Home;
