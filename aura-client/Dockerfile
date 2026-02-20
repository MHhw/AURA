# 1. 베이스 이미지
# "Node.js 20 버전이 설치된 가벼운 컴퓨터를 가져와라"
FROM node:20-alpine

# 2. 작업 폴더
WORKDIR /app

# 3. 의존성 설치 (장비 챙기기)
# "설치 목록(package.json)을 먼저 복사하고, npm install로 필요한 도구들을 다 다운받아라"
COPY package.json package-lock.json ./
RUN npm install

# 4. 소스 복사 (이사)
# "나머지 소스 코드 파일들을 다 복사해라"
COPY . .

# 5. 실행 명령
# "개발 모드(dev)로 서버를 켜라. --host는 외부(내 윈도우)에서 접속할 수 있게 문을 열어두라는 뜻이야"
CMD ["npm", "run", "dev", "--", "--host"]