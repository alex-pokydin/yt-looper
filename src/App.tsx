import {useEffect, useState, useMemo, useCallback} from 'react';
import { useSearchParams } from "react-router-dom";
import _ from "lodash";
import Box from '@mui/material/Box';
import {TextField, Slider, Button} from '@mui/material';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import YouTube, { YouTubeProps } from 'react-youtube';
import './App.css';

function App() {

  const [searchParams, setSearchParams] = useSearchParams();
  const [max, setMax] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState(searchParams.get("id") || "");
  const [value, setValue] = useState<number[]>([
    parseInt(searchParams.get("start") || '') || 0, 
    parseInt(searchParams.get("end") || '') || 0
  ]);

  const [opts, setOpts] = useState({
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
      start: value[0],
      end: value[1],
    },
  });

  useEffect(() => {
    videoId && searchParams.set('id', videoId);
    value[0] > 0 && searchParams.set('start', "" + value[0]);
    value[1] > 0 && searchParams.set('end', "" + value[1]);
    setSearchParams(searchParams, {replace: true});
  }, [videoId, value]);
  
  
  const debounce = useCallback(
    _.debounce((value: number[]) => {
      setOpts({
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
          autoplay: 1,
          start: value[0],
          end: value[1],
        },
      });
  }, 500), []);
  useEffect(() => debounce(value), [value]);

  useEffect(() => {
    let videoCode = "";
    if (videoUrl) {
      videoCode = videoUrl.split("v=")[1].split("&")[0];
      setVideoId(videoCode);
      setVideoId(videoCode);
    }
  }, [videoUrl]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };

  const checkElapsedTime = (e: any) => {
    const duration = e.target.getDuration();
    setMax(duration);
  };

  const _onReady: YouTubeProps['onReady'] = (e) => {
    e.target.pauseVideo();
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="videoContainer">
          <YouTube
            videoId={videoId}
            onStateChange={(e) => checkElapsedTime(e)}
            opts={opts} 
            onReady={_onReady}
          />
        </div>
      </header>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{
          p: 1,
          '& > :not(style)': { mb: 1, mr: 1, maxWidth: 500 },
        }}
      >
        <TextField
          label="video url" 
          fullWidth
          value={videoUrl} 
          onChange={(e) => setVideoUrl(e.target.value)} 
        />
        <TextField fullWidth label="id" value={videoId}/>
        <Slider
          getAriaLabel={() => 'Temperature range'}
          value={value}
          onChange={handleChange}
          valueLabelDisplay="auto"
          min={0} 
          max={max}
          // getAriaValueText={valuetext}
        />
        <br/>
        <TextField label="Standard" value={value[0]}/>
        <TextField label="Standard" value={value[1]}/>
      </Box>
      <CopyToClipboard text={window.location.href}
        // onCopy={() => this.setState({copied: true})}
      >
        <Button>Copy link to clipboard</Button>
      </CopyToClipboard>
    </div>
  );
}

export default App;
