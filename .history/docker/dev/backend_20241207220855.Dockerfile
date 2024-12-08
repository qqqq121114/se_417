FROM node:18-alpine

WORKDIR /app

# 设置 npm 镜像为淘宝镜像
RUN npm config set registry https://registry.npmmirror.com/

# 复制package.json文件
COPY server/package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY server/ .

EXPOSE 3000

# 开发模式启动
CMD ["npm", "run", "dev"]