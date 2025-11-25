# 1. Node.js 개발 환경 (18버전)
FROM node:22-alpine

# 2. 작업 폴더 설정
WORKDIR /app

# 3. 패키지 설치 (캐싱 활용)
COPY package.json .
COPY package-lock.json .
RUN npm install

# 4. 소스 코드 복사
COPY . .

# 5. Vite 개발 서버 실행 (핫 리로딩)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
