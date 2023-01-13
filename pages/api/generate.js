const bufferToBase64 = (buffer) => {
  let arr = new Uint8Array(buffer);
  const base64 = btoa(
    arr.reduce((data, byte) => data + String.fromCharCode(byte), "")
  )
  return `data:image/png;base64,${base63}`;
}

const generateAction = async (req, res) => {
  console.log("Received request");
  
  const input = JSON.parse(req.body).input; // going to input from the body of the request
  
  const response = await fetch ( // fetching request to Hugging face
    `https://api-inference.huggingface.co/models/Timiphil/sd-1-5-timiphil`,
    {
      headers: {
        Authorization:`Bearer ${process.env.HF_AUTH_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        inputs: input,
      }),
    }
  );
  
  
  if (response.ok) { //Check for different statuses to send proper payload
    const buffer = await response.arrayBuffer();
    const base64 = bufferToBase64(buffer); // convert to base64
    
    res.status(200).json({ image: base64 }); //This means the call is a success and it should return back the image.
  } else if (response.status === 503) { // model loading error and estimated_time
    const json = await response.json();
    res.status(503).json(json); 
  } else { // any other error
    const json = await response.json();
    res.status(response.status).json({ error: response.statusText }); 
  }
};

export default generateAction;