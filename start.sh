git pull && docker compose -f docker-compose-prod.yml down && docker compose -f docker-compose-prod.yml up -d && docker compose -f docker-compose-prod.yml logs -f
