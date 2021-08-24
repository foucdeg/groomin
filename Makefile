include .env
DB_CONTAINER_ID := $(shell docker-compose ps -q db)

frontend/localhost-key.pem:
	mkcert -cert-file frontend/localhost.pem -key-file frontend/localhost-key.pem localhost

certs: frontend/localhost-key.pem
