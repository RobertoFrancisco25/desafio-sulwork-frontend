# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Copia package.json e instala dependências
COPY package.json package-lock.json ./
RUN npm ci

# Copia o código fonte e faz build
COPY . .
RUN npm run build --prod

# Production stage
FROM nginx:alpine

# Copia os arquivos buildados para o nginx
COPY --from=build /app/dist/frontend-cafe-manha/browser /usr/share/nginx/html/


# Copia configuração customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]