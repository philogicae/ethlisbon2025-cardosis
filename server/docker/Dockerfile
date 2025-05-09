FROM denoland/deno:alpine-2.3.1

WORKDIR /api
RUN chown -R deno /api
USER deno

COPY .. .
RUN deno install --entrypoint src/server.ts

EXPOSE 8000
CMD deno run serve
