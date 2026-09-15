import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { color, SCENE } from './theme';
import { sansFamily } from './fonts';
import { Hook } from './scenes/Hook';
import { GenrePick } from './scenes/GenrePick';
import { Questions } from './scenes/Questions';
import { Searching } from './scenes/Searching';
import { Results } from './scenes/Results';
import { Outro } from './scenes/Outro';

export const Intro: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: color.background, fontFamily: sansFamily }}>
      <Series>
        <Series.Sequence durationInFrames={SCENE.hook}>
          <Hook durationInFrames={SCENE.hook} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE.genrePick}>
          <GenrePick durationInFrames={SCENE.genrePick} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE.questions}>
          <Questions durationInFrames={SCENE.questions} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE.searching}>
          <Searching durationInFrames={SCENE.searching} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE.results}>
          <Results durationInFrames={SCENE.results} />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE.outro}>
          <Outro durationInFrames={SCENE.outro} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
