# Étape 1 : Construire l'image à partir d'une image de Node
FROM node:16 AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le code source de l'application
COPY . .

# Compiler l'application NestJS
RUN npm run build

# Étape 2 : Exécuter l'application en production
FROM node:16

# Définir le répertoire de travail
WORKDIR /app

# Copier seulement le répertoire dist et package.json pour garder l'image légère
COPY --from=builder /app/dist /app/dist
COPY package*.json ./

# Installer les dépendances en mode production
RUN npm install --production

# Exposer le port sur lequel l'application écoute
EXPOSE 3000

# Démarrer l'application en production
CMD ["npm", "run", "start:prod"]
