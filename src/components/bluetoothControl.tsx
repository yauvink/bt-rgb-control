import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { Select, MenuItem, Collapse } from "@mui/material";
import Slider from "@mui/material/Slider";
import { HexColorPicker } from "react-colorful";

import {
  SERVICE,
  CHARACTERISTIC,
  EFFECTS,
  EffectsArray,
} from "../constants/bluetooth";
import {
  getRGBValue,
  getEffectValue,
  getBrightnessValue,
  getEffectSpeedValue,
} from "../utils/values";
import { Box } from "@mui/system";

const BluetoothControl = () => {
  const volumeIncrease = 2;
  const [isConnected, setConnected] = useState(false);
  const [char, setChar] = useState<
    BluetoothRemoteGATTCharacteristic | undefined
  >(undefined);
  const [color, setColor] = useState("#442242");
  const [effect, setEffect] = useState<string | number | null>(null);
  const [effectSpeed, setEffectSpeed] = useState<number | number[]>(48);
  const [brightness, setBrightness] = useState<number | number[]>(100);
  const [volumeAverage, setVolumeAverage] = useState<number>(0);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  useEffect(() => {
    console.log("use effect");
    if (isConnected && char) {
      console.log("RGB");
      char.writeValue(getRGBValue(color));
    }
  }, [color, isConnected, char]);

  useEffect(() => {
    console.log("use effect");
    if (isConnected && effect && char) {
      console.log("effect");
      char.writeValue(getEffectValue(effect));
    }
  }, [effect, isConnected, char]);

  useEffect(() => {
    console.log("use effect");
    if (isConnected && char) {
      console.log("brightness");
      char.writeValue(getBrightnessValue(brightness));
    }
  }, [brightness, isConnected, char]);

  useEffect(() => {
    console.log("use effect");
    if (isConnected && char) {
      console.log("effectSpeed");
      char.writeValue(getEffectSpeedValue(effectSpeed));
    }
  }, [effectSpeed, isConnected, char]);

  const handleListenMusicClick = () => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then(function (stream) {
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;

        microphone.connect(analyser);
        analyser.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);
        scriptProcessor.onaudioprocess = function () {
          const array = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(array);
          const arraySum = array.reduce((a, value) => a + value, 0);
          const average = arraySum / array.length;
          console.log(average);
          console.log(arraySum);
          console.log(array.length);
          console.log(volumeIncrease);
          setVolumeAverage(Math.round(average));
          if (char)
            char.writeValue(
              new Uint8Array([
                0x7e,
                0x00,
                0x01,
                `0x${(Math.round(average) * volumeIncrease).toString(16)}`,
                0x00,
                0x00,
                0x00,
                0x00,
                0xef,
              ] as any).buffer
            );
        };
      })
      .catch(function (err) {
        console.error(err);
      });
  };

  const onDisconnected = (event: any) => {
    setConnected(false);
    setAlertMessage(`${event.target.name} DISCONNECTED`);
    setAlertOpen(true);
  };

  const handleClickConnect = () => {
    navigator.bluetooth
      .requestDevice({
        acceptAllDevices: true,
        optionalServices: [SERVICE],
      })
      .then((device: BluetoothDevice) => {
        console.log("device", device);
        device.addEventListener("gattserverdisconnected", onDisconnected);
        return device.gatt?.connect();
      })
      .then((server?: BluetoothRemoteGATTServer) => {
        return server?.getPrimaryService(SERVICE);
      })
      .then((service?: BluetoothRemoteGATTService) => {
        return service?.getCharacteristic(CHARACTERISTIC);
      })
      .then((characteristic?: BluetoothRemoteGATTCharacteristic) => {
        console.log(`${characteristic?.service.device.name} CONNECTED`);
        setChar(characteristic);
        setConnected(true);
        setAlertOpen(false);
      })
      // .then((value) => {
      //   console.log("value", value);
      // });
      .catch((e) => {
        setAlertMessage(String(e));
        setAlertOpen(true);
      });
  };

  return (
    <div className="bluetoothControl">
      <Collapse in={alertOpen}>
        <Alert
          severity="error"
          onClose={() => {
            setAlertOpen(false);
          }}
        >
          {alertMessage}
        </Alert>
      </Collapse>
      <h4>
        {isConnected
          ? `Connected device: ${char?.service.device.name}`
          : "Device is not connected."}
      </h4>
      <Button
        color={isConnected ? "success" : "error"}
        variant={isConnected ? "contained" : "outlined"}
        onClick={handleClickConnect}
        style={{ fontSize: "22px" }}
      >
        {isConnected ? "Connected!" : "Connect"}
      </Button>
      <hr></hr>
      <h4>Brightness: {brightness}</h4>
      <Slider
        aria-label="Brightness"
        disabled={!isConnected}
        value={Number(brightness)}
        onChange={(event, value) => {
          setBrightness(value);
          // char?.writeValue(getBrightnessValue(brightness));
        }}
      />
      <Box display="flex" justifyContent="center">
        <HexColorPicker color={color} onChange={setColor} />
      </Box>
      <hr></hr>
      <Select
        fullWidth
        disabled={!isConnected}
        value={effect || EFFECTS.red}
        onChange={(event, value) => {
          setEffect(event.target.value);
        }}
      >
        {Object.keys(EFFECTS).map((effect, index) => {
          return (
            <MenuItem key={index} value={EFFECTS[effect as keyof EffectsArray]}>
              {effect}
            </MenuItem>
          );
        })}
      </Select>
      <h4>Effect Speed: {effectSpeed}</h4>
      <Slider
        aria-label="Effect speed"
        disabled={!isConnected}
        value={Number(effectSpeed)}
        onChange={(event, value) => {
          setEffectSpeed(value);
        }}
      />
      <hr></hr>
      <Button variant="contained" disabled onClick={handleListenMusicClick}>
        LISTEN MUSIC
      </Button>
      <Slider
        aria-label="test"
        color={"secondary"}
        value={volumeAverage * volumeIncrease}
      />
    </div>
  );
};

export default BluetoothControl;
