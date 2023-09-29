import React, { useState, useRef } from 'react';
import Switch from 'react-toggle-switch';
import 'react-toggle-switch/dist/css/switch.min.css';
import 'font-awesome/css/font-awesome.min.css';

const SavePopup = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  return (
    <div className="popup">
      <div className="popup-content">
        <h2>Save Recording</h2>
        <button onClick={onSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

const StopRecordingButton = ({ onClick }) => {
  return (
    <button className="btn btn-danger" onClick={onClick}>
      Stop Recording
    </button>
  );
};

const ScreenRecorder = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [recordScreen, setRecordScreen] = useState(false);
  const [recordAudio, setRecordAudio] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('johnmark@gmail.com');
  const [isRecording, setIsRecording] = useState(false);
  const [showSavePopup, setShowSavePopup] = useState(false);

  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const handleShowCameraChange = () => {
    setShowCamera(!showCamera);
  };

  const handleRecordScreenChange = () => {
    setRecordScreen(!recordScreen);
  };

  const handleRecordAudioChange = () => {
    setRecordAudio(!recordAudio);
  };

  const startRecording = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
      navigator.mediaDevices.getDisplayMedia({ video: showCamera, audio: recordAudio })
        .then(stream => {
          mediaStreamRef.current = stream;

          const recorder = new MediaRecorder(stream);
          mediaRecorderRef.current = recorder;

          recorder.ondataavailable = event => {
            if (event.data.size > 0) {
              chunksRef.current.push(event.data);
            }
          };

          recorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            console.log('Recording complete. Blob URL:', url);
            chunksRef.current = [];
          };

          setIsRecording(true);
          recorder.start();
        })
        .catch(error => {
          console.error('Error accessing screen:', error);
        });
    } else {
        console.error('getDisplayMedia is not supported');
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
      setIsRecording(false);
      setShowSavePopup(true);
  
      const stream = mediaStreamRef.current;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
  
      recorder.ondataavailable = event => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
  
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const formData = new FormData();
      formData.append('recording[content]', blob, 'recorded-video.webm');
  
      fetch('http://localhost:3000/recordings', {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          console.log('Video uploaded successfully:', data);
        })
        .catch(error => {
          console.error('Error uploading video:', error);
        });
    } else {
        console.error('MediaRecorder is not initialized');
    }
  
    chunksRef.current = [];
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Show Them Don't Just Tell</h1>
      <p className="text-center">
        Help your friends and loved ones creating and sending videos on how to get things done on a website
      </p>

      <div className="text-center my-5">
        <button
          className={`btn btn-light d-flex align-items-center justify-content-between mx-2 ${showCamera ? 'active' : ''} w-100`}
          onClick={(e) => {
            e.stopPropagation();
            handleShowCameraChange();
          }}
        >
          <div className="d-flex align-items-center">
            <i className="fa fa-camera"></i>
            <span className={`ms-2 ${showCamera ? 'me-3' : ''}`}>Show Camera</span>
          </div>
          <Switch
            on={showCamera}
            onClick={(e) => e.stopPropagation()}
          />
        </button>
      </div>

      <div className="text-center my-5">
        <button
          className={`btn btn-light d-flex align-items-center justify-content-between mx-2 ${recordScreen ? 'active' : ''} w-100`}
          onClick={(e) => {
            e.stopPropagation();
            handleRecordScreenChange();
          }}
        >
          <div className="d-flex align-items-center">
            <i className="fa fa-desktop"></i>
            <span className={`ms-2 ${recordScreen ? 'me-3' : ''}`}>Record Screen</span>
          </div>
          <Switch
            on={recordScreen}
            onClick={(e) => e.stopPropagation()}
          />
        </button>
      </div>

      <div className="text-center my-5">
        <button
          className={`btn btn-light d-flex align-items-center justify-content-between mx-2 ${recordAudio ? 'active' : ''} w-100`}
          onClick={(e) => {
            e.stopPropagation();
            handleRecordAudioChange();
          }}
        >
          <div className="d-flex align-items-center">
            <i className="fa fa-microphone"></i>
            <span className={`ms-2 ${recordAudio ? 'me-3' : ''}`}>Record Audio</span>
          </div>
          <Switch
            on={recordAudio}
            onClick={(e) => e.stopPropagation()}
          />
        </button>
      </div>

      <div className="text-center mt-3">
        <button className="btn btn-primary position-fixed bottom-0 end-0 mb-4 me-4" onClick={startRecording} disabled={isRecording} style={{ backgroundColor: '#120B48' }}>
          <i className="fa fa-camera"></i>
          <span className={`ms-2 ${startRecording ? 'me-3' : ''}`}>Start Recording</span>
        </button>

        {isRecording && <StopRecordingButton onClick={stopRecording} />}

        <SavePopup
          isOpen={showSavePopup}
          onClose={() => setShowSavePopup(false)}
          onSave={() => {
            // Send recording data to your backend API
            setShowSavePopup(false);
          }}
        />
      </div>
    </div>
  );
};

export default ScreenRecorder;
