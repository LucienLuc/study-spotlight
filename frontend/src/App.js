//import logo from './logo.svg';
import './App.css';
import axios from 'axios'

import {Button} from 'antd'
import 'antd/dist/antd.css';

import UploadFile from './components/UploadFile'
import app_header from './components/header'
import Flashcard from './components/Flashcard'

import {app} from './base'

const BASE_URL = "https://us-central1-define-me-308905.cloudfunctions.net"

// For firebase emulator testing
// const BASE_URL = "http://localhost:5001/define-me-308905/us-central1"

function App() {


  const handleClick = () => {
    axios.post('http://localhost:5001/define-me-308905/us-central1/ocr', {file: 'testfile.pdf'}).then(response => {
      console.log(response);
    }).then(() => {
      const storageRef = app.storage().ref()
      const fileRef = storageRef.child("/results/output-1-to-1.json")
      fileRef.getDownloadURL().then(url => {
        axios.get(url).then(response => {
          console.log(response.data.responses[0].fullTextAnnotation.text)
        })
      })
    }); 
  }

  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <Button onClick={handleClick}>Test firebase</Button>
      <app_header/>
      <Flashcard/>
      <UploadFile/>
      
    </div>
  );
}

export default App;
