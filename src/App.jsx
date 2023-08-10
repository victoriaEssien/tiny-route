
// Bootstrap Components
import Form from 'react-bootstrap/Form';

function App() {

  return (
    <div>
      <h1 className="logo">TinyRoute</h1>
      <p className="tagline">Say goodbye to cumbersome, lengthy URLs and hello to elegant simplicity.</p>

      <div className="form-container">
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Website url</Form.Label>
          <Form.Control type="url" className='input' size='lg' placeholder="https://website.com" />
          </Form.Group>

        <div className="btn-container"> 
          <button type='button' className='submit-btn'>Shorten</button>
        </div>
        </Form>
      </div>
    </div>
  )
}

export default App
