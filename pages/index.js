import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';
import { useEffect, useState } from 'react';

const Home = () => {

  const maxRetries = 20
  const [input, setInput] = useState('')
  const [img, setImg] = useState('')
  const [retry,setRetry] = useState(0)
  const [retryCount, setRetryCount] = useState(maxRetries)
  const [isGenerating, setIsGenerating] = useState(false)

  const [finalPrompt, setFinalPrompt] = useState('')

  

  const generateAction = async () => {
    console.log('...generating')

    if(isGenerating && retry === 0) return; //if generation is happening but rety is not zero, get out of generate function to avoid double requests

    //indicate generation
    setIsGenerating(true);



    if (retry > 0) {
      setRetryCount((prevState) => {
        if(prevState === 0) {
          return 0
        } else {
          return prevState - 1
        }
      })

      setRetry(0)
    }

    const finalInput = input.replace('aryan','aryanmadhavverma')

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'image/jpeg',
      },
      body: JSON.stringify({ finalInput }),
    })

    const data = await response.json()

    if(response.status === 503) {
      // console.log('Model still loading')
      setRetry(data.estimated_time)
      return;
    }

    if(!response.ok) {
      console.log(`Error: ${data.error}`)
      //stop generation
      setIsGenerating(false)
      return;
    }

    setFinalPrompt(input)
    setInput('')
    setImg(data.image)

    //everything done stop generation
    setIsGenerating(false)

  }

  const sleep = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }

  useEffect(() => {
    const runRetry = async() => {
      if (retryCount === 0) {
        console.log(`You have reached maximum number of retries. Try req in 2-3 minutes`)
        setRetryCount(maxRetries) //again refreshing to 20 retireus
        return
      }

      console.log(`Retry in ${retry} seconds`)

      await sleep(retry * 1000) // sleeps for the mentioned seconds nothing happens till then
      await generateAction() //click event wont happen till this much time
    }
    if(retry === 0) {
      return;
    }
    runRetry() //callback to run it again

  }, [retry])

  return (
    <div className="root">
      <Head>
        <title>AI Avatar</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>AI Avatar Creator</h1>
          </div>
          <div className="header-subtitle">
            <h2>Make me into an AI created avatar. Call me "TienBSS" in the prompt.</h2>
            <p>Try "TienBSS intricate male character portrait,8k resolution, dynamic lighting, dnd character portrait"</p>
          </div>
          <div>
            
          </div>
          <div className='prompt-container'>
            <input className='prompt-box' value={input} onChange={(event) => {setInput(event.target.value)}}/>
            <div className='prompt-buttons'>
              <a className=
                  {
                    isGenerating? 'generate-button loading': 'generate-button'
                  } 
                  onClick={generateAction}
              >
                <div className='generate'>
                  {
                    isGenerating? (<span className='loader'></span>) : (<p>Generate</p>)
                  }
                  
                </div>
              </a>
            </div>
          </div>
          <p className='subp'>First generation might take 60 seconds</p>
        </div>
        <div>
        {img && (
          <div className='output-content'>
            <Image src={img} width={512} height={512} alt={input}/>
            <p>{finalPrompt}</p>

          </div>
        )}
      </div>
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