import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';

const Home = () => {
  return (
    <div className="root">
      <Head>
        <title>AI Avatar Generator | buildspace</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>your generator one-liner</h1>
          </div>
          <div className="header-subtitle">
            <h2>description of your generator</h2>
          </div>
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
