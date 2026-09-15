# 책갈피 소개 영상 (Remotion)

세로 9:16 / 20초 / 무음. 앱을 녹화한 게 아니라 **React로 다시 그린** 화면입니다.
색·폰트·간격은 `app/globals.css`와 `app/layout.tsx`에서 그대로 가져왔습니다.

## 실행

```bash
cd video
npm install
npm run studio    # localhost:3001 (3000은 next dev 가 쓰므로 비켜 둠)
npm run render    # out/intro-9x16.mp4
```

첫 렌더 때 Remotion이 Chrome Headless Shell을 내려받습니다.

## 구성

| 씬 | 프레임 | 내용 |
|---|---|---|
| Hook | 0–90 | 브랜드 + `오늘, 어떤 책을 읽을까요?` |
| GenrePick | 90–225 | 분야 카드 8개 등장 → 철학·인문 선택 |
| Questions | 225–345 | 취향 질문에 순서대로 응답 |
| Searching | 345–405 | 주제별 병렬 웹 검색 |
| Results | 405–540 | 책 카드 4장 스크롤 |
| Outro | 540–600 | 브랜드 + 저장소 주소 |

씬 길이는 `src/theme.ts`의 `SCENE`에 모여 있고, 합이 600(=20초)이어야 합니다.

## 알아둘 점

- **한글 폰트**: `src/fonts.ts`에서 Noto Sans/Serif KR의 `korean` 서브셋을 명시하고
  `delayRender`로 로드를 기다립니다. 이걸 빼면 렌더 결과에서 한글이 두부(□)로 나옵니다.
- **스케일**: `ui/AppFrame.tsx`가 화면을 430px 폭(폰 크기)으로 그린 뒤 통째로 2.51배 확대합니다.
  덕분에 하위 컴포넌트는 앱과 똑같은 CSS 수치(`p-5`=20, `rounded-xl`=12)를 그대로 씁니다.
- **데이터**: `src/data.ts`는 실제 DB 추천 결과를 복사해 둔 것입니다. 렌더가 DB나 네트워크에
  의존하지 않도록 하드코딩했습니다.
