import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';

function App() {
  const [urlTitle, setUrlTitle] = useState("");
  const [urlValue, setUrlValue] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [previousRoutes, setPreviousRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const storedRoutes = localStorage.getItem('previousRoutes');
    if (storedRoutes) {
      setPreviousRoutes(JSON.parse(storedRoutes));
    }
  }, []);

  const saveRoutesToLocalStorage = (routes) => {
    localStorage.setItem('previousRoutes', JSON.stringify(routes));
  };

  const handleChange = (event) => {
    setUrlValue(event.target.value);
    setIsValidUrl(true);
    setErrorMessage("");
  }

  const handleTitleChange = (event) => {
    setUrlTitle(event.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);

    const urlPattern = /^(http[s]?:\/\/)(www\.)?[^\s$.?#].[^\s]*$/;
    if (urlPattern.test(urlValue)) {
      try {
        setIsLoading(true)
        const response = await fetch('https://url-shortener-service.p.rapidapi.com/shorten', {
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': 'b2be6a3495msh4f3272137c52a2ep13ed5ajsn502f083243a9',
            'X-RapidAPI-Host': 'url-shortener-service.p.rapidapi.com'
          },
          body: new URLSearchParams({
            url: urlValue,
            title: urlTitle
          })
        });

        const result = await response.json();
        if (response.ok) {
          const newRoute = { title: urlTitle, url: result.result_url };
          setIsLoading(false)
          setUrlTitle("");
          setUrlValue("");
          setPreviousRoutes((prevRoutes) => {
            const updatedRoutes = [...prevRoutes, newRoute];
            saveRoutesToLocalStorage(updatedRoutes);
            return updatedRoutes;
          });
        } else {
          console.error(result);
          setIsLoading(false)
        }
      } catch (error) {
        console.error(error);
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
      setIsValidUrl(false);
      setErrorMessage("Please enter a valid URL");
    }
  }

  const handleDelete = (index) => {
    const updatedRoutes = previousRoutes.filter((_, i) => i !== index);
    setPreviousRoutes(updatedRoutes);
    saveRoutesToLocalStorage(updatedRoutes);
  };

  return (
    <div>
      <h1 className="logo">TinyRoute</h1>
      <p className="tagline">Say goodbye to cumbersome, lengthy URLs and hello to elegant simplicity.</p>

      <div className="form-container">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={urlTitle}
              onChange={handleTitleChange}
              className='input'
              size='lg'
              placeholder="Enter a title"
            />
          </Form.Group>
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
            <button type='submit' className='submit-btn' disabled={isLoading}>
              {isLoading ? "Shortening..." : "Shorten url"}
            </button>
          </div>
        </Form>
      </div>

      {/* Previous Tiny Routes */}
      <hr />
      <div className="previous-routes">
        <h2 className='routes-header'>Previous Tiny Routes</h2>
        <Table striped bordered hover className="previous-routes-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Shortened URL</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {previousRoutes.map((route, index) => (
              <tr key={index}>
                <td>{route.title}</td>
                <td><a href={route.url} className='route-link' target="_blank" rel="noopener noreferrer">{route.url}</a></td>
                <td><button className='delete-btn' onClick={() => handleDelete(index)}><i className="fas fa-trash"></i></button></td>
              </tr>
            ))}
          </tbody>
</Table>

      </div>
    </div>
  );
}

export default App;
