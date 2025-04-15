FROM node:20 AS build-node
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM golang:1.23 AS build
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    libssl-dev \
    libc6-dev \
    make

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download
COPY . .
COPY --from=build-node /app/static /app/static
RUN GOARCH=amd64 CGO_ENABLED=1 GOOS=linux go build -o main cmd/server/main.go

FROM ubuntu:22.04 as prod
RUN apt-get update && apt-get install -y \
    libssl3 \
    libc6 \
    libpthread-stubs0-dev
WORKDIR /app
COPY --from=build /app/main /app/main
EXPOSE 80
CMD ["./main"]

