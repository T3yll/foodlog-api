# Utilisation de Node 20 au lieu de 18 pour corriger l'erreur crypto
FROM node:20

# Définit le répertoire de travail
WORKDIR /app

# Copie le package.json et le package-lock.json (si présent)
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie le reste de l'application
COPY src ./src
COPY tsconfig.json ./

# Copie le fichier .env pour les variables d'environnement
COPY .env ./

# Expose le port sur lequel votre application écoute
EXPOSE 4000

# Variable d'environnement pour indiquer qu'on est en développement
ENV NODE_ENV=development

# Démarre le serveur de développement avec hot reload
CMD ["npm", "run", "start:dev"]