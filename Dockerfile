FROM node:18

# Définit le répertoire de travail
WORKDIR /app

# Copie le package.json et le package-lock.json (si présent)
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie le reste de l'application
COPY src ./src
COPY tsconfig.json ./

# Expose le port sur lequel votre application écoute (par exemple 4000)
EXPOSE 4000

# Démarre le serveur de développement avec hot reload
CMD ["npm", "run", "start:dev"]
