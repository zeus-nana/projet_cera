# Utilise l'image officielle de Node.js 18 basée sur Alpine Linux
FROM node:18-alpine

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie les fichiers package.json et package-lock.json depuis le répertoire courant
# vers le répertoire de travail dans le conteneur
COPY package*.json ./

# Installe les dépendances du projet à l'aide de npm
RUN npm install

# Copie les fichiers du répertoire courant vers le répertoire de travail dans le conteneur
COPY . .

# Expose le port 3000 pour permettre l'accès au serveur web
EXPOSE 3000

# Définit la commande par défaut pour démarrer le serveur web
CMD ["npm", "run", "dev"]

# Add node_modules/.bin to PATH
ENV PATH /app/node_modules/.bin:$PATH