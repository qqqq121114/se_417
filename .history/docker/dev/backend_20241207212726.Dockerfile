FROM node:18-alpine

WORKDIR /app

# 安装依赖
COPY server/package*.json ./
RUN npm install

# 复制源代码
COPY server/ .

# 开发模式启动
CMD ["npm", "run", "dev"]