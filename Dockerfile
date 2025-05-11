# 1. 빌드 환경 (Builder Stage)
FROM node:18-alpine AS builder
# 작업 디렉토리 설정
WORKDIR /app

# 의존성 설치를 위해 package.json과 lock 파일 복사
COPY package*.json ./
# 프로덕션 의존성만 설치 (Next.js는 빌드 시 devDependencies가 필요할 수 있음)
# 또는 npm ci --omit=dev (프로덕션 의존성만 설치, lock 파일 기반)
RUN npm install

# Jenkins 작업 공간에 생성된 .env.production 파일을 이미지 빌드 컨텍스트로 복사
# 이 파일은 Next.js 빌드 시 자동으로 .env.production으로 인식되어 사용됩니다.
# 이 COPY 명령은 npm install 이후, 그리고 소스 코드 전체 복사 이전에 위치하는 것이 좋습니다.
# .env 파일은 의존성 설치에 영향을 주지 않지만, 빌드에는 영향을 줍니다.
COPY .env.production .env.production

# 소스 코드 복사
COPY . .

# Next.js 애플리케이션 빌드
# NODE_ENV=production 환경 변수가 기본적으로 next build 시에 설정되지만, 명시적으로 지정할 수도 있습니다.
RUN npm run build

# 2. 프로덕션 환경 (Production Stage)
FROM node:18-alpine
WORKDIR /app

# 빌드 환경에서 프로덕션에 필요한 파일만 복사
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
# node_modules도 프로덕션 스테이지로 복사합니다.
# 만약 Next.js의 standalone output 기능을 사용한다면,
# 복사해야 할 파일들이 달라질 수 있습니다. (예: .next/standalone, .next/static)
COPY --from=builder /app/node_modules ./node_modules

# .env.production 파일은 빌드 시에만 사용되었으므로, 최종 프로덕션 이미지에는 포함시키지 않습니다.
# 빌드된 코드(.next 폴더 내)에 이미 환경 변수 값들이 반영되어 있습니다 (특히 NEXT_PUBLIC_* 변수들).
# 만약 서버 사이드에서만 사용하고 빌드 시점에 확정되지 않아도 되는 환경변수가 있다면,
# 이 Dockerfile의 ENV 명령어나, Kubernetes Deployment의 env 설정을 통해 주입할 수 있습니다.
# 예: ENV MY_SERVER_ONLY_VARIABLE="value_from_dockerfile_or_k8s"

# Next.js 애플리케이션이 실행될 포트 (기본값 3000)
EXPOSE 3000

# 애플리케이션 실행 명령어
# npm start는 package.json의 "scripts": { "start": "next start" }를 실행합니다.
CMD ["npm", "start"]