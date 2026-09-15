import { loadFont as loadSans } from '@remotion/google-fonts/NotoSansKR';
import { loadFont as loadSerif } from '@remotion/google-fonts/NotoSerifKR';
import { cancelRender, continueRender, delayRender } from 'remotion';

// 앱(app/layout.tsx)은 latin 서브셋만 요청하지만, Remotion 렌더러는
// 브라우저 캐시가 없어서 korean 서브셋을 명시하지 않으면 한글이 두부(□)로 나온다.
const sans = loadSans('normal', {
  weights: ['400', '500'], // 실제로 쓰는 굵기만. 한글 서브셋은 유니코드 범위별로 쪼개져 요청 수가 많다.
  subsets: ['korean', 'latin'],
  ignoreTooManyRequestsWarning: true,
});

const serif = loadSerif('normal', {
  weights: ['400', '600'],
  subsets: ['korean', 'latin'],
  ignoreTooManyRequestsWarning: true,
});

// 폰트가 실제로 준비될 때까지 프레임 캡처를 막는다.
const handle = delayRender('한글 웹폰트 로딩 중');

Promise.all([sans.waitUntilDone(), serif.waitUntilDone()])
  .then(() => continueRender(handle))
  .catch((err) => cancelRender(err));

export const sansFamily = sans.fontFamily;
export const serifFamily = serif.fontFamily;
