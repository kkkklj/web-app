# 包含 Node.js 的官方镜像作为基础镜像
FROM node:16
# 存放 Next.js 应用程序的代码(工作目录)
WORKDIR /usr/src/app
# 将 Next.js 应用程序的代码复制到 Docker 镜像中的工作目录
COPY . .

RUN npm install
# 容器暴露的端口
EXPOSE 3000
# 定义启动 Next.js 应用程序的命令
CMD ["npm", "run", "start"]

# docker build -t nextjs-app .
# docker run -p 3000:3000 nextjs-app