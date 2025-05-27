# Koristimo Node.js za build
FROM node:14-alpine AS build

WORKDIR /app

# Kopiramo package fajlove i instaliramo zavisnosti
COPY package.json package-lock.json ./
RUN npm install

# Kopiramo ceo projekat i pravimo build
COPY . .
RUN npm run build --prod

# Koristimo Nginx za serviranje aplikacije
FROM nginx:alpine

# Dodajemo Nginx konfiguraciju
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Kopiramo build Angular aplikacije
COPY --from=build /app/dist/pogled-unutra-blog /usr/share/nginx/html

# Expose port za Nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]