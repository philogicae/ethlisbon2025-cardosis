source .env
DOCKER_HOST="tcp://${DOCKER_TEST}" docker compose -f docker/compose-dev.yaml up --build
