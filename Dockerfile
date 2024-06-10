FROM madnificent/ember:5.4.1 as builder

LABEL maintainer="john.doe@example.com"


# Set npm log level to verbose to gather more details
RUN npm config set loglevel verbose


WORKDIR /app
COPY package.json ./
RUN npm install || { echo 'npm ci failed'; cat /root/.npm/_logs/*-debug.log; exit 1; }
COPY . .
RUN ember build -prod

FROM semtech/static-file-service:0.2.0

COPY --from=builder /app/dist /data
