# Utilise l'image officielle de Node.js 18 basée sur Alpine Linux
FROM node:18-alpine

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie les fichiers package.json et package-lock.json
COPY package*.json ./

# Installe les dépendances du projet
RUN npm install

# Copie les fichiers du projet
COPY . .

# Expose le port 5173 pour Vite
EXPOSE 5173

# Add node_modules/.bin to PATH
ENV PATH /app/node_modules/.bin:$PATH

# Configure le watch pour fonctionner dans Docker
ENV CHOKIDAR_USEPOLLING=true

# Démarre Vite en mode développement
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]