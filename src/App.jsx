import { useState } from 'react';
import Form from 'react-bootstrap/Form';

function App() {
  const [urlValue, setUrlValue] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (event) => {
    setUrlValue(event.target.value);
    setIsValidUrl(true);
    setErrorMessage("");
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);

    const urlPattern = /^(http[s]?:\/\/)(www\.)?[^\s$.?#].[^\s]*$/;
    if (urlPattern.test(urlValue)) {
      try {
        const response = await fetch('https://url-shortener-service.p.rapidapi.com/shorten', {
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': 'b2be6a3495msh4f3272137c52a2ep13ed5ajsn502f083243a9',
            'X-RapidAPI-Host': 'url-shortener-service.p.rapidapi.com'
          },
          body: new URLSearchParams({
            url: urlValue // Use user-provided URL
          })
        });

        const result = await response.json();
        if (response.ok) {
          console.log(result.result_url);
          setUrlValue("");
        } else {
          console.error(result)
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      setIsValidUrl(false);
      setErrorMessage("Please enter a valid URL");
    }
  }

  return (
    <div>
      <h1 className="logo">TinyRoute</h1>
      <p className="tagline">Say goodbye to cumbersome, lengthy URLs and hello to elegant simplicity.</p>

      <div className="form-container">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Website url</Form.Label>
            <Form.Control
              type="text"
              value={urlValue}
              onChange={handleChange}
              className={isSubmitted && !isValidUrl ? 'input invalid' : 'input'}
              size='lg'
              placeholder="https://website.com"
            />
          </Form.Group>
          {isSubmitted && !isValidUrl && <p className='error-message'>{errorMessage}</p>}
          <div className="btn-container">
            <button type='submit' className='submit-btn'>Shorten url</button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default App;
