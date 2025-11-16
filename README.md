# 99haus

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=Nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=TailwindCSS&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=Supabase&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=Notion&logoColor=white)

<img height="512" alt="image" src="https://github.com/user-attachments/assets/09b3d266-b496-48d1-bbb8-ad48cb25afcb" />
<img height="512" alt="image" src="https://github.com/user-attachments/assets/ffe9bb1f-b45a-4ca0-b154-f8f2951913c6" />

https://99haus.net

## 프로젝트 소개

인디 스토리텔러 박준의 포트폴리오 웹 페이지입니다.

콘텐츠 업로드를 위해 별도의 CMS를 구축하는 대신, Notion API를 활용하여 Notion에 작성된 페이지를 기반으로 게시글을 표시합니다.

- **프론트엔드**: Next.js, React, TypeScript, Tailwind CSS
- **데이터베이스**: Supabase
- **스토리지**: Cloudflare R2
- **배포**: Cloudflare Pages

## 문제 해결 사례

### 1. 이미지 로드 문제

Notion 페이지의 데이터를 가져오는 만큼, Notion에 저장된 이미지를 정상적으로 가져오는 것이 과제였습니다.

먼저, Notion에서 받은 이미지 경로를 그대로 사용하면 이미지의 유효 기간이 만료되었을 때 이미지를 불러오지 않는 문제를 확인할 수 있었습니다. 이를 해결하기 위해 Notion의 웹 공유 페이지에서 표시되는 이미지 경로로 원본 이미지 경로를 가공하는 방법을 사용했습니다.

또한, Notion API를 통해 가져온 이미지를 `srcset` 속성을 통해 반응형으로 표시하기 위해 별도의 이미지 로더를 구현했습니다. Notion 웹 공유 페이지에서 표시하는 이미지 경로의 width 속성을 조정하여 다양한 해상도의 이미지를 가져올 수 있도록 했습니다.

이미지를 화면에 표시하는 것은 성공했지만, 배포 도메인과 이미지 경로의 도메인이 서로 달라 콘솔을 열었을 때 CORS 에러 메시지가 발생하는 문제가 발생했습니다. 이 문제는 이미지 프록싱 API 라우트를 작성하여 해결할 수 있었습니다.

### 2. 로드 속도 개선

처음에는 Next.js의 서버 컴포넌트에서 Notion API에 직접 데이터를 요청하는 방식으로 구현했습니다. 그러나 Notion API의 응답 속도가 충분히 빠르지 않았기 때문에 페이지 로드 속도가 무려 약 6초나 소요되는 문제가 있었습니다.

근본적으로 이를 해결하기 위해 별도의 백엔드 서버를 구축하여 Notion API의 데이터를 Supabase에 저장하고, Next.js의 서버 컴포넌트에서는 Supabase의 데이터를 가져오는 방식으로 변경했고, 기존의 이미지 로드 로직 또한 Cloudflare R2에 이미지를 저장하여 불러오도록 변경했습니다.

이렇게 변경한 결과 페이지 로드 속도가 기존의 약 6초에서 약 0.4초로 약 93.33% 감소했으며, 페이지 로드 속도를 개선한 덕분에 사용자 경험 또한 향상될 수 있었습니다.

[blog.jihun.io에서 더 자세히 보기...](https://blog.jihun.io/guguhaus-project-2/)
