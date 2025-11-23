FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

COPY microservice-shared ./microservice-shared
WORKDIR /app/microservice-shared
RUN mvn clean install -DskipTests

WORKDIR /app
COPY microservice-chat/pom.xml ./pom.xml
COPY microservice-chat/src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jdk
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8100
ENTRYPOINT ["java", "-jar", "app.jar"]
