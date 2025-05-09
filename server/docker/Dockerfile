FROM denoland/deno:alpine-2.3.1

WORKDIR /app
COPY .. .
RUN deno install --entrypoint src/server.ts

EXPOSE 8000
CMD deno run serve
