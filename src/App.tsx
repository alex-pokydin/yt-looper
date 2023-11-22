import { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import _ from "lodash";
import Box from "@mui/material/Box";
//import { Unstable_NumberInput as NumberInput } from '@mui/base/Unstable_NumberInput';
import { TextField, Slider, Button } from "@mui/material";
import { CopyToClipboard } from "react-copy-to-clipboard";
import YouTube, { YouTubeProps } from "react-youtube";
import "./App.css";

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [max, setMax] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState(searchParams.get("id") || "");
  const [start, setStart] = useState<number>(
    parseInt(searchParams.get("start") || "") || 0
  );
  const [end, setEnd] = useState<number>(
    parseInt(searchParams.get("end") || "") || 0
  );
  const [current, setCurrent] = useState<number>(0);
  const [currentFixed, setCurrentFixed] = useState<number>(start);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoInterval, setVideoInterval] = useState<any>(null);

  const [opts, setOpts] = useState({
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
      start: start,
      end: end,
    },
  });

  useEffect(() => {
    videoId && searchParams.set("id", videoId);
    start > 0 && searchParams.set("start", "" + start);
    end > 0 && searchParams.set("end", "" + end);
    setSearchParams(searchParams, { replace: true });
  }, [videoId, start, end]);

  const debounce = useCallback(
    _.debounce((start: number, end: number) => {
      setOpts({
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
          autoplay: 1,
          start: start,
          end: end,
        },
      });
    }, 1000),
    []
  );
  useEffect(() => debounce(start, end), [start, end]);

  useEffect(() => {
    let videoCode = "";
    if (videoUrl) {
      videoCode = videoUrl.split("v=")[1].split("&")[0];
      setVideoId(videoCode);
      setVideoId(videoCode);
    }
  }, [videoUrl]);

  const checkElapsedTime = (e: any) => {
    const duration = e.target.getDuration();
    setMax(duration);
  };

  const _onReady: YouTubeProps["onReady"] = (e) => {
    e.target.pauseVideo();
    setVideoTitle(e.target.videoTitle);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="videoContainer">
          <YouTube
            videoId={videoId}
            onStateChange={(e) => checkElapsedTime(e)}
            opts={opts}
            onReady={_onReady}
            onPlay={(e) =>{
              setCurrentFixed(Math.ceil(e.target.getCurrentTime()));
              setCurrent(Math.ceil(e.target.getCurrentTime()));
              setVideoInterval(setInterval(() => setCurrent(Math.ceil(e.target.getCurrentTime())), 1000));
            }
            }
            onPause={(e) => clearInterval(videoInterval)}
          />
        </div>
      </header>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{
          p: 1,
          "& > :not(style)": { mb: 1, mr: 1, maxWidth: 900 },
        }}
      >
        <TextField
          label="video url"
          fullWidth
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
        <TextField fullWidth label="id" value={videoId} />
        <Slider
          getAriaLabel={() => "Temperature range"}
          value={start}
          onChange={(e: Event, val: number | number[]) =>
            setStart(val as number)
          }
          valueLabelDisplay="auto"
          min={Math.max(0, currentFixed - 30)}
          max={Math.min(max, currentFixed + 30)}
          // getAriaValueText={valuetext}
        />
        <Slider
          getAriaLabel={() => "Temperature range"}
          value={end}
          onChange={(e: Event, val: number | number[]) => setEnd(val as number)}
          valueLabelDisplay="auto"
          min={Math.max(0, currentFixed - 30)}
          max={Math.min(max, currentFixed + 30)}
          // getAriaValueText={valuetext}
        />
        <br />
        <TextField label="Title" value={videoTitle} fullWidth />
        <TextField label="Current" value={current} />
        <TextField label="Start" value={start} />
        <TextField label="End" value={end} />
      </Box>
      <CopyToClipboard
        text={window.location.href}
        // onCopy={() => this.setState({copied: true})}
      >
        <Button>Copy link to clipboard</Button>
      </CopyToClipboard>
    </div>
  );
}

export default App;
