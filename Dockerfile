# 多阶段构建 - 海外医疗辅助生殖网站
FROM node:20-alpine AS builder

WORKDIR /app

# 复制package文件
COPY package*.json pnpm-lock.yaml ./

# 安装pnpm并安装依赖
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建前端
RUN pnpm run build

# 生产阶段
FROM node:20-alpine AS production

WORKDIR /app

# 安装pnpm和必要的系统包
RUN npm install -g pnpm
RUN apk add --no-cache curl

# 复制package文件
COPY package*.json pnpm-lock.yaml ./

# 只安装生产依赖
RUN pnpm install --prod --frozen-lockfile

# 复制构建产物和API代码
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/api ./api
COPY --from=builder /app/vercel.json ./

# 创建生产服务器
RUN cat > server.js << 'EOF'
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

//// API代理路由
try {
  const supabaseProxy = require('./api/supabase-proxy.js');
  app.use('/api/supabase-proxy', supabaseProxy);
  console.log('✅ Supabase proxy loaded successfully');
} catch (error) {
  console.error('❌ Failed to load Supabase proxy:', error.message);
}

// PostgreSQL API路由
try {
  const postgresqlProxy = require('./api/postgresql.js');
  app.use('/api/postgresql', postgresqlProxy);
  console.log('✅ PostgreSQL proxy loaded successfully');
} catch (error) {
  console.error('❌ Failed to load PostgreSQL proxy:', error.message);
}

// Express API路由（如果存在）
try {
  const { default: apiApp } = require('./api/app.js');
  app.use('/api', apiApp);
  console.log('✅ Express API routes loaded successfully');
} catch (error) {
  console.error('❌ Failed to load Express API routes:', error.message);
}

// 静态文件服务
app.use(express.static('dist', {
  maxAge: '1d',
  etag: true
}));

// SPA路由处理 - 必须放在最后
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 Website: http://localhost:${PORT}`);
});
EOF

# 设置权限
RUN chmod +x server.js

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# 启动命令
CMD ["node", "server.js"]