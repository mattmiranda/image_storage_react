import React, { useState } from 'react';
import logo from './logo.svg'
import './App.css';

function App() {
  const [image, setImage] = useState(logo);

  const handleFileChange = event => {
    const fileObj = event.target.files && event.target.files[0];

    if (!fileObj) { // TODO: verify that the file is a valid image.
      return;
    }

    console.log('fileObj is : ', fileObj);

    event.target.value = null;

    setImage(URL.createObjectURL(fileObj))
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Image App</h1>
        <img src={image} className="App-logo" alt="logo" />
        <input
          type="file"
          onChange={handleFileChange}
        />
      </header>
    </div>
  );
}

export default App;
