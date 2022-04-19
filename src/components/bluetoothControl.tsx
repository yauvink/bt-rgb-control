import React, { useState, useEffect } from 'react';
import Roundy from 'roundy';
import CircularColor from 'react-circular-color';

import { SERVICE, CHARACTERISTIC, EFFECTS, EffectsArray, colors } from '../constants/bluetooth';
import { getRGBValue, getEffectValue, getBrightnessValue, getEffectSpeedValue } from '../utils/values';
import Group10 from '../images/Group10.png';
import Group11 from '../images/Group11.png';

const BluetoothControl = () => {
  const volumeIncrease = 2;
  const [isConnected, setConnected] = useState(false);
  const [char, setChar] = useState<BluetoothRemoteGATTCharacteristic | undefined>(undefined);
  const [color, setColor] = useState('#00ffff');
  const [effect, setEffect] = useState<string | number | null>(null);
  const [effectSpeed, setEffectSpeed] = useState<number | number[]>(48);
  const [brightness, setBrightness] = useState<number | number[]>(100);
  const [volumeAverage, setVolumeAverage] = useState<number>(0);
  const [angle, setAngle] = useState<number>(0);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  useEffect(() => {
    console.log('use effect');
    if (isConnected && char) {
      console.log('RGB');
      char.writeValue(getRGBValue(color));
    }
  }, [color, isConnected, char]);

  useEffect(() => {
    console.log('use effect');
    if (isConnected && effect && char) {
      console.log('effect');
      char.writeValue(getEffectValue(effect));
    }
  }, [effect, isConnected, char]);

  useEffect(() => {
    console.log('use effect');
    if (isConnected && char) {
      console.log('brightness');
      char.writeValue(getBrightnessValue(brightness));
    }
  }, [brightness, isConnected, char]);

  useEffect(() => {
    console.log('use effect');
    if (isConnected && char) {
      console.log('effectSpeed');
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
    console.error(`${event.target.name} DISCONNECTED`);
  };

  const handleClickConnect = () => {
    navigator.bluetooth
      .requestDevice({
        acceptAllDevices: true,
        optionalServices: [SERVICE],
      })
      .then((device: BluetoothDevice) => {
        console.log('device', device);
        device.addEventListener('gattserverdisconnected', onDisconnected);
        return device.gatt?.connect();
      })
      .then((server?: BluetoothRemoteGATTServer) => {
        console.log('server', server);
        return server?.getPrimaryService(SERVICE);
      })
      .then((service?: BluetoothRemoteGATTService) => {
        console.log('service', service);
        return service?.getCharacteristic(CHARACTERISTIC);
      })
      .then((characteristic?: BluetoothRemoteGATTCharacteristic) => {
        console.log(`${characteristic?.service.device.name} CONNECTED`);
        setChar(characteristic);
        setConnected(true);
      })
      // .then((value) => {
      //   console.log("value", value);
      // });
      .catch((e) => {
        console.error(String(e));
      });
  };

  const touchStart = (e: React.TouchEvent) => {
    const touch = e.changedTouches.item(0);
    setTouchStartY(touch.clientY);
  };

  const touchMove = (e: React.TouchEvent) => {
    const touch = e.changedTouches.item(0);
    if (!touchStartY) return;
    const diff = touchStartY - touch.clientY;
    const src = document.getElementById('colorCircle')!;
    setAngle(angle + diff / 50);
    src.style.transform = 'rotate(' + angle + 'deg)';
    const index = Math.abs(Math.round(((angle - 165) % 360) / (360 / 12)));
    if (angle < 0) {
      if (color !== colors[index]) {
        setColor(colors[index]);
      }
    } else {
      if (color !== colors.reverse()[index]) {
        setColor(colors.reverse()[index]);
      }
    }
  };

  return (
    <div className="bluetoothControl">
      <span className="header-text">
        {isConnected ? `Connected device: ${char?.service.device.name}` : 'Device is not connected.'}
      </span>
      <div className="header-button-wrapper">
        <button className={isConnected ? 'btn btn-connected' : 'btn btn-connect'} onClick={handleClickConnect}>
          {isConnected ? 'Connected' : 'Connect'}
        </button>
        <button className={isConnected ? 'btn btn-on' : 'btn btn-off'}>{isConnected ? 'on' : 'off'}</button>
      </div>
      <div className="bright-label-wrapper">
        <span className="label bright vertical">Brightness:</span>
        <span className="amount bright vertical">{brightness}</span>
      </div>
      <div className="bright-slider-wrapper">
        <div className="bright-slider">
          <Roundy
            value={brightness}
            radius={210}
            arcSize={45}
            strokeWidth={6}
            rotationOffset={15}
            onChange={(value: number) => {
              setBrightness(value);
            }}
          />
        </div>
      </div>
      <div style={{ display: 'flex' }}>
        <button className="central-button" style={{ backgroundColor: color }}></button>
      </div>
      <div className="effect-label-wrapper">
        <span className="label effect vertical">Effect Speed:</span>
        <span className="amount effect vertical">{effectSpeed}</span>
      </div>

      <div style={{ display: 'flex' }}>
        <select
          name="select"
          className="effect-select"
          value={effect || EFFECTS.red}
          onChange={(event) => {
            setEffect(Number(event.target.value));
            console.log(event.target.value);
          }}
        >
          {Object.keys(EFFECTS).map((effect, index) => {
            return (
              <option key={index} value={EFFECTS[effect as keyof EffectsArray]}>
                {' '}
                {effect.toUpperCase()}
              </option>
            );
          })}
        </select>
      </div>
      <div className="effect-slider-wrapper">
        <div className="effect-slider">
          <Roundy
            value={effectSpeed}
            radius={210}
            arcSize={45}
            strokeWidth={6}
            rotationOffset={-60}
            onChange={(value: number) => {
              setEffectSpeed(value);
            }}
          />
        </div>
      </div>
      <div className="color-picker-wrapper" id="colorCircle" onTouchStart={touchStart} onTouchMove={touchMove}>
        <CircularColor
          numberOfSectors={12}
          color={color}
          onChange={setColor}
          size={420}
          renderHandle={() => {
            return <svg></svg>;
          }}
        ></CircularColor>
      </div>

      <img src={Group10} alt="musicBg"></img>
      <img style={{ position: 'absolute', top: '490px', left: '0px' }} src={Group11} alt="musicBg"></img>

      <button disabled onClick={handleListenMusicClick}>
        LISTEN MUSIC
      </button>
      {/* <Slider aria-label="test" color={'secondary'} value={volumeAverage * volumeIncrease} /> */}
    </div>
  );
};

export default BluetoothControl;
