import React, { useState } from 'react';
import logo from './logo.svg';
import ReactLoading from 'react-loading';
import './App.css';

function App() {
  const [image, setImage] = useState(logo);
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
  };

  const handleUploadClick = () => {
    if (!file || loading) {
      return;
    }

    setLoading(true);
    fetch('https://httpbin.org/post', {
      method: 'POST',
      body: file,
      // Setting headers manually for single file upload
      headers: {
        'content-type': file.type,
        'content-length': `${file.size}`
      }
    })
      .then(res => {
        console.log('then triggered');
        setLoading(false);
        return res.json();
      })
      .then(data => console.log(data))
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <img src={image} className='App-logo' alt='Uncompressed' />
          {loading && <progress value={null} />}
        </div>
      </div>
    </div>
  );
}

export default App;
