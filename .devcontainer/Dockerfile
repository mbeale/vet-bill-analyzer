FROM mcr.microsoft.com/devcontainers/typescript-node:1-20-bullseye

# Install additional tools that might be useful for development
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Create aliases for common commands
RUN echo 'alias ll="ls -la"' >> /home/node/.bashrc && \
    echo 'alias dev="npm run dev"' >> /home/node/.bashrc && \
    echo 'alias build="npm run build"' >> /home/node/.bashrc && \
    echo 'alias test="npm test"' >> /home/node/.bashrc
