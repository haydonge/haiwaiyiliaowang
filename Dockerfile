# 使用官方Node.js镜像作为基础镜像
FROM node:20-alpine AS base

# 设置工作目录
WORKDIR /app

# 安装pnpm
RUN npm install -g pnpm

# 复制package文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --no-frozen-lockfile

# 复制源代码
COPY . .

# 构建阶段
FROM base AS build

# 设置生产环境变量（不包含敏感数据）
ENV NODE_ENV=production
ENV VITE_APP_TITLE="海外医疗辅助生殖网站"

# 构建应用
RUN pnpm run build

# 生产阶段
FROM nginx:alpine AS production

# 复制构建结果到nginx
COPY --from=build /app/dist /usr/share/nginx/html

# 复制nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]