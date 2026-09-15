import React from 'react';
import { Composition } from 'remotion';
import { Intro } from './Intro';
import { CANVAS, VIDEO } from './theme';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Intro"
      component={Intro}
      durationInFrames={VIDEO.durationInFrames}
      fps={VIDEO.fps}
      width={CANVAS.width}
      height={CANVAS.height}
    />
  );
};
