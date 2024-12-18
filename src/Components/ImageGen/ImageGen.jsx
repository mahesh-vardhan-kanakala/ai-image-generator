import React, { useState } from 'react';
import './ImageGen.css';
import downloadIcon from '../Assets/download-icon.svg';

const ImageGen = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const generateImage = async () => {
    try {
      setLoading(true);
      setErrorMessage(''); // Reset error message

      const trimmedPrompt = prompt.trim();
      if (!trimmedPrompt) {
        setErrorMessage('Prompt cannot be empty!');
        setLoading(false); // Stop loading if prompt is empty
        return;
      }

      const response = await fetch(
        "https://api-inference.huggingface.co/models/prompthero/openjourney",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer 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`,
          },
          body: JSON.stringify({ inputs: trimmedPrompt }),
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`API request failed with status: ${response.status}`, errorBody);
        throw new Error('Failed to generate image');
      }

      const blob = await response.blob();
      setImage(URL.createObjectURL(blob));
    } catch (error) {
      console.error('Error generating image:', error);
      setErrorMessage('Failed to generate image. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (image) {
      const link = document.createElement('a');
      link.href = image;
      link.download = 'generated-image.jpg';
      link.click();
    }
  };

  const genBtnStyle = {
    opacity: prompt ? 1 : 0.5,
    cursor: prompt ? 'pointer' : 'not-allowed',
  };

  const downBtnStyle = {
    opacity: image ? 1 : 0.5,
    cursor: image ? 'pointer' : 'not-allowed',
  };

  return (
    <div className='aiImage'>
      <div className="header">ImagePrompt<span> AI</span></div>

      {/* Error message display */}
      {errorMessage && <div className='error'>{errorMessage}</div>}

      <div className='imgArea'>
        <div className="genImage">
          {loading ? (
            <div className='spinner'></div> // Add this CSS for a loading spinner
          ) : (
            image && <img src={image} alt='Generated AI artwork' />
          )}
        </div>
      </div>

      <div className='search'>
        {/* Download button */}
        <div className='downBtn' style={downBtnStyle} onClick={handleDownload}>
          <img src={downloadIcon} alt='Download' />
        </div>

        {/* Prompt input field */}
        <input
          type='text'
          className='searchInput'
          placeholder='Type your prompt...'
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        {/* Generate button */}
        <div className='genBtn' style={genBtnStyle} onClick={generateImage}>
          {loading ? 'Generating...' : 'Generate'}
        </div>
      </div>
    </div>
  );
};

export default ImageGen;
