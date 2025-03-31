FROM eclipse-temurin:17.0.12_7-jre
WORKDIR /app
COPY target/demo-0.0.1-SNAPSHOT.jar gestCom.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "gestCom.jar"]