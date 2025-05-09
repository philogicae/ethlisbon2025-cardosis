source .env
eval "$(ssh-agent -s)"
ssh-add ${SSH_KEY_FILE}
DOCKER_HOST="ssh://${VM_USER}@[${DOCKER_PROD}]" docker logs cardosis-backend --follow
