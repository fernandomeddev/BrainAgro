FROM node:20-alpine AS build

WORKDIR /app

ARG VITE_API_URL=http://localhost:3333
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
RUN npm ci

COPY . .
RUN npm run build --workspace @brain-agriculture/web

FROM node:20-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
RUN npm ci --omit=dev

COPY --from=build /app/apps/web/dist apps/web/dist
COPY apps/web/serve-static.cjs apps/web/serve-static.cjs

EXPOSE 4173

CMD ["node", "apps/web/serve-static.cjs"]
