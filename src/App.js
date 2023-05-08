import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import logo from './logo.svg';
import rightArrow from './rightarrow.svg';
import './App.css';

function App() {
  const [image, setImage] = useState(logo);
  const [inputFile, setInputFile] = useState();
  const [compressedImage, setCompressedImage] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL;

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
    setInputFile(fileObj);
    setCompressedImage(null);
    setCompressedFile(null);
  };

  const handleUploadClick = () => {
    if (!inputFile || loading) {
      return;
    }

    const formData = new FormData();
    formData.append('file', inputFile);

    setLoading(true);
    fetch(apiUrl, {
      method: 'POST',
      body: formData
    })
      .then(res => {
        setLoading(false);
        if (!res.ok) {
          console.log(res);
          return Promise.reject(res.statusText);
        }
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
      .then(blob => {
        setCompressedFile(blob);
        return URL.createObjectURL(blob);
      })
      // Update image
      .then(url => setCompressedImage(url))
      .catch(err => console.error(err));
  };

  const handleDownloadClick = () => {
    if (compressedFile && inputFile && inputFile.name) {
      saveAs(compressedFile, inputFile.name);
    }
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
          <button
            className='Button'
            onClick={handleUploadClick}
            disabled={loading || compressedImage}
          >
            COMPRESS
          </button>
          <button className='Button' onClick={handleDownloadClick} disabled={!compressedFile}>
            DOWNLOAD
          </button>
        </div>
        <div className='Flex-row'>
          <div className='Preview-box'>
            <p>Preview:</p>
            <img src={image} className='Image' alt='Uncompressed' />
            {loading && <progress value={null} />}
          </div>
          <img src={rightArrow} className='Arrow' alt='rightarrow' />
          <div className='Preview-box'>
            <p>Compressed:</p>
            {compressedImage && <img src={compressedImage} className='Image' alt='Compressed' />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
