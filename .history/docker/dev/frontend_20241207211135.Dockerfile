FROM node:18-alpine

WORKDIR /app

# 安装依赖
COPY client/package*.json ./
RUN npm install

# 复制源代码
COPY client/ .

# 开发模式启动
CMD ["npm", "run", "dev", "--", "--host"] 