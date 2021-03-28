import React from 'react'
import axios from 'axios'
import './UploadFile.css'
import {app} from '../base'
import { Progress } from 'antd';

import {Upload, Button, message} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Redirect } from 'react-router';

// const BASE_URL = "https://us-central1-define-me-308905.cloudfunctions.net"

// For firebase emulator testing
const BASE_URL = "http://localhost:5001/define-me-308905/us-central1"

class UploadFile extends React.Component{
  
  constructor(props){
    super(props);
    this.state = {
      uploading: false,
      progress: 0
    };
    this.handleUpload = this.handleUpload.bind(this)
}
  handleUpload = (e) => {
    this.setState({
      uploading:true
    })
    const file = e.file;
    const storageRef = app.storage().ref()
    const fileRef = storageRef.child(file.name)
    fileRef.put(file)
    .then((res) => {
      this.setState({
        uploading: true,
        progress: 33
      })
      console.log("uploaded file to firebase");
      axios
        .post(BASE_URL + "/ocr", {file: file.name})
        .then(response => {
          this.setState({
            uploading: true,
            progress:66
          })
          console.log("ocr begin");
          //delete pdf file
          fileRef
            .delete()
            .then(() => {
              this.setState({
                progress: 100
              })
              console.log("deleted file");
            })
            .catch((error) => {
              console.log(error); 
            })
        //make definitions and terms
      })
    }).catch(e => console.log(e))
  }
  render() {
    return (
            <div>
              <Progress type="dashboard" percent={this.state.progress} />

              <div class="file-input"> 
                <Upload name="file"
                accept=".pdf"
                onChange={this.handleUpload}>
                  <Button icon={<UploadOutlined />}>Select a pdf:</Button>
                </Upload>
              </div>
            </div>
    )
  }
}

export default UploadFile