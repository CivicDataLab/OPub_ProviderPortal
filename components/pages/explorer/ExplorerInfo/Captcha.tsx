import { Refresh, VolumeTwo } from '@opub-icons/workflow';
import { Button } from 'components/actions';
import { Flex } from 'components/layouts/FlexWrapper';
import React, { useEffect, useState } from 'react';
import { Text } from 'components/layouts';
import { TextArea, TextField } from 'components/form';
import styled from 'styled-components';

const Captcha = ({ ValidateCaptcha, setValidateCaptcha }) => {
  const [captchaValue, setCaptchaValue] = useState('');

  const generateCaptcha = (length) => {
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz0123456789';

    var lenString = length;
    var randomstring = '';

    for (var i = 0; i < lenString; i++) {
      var rnum = Math.floor(Math.random() * characters.length);
      randomstring += characters.substring(rnum, rnum + 1);
    }

    const canvas = document.getElementById('canv') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '30px Arial';

    let lineheight = 30;

    let lines = randomstring.split('\n');

    ctx.canvas.width = parseInt(length) * 30;
    ctx.canvas.height = lines.length * lineheight;

    ctx.textBaseline = 'middle';
    ctx.font = '20px Arial';

    let num = 0;

    for (let i = 0; i < parseInt(length); i++) {
      num = num + 1;
      let heigt_num = 27 * num;
      ctx.fillText(
        randomstring[i],
        heigt_num,
        Math.round(Math.random() * (15 - 12) + 12)
      );
    }

    return setCaptchaValue(randomstring);
  };

  useEffect(() => {
    if (ValidateCaptcha === 'new') {
      generateCaptcha(7);
      var getValue = document.getElementById(
        'captchainput'
      ) as HTMLInputElement;
      if (getValue.value != '') {
        getValue.value = '';
      }
    }
  }, [ValidateCaptcha]);

  const EnableAudio = () => {
    const synth = window.speechSynthesis;
    let utterance = new SpeechSynthesisUtterance(
      captchaValue.split('').join(' ')
    );
    synth.speak(utterance);
  };

  return (
    <Flex gap="20px" marginTop={'10px'} flexWrap="wrap">
      <Flex gap="10px">
        {/* <Text marginY={'auto'}>{captchaValue}</Text> */}
        <canvas id="canv" width={210} height={30}></canvas>
        <Flex flexDirection={'column'} justifyContent={'space-evenly'}>
          {' '}
          <Button
            kind="custom"
            icon={<Refresh />}
            iconOnly
            onPress={() => {
              generateCaptcha(7);
              setValidateCaptcha('mismatch');
            }}
          >
            refresh captcha
          </Button>
          <Button
            kind="custom"
            icon={<VolumeTwo />}
            iconOnly
            onPress={() => {
              EnableAudio();
            }}
          >
            enable audio
          </Button>
        </Flex>
      </Flex>

      <TextWrapper>
        <TextField
          label="Captcha"
          isRequired
          id="captchainput"
          name="captcha"
          onChange={(e) => {
            if (e === captchaValue) {
              setValidateCaptcha('match');
            } else {
              setValidateCaptcha('mismatch');
            }
          }}
          errorMessage={
            ValidateCaptcha === 'mismatch' && 'Please enter valid captcha'
          }
        />
      </TextWrapper>
    </Flex>
  );
};

export default Captcha;

const TextWrapper = styled.div`
  @media (max-width: 640px) {
    width: 100%;
  }
`;
