import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
// 한글 웹폰트가 큰 편이라 프레임당 대기 여유를 넉넉히 준다.
Config.setDelayRenderTimeoutInMilliseconds(120_000);
