# 1. 베이스 이미지 변경: 17 -> 21
FROM eclipse-temurin:21-jdk-alpine

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. Gradle 파일 복사 및 의존성 설치
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# 실행 권한 부여 및 의존성 다운로드
RUN chmod +x ./gradlew
RUN ./gradlew dependencies --no-daemon

# 4. 소스 코드 복사
COPY src src

# 5. 스프링 부트 실행 (개발 모드)
CMD ["./gradlew", "bootRun"]