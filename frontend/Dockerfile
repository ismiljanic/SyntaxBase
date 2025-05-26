# ---------- STAGE 1: React build ----------
FROM node:18-alpine AS build
WORKDIR /app

# Copy all files into the container
COPY . .

# Accept and export the API base URL for React build
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

# Install dependencies
RUN npm install

# React only sees env vars during build time. This ensures it's passed correctly.
RUN REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL npm run build

# ---------- STAGE 2: NGINX serve ----------
FROM nginx:alpine

# Clean default nginx html folder
RUN rm -rf /usr/share/nginx/html/*

# Copy built React app from previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Use custom nginx config if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port nginx serves on
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
