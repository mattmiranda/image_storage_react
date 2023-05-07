import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [image, setImage] = useState(logo);
  const [compressedImage, setCompressedImage] = useState(null);
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);

  const handleFileChange = event => {
    const fileObj = event.target.files && event.target.files[0];

    if (!fileObj) {
      return;
    }

    // Verify that the file is a valid image.
    if (fileObj.type !== 'image/jpeg' && fileObj.type !== 'image/png') {
      alert('Invalid image format. Please select a PNG or JPEG.');
      return;
    }

    setImage(URL.createObjectURL(fileObj));
    setFile(fileObj);
    setCompressedImage(null);
  };

  const handleUploadClick = () => {
    if (!file || loading) {
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    fetch('http://localhost:8000', {
      method: 'POST',
      body: formData
    })
      .then(res => {
        setLoading(false);
        console.log('Success :' + res.statusText);
        const reader = res.body.getReader();
        return new ReadableStream({
          start(controller) {
            return pump();
            function pump() {
              return reader.read().then(({ done, value }) => {
                // When no more data needs to be consumed, close the stream
                if (done) {
                  controller.close();
                  return;
                }
                // Enqueue the next data chunk into our target stream
                controller.enqueue(value);
                return pump();
              });
            }
          }
        });
      })
      // Create a new response out of the stream
      .then(stream => new Response(stream))
      // Create an object URL for the response
      .then(response => response.blob())
      .then(blob => URL.createObjectURL(blob))
      // Update image
      .then(url => setCompressedImage(url))
      .catch(err => console.error(err));
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <h3>Image Compressor</h3>
      </header>
      <div className='App-body'>
        <p>Select an image to compress:</p>
        <div>
          <input type='file' onChange={handleFileChange} />
          <button className='Button' onClick={handleUploadClick} disabled={loading}>
            COMPRESS
          </button>
        </div>
        <div className='Flex-center'>
          <p>Preview:</p>
          <img src={image} className='App-logo' alt='Uncompressed' />
          {loading && <progress value={null} />}
          {compressedImage && (
            <div className='Flex-center'>
              <p>Compressed:</p>
              <img src={compressedImage} className='App-logo' alt='Compressed' />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
