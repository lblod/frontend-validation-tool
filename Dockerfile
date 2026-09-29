FROM madnificent/ember:5.4.1 AS builder

LABEL maintainer="sennebels@gmail.com"

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN ember build -prod

FROM semtech/static-file-service:0.2.0

COPY --from=builder /app/dist /data
