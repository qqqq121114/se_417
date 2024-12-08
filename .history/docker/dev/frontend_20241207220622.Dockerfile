FROM node:18-alpine

WORKDIR /app

# 设置 npm 镜像为淘宝镜像
RUN npm config set registry https://registry.npmmirror.com/
# 如果需要，也可以设置其他镜像相关配置
RUN npm config set disturl https://npmmirror.com/mirrors/node
RUN npm config set sass_binary_site https://npmmirror.com/mirrors/node-sass
RUN npm config set phantomjs_cdnurl https://npmmirror.com/mirrors/phantomjs
RUN npm config set electron_mirror https://npmmirror.com/mirrors/electron/
RUN npm config set chromedriver_cdnurl https://npmmirror.com/mirrors/chromedriver
RUN npm config set operadriver_cdnurl https://npmmirror.com/mirrors/operadriver
RUN npm config set selenium_cdnurl https://npmmirror.com/mirrors/selenium

# 安装依赖
COPY client/package*.json ./
RUN npm install

# 复制源代码
COPY client/ .

EXPOSE 5173

# 开发模式启动
CMD ["npm", "run", "dev", "--", "--host"] 