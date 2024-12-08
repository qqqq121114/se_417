FROM node:18-alpine

WORKDIR /app

# 设置 npm 镜像为淘宝镜像
RUN npm config set registry https://registry.npmmirror.com/

# 安装依赖
COPY client/package*.json ./
RUN npm install

# 复制源代码
COPY client/ .

EXPOSE 5173

# 开发模式启动
CMD ["npm", "run", "dev", "--", "--host"] 