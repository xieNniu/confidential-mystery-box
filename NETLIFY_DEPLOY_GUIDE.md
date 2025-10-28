# 📦 Netlify部署指南

## 🚀 快速部署（拖拽方式）

### 方法1：拖拽整个项目文件夹（推荐！最简单！）

1. **访问Netlify Drop**
   - 打开浏览器，访问：https://app.netlify.com/drop
   - 如果没登录，先登录或注册（支持GitHub登录）

2. **准备部署包**
   - 确保你已经在本地构建了前端
   - 打开命令行，进入项目目录：
     ```bash
     cd E:\ZAMAcode\T05\frontend
     npm install
     npm run build
     ```
   - 这会在 `frontend/dist` 目录生成生产版本

3. **拖拽部署**
   - 找到 `E:\ZAMAcode\T05\frontend\dist` 文件夹
   - 直接拖拽整个 `dist` 文件夹到Netlify Drop页面
   - 等待上传完成（几秒钟）
   - 🎉 完成！你会得到一个临时URL

4. **配置自定义域名（可选）**
   - 在Netlify控制台点击 "Site settings"
   - 找到 "Domain management"
   - 点击 "Add custom domain" 添加你的域名

---

### 方法2：从GitHub仓库部署（自动化CI/CD）

1. **登录Netlify**
   - 访问：https://app.netlify.com/
   - 使用GitHub账号登录

2. **新建站点**
   - 点击 "Add new site" → "Import an existing project"
   - 选择 "Deploy with GitHub"
   - 授权Netlify访问你的GitHub仓库

3. **选择仓库**
   - 找到 `confidential-mystery-box` 仓库
   - 点击选择

4. **配置构建设置**
   ```
   Base directory:       frontend
   Build command:        npm run build
   Publish directory:    frontend/dist
   ```

5. **添加环境变量**（重要！）
   
   点击 "Show advanced" → "New variable"，添加以下变量：
   
   | Key | Value |
   |-----|-------|
   | `VITE_SEPOLIA_RPC_URL` | `https://eth-sepolia.public.blastapi.io` |
   | `VITE_GATEWAY_URL` | `https://gateway.zama.ai` |
   | `VITE_RELAYER_URL` | `https://relayer.zama.ai` |
   | `VITE_ACL_CONTRACT_ADDRESS` | `0x...` (你的ACL合约地址) |
   | `VITE_KMS_CONTRACT_ADDRESS` | `0x...` (你的KMS合约地址) |
   | `VITE_CONTRACT_ADDRESS_SIMPLE` | `0x6ca2bff6ea43e2c847A1` |
   | `VITE_CONTRACT_ADDRESS_FHE` | `0x9180E8620B0C726E68f937` |

6. **点击 "Deploy site"**
   - 等待构建完成（约2-3分钟）
   - 🎉 部署成功！

---

## 🔧 环境变量配置

### 必需的环境变量：

```env
# Sepolia测试网RPC
VITE_SEPOLIA_RPC_URL=https://eth-sepolia.public.blastapi.io

# Zama Gateway和Relayer
VITE_GATEWAY_URL=https://gateway.zama.ai
VITE_RELAYER_URL=https://relayer.zama.ai

# FHEVM基础合约（Sepolia测试网固定地址）
VITE_ACL_CONTRACT_ADDRESS=0x...
VITE_KMS_CONTRACT_ADDRESS=0x...

# 你的Mystery Box合约地址
VITE_CONTRACT_ADDRESS_SIMPLE=0x6ca2bff6ea43e2c847A1
VITE_CONTRACT_ADDRESS_FHE=0x9180E8620B0C726E68f937
```

### 在Netlify中设置环境变量：

1. 进入你的站点控制台
2. Site settings → Environment variables
3. 点击 "Add a variable"
4. 逐个添加上述变量
5. 保存后，点击 "Trigger deploy" 重新部署

---

## 📝 部署前检查清单

- [ ] 前端代码已更新到最新版本
- [ ] 已在本地成功构建（`npm run build`）
- [ ] 合约地址已正确配置在 `frontend/src/config/constants.ts`
- [ ] 环境变量已准备好（如果使用方法2）
- [ ] 已删除不必要的调试代码
- [ ] 已测试MetaMask连接功能

---

## 🎯 部署后测试

1. **访问你的Netlify URL**
   - 例如：`https://your-site-name.netlify.app`

2. **测试基本功能**
   - ✅ 页面能正常加载
   - ✅ 能连接MetaMask钱包
   - ✅ 能看到Mystery Box列表
   - ✅ 能购买Mystery Box
   - ✅ 能打开Mystery Box
   - ✅ 能提取奖品

3. **检查网络**
   - 确保切换到Sepolia测试网
   - 检查合约地址是否正确

---

## 🐛 常见问题解决

### 问题1：部署后页面空白

**原因**：环境变量未配置或路径错误

**解决**：
1. 检查 `netlify.toml` 中的 `publish` 路径是否为 `frontend/dist`
2. 检查环境变量是否正确设置
3. 查看Netlify部署日志，寻找错误信息

### 问题2：无法连接MetaMask

**原因**：HTTPS问题或权限问题

**解决**：
1. 确保使用Netlify的HTTPS URL（自动提供）
2. 在MetaMask中允许站点连接
3. 检查浏览器控制台是否有错误

### 问题3：合约调用失败

**原因**：合约地址错误或网络不匹配

**解决**：
1. 确认 `VITE_CONTRACT_ADDRESS_SIMPLE` 和 `VITE_CONTRACT_ADDRESS_FHE` 正确
2. 确认已切换到Sepolia测试网
3. 确认钱包有足够的测试ETH

### 问题4：构建失败 "command not found"

**原因**：Node.js版本或依赖问题

**解决**：
1. 在Netlify中设置 `NODE_VERSION=18`
2. 检查 `package.json` 中的依赖是否完整
3. 清除缓存重新部署：Deploy settings → Clear cache and retry

### 问题5：部署成功但功能异常

**原因**：生产环境配置与开发环境不同

**解决**：
1. 检查浏览器控制台（F12）查看错误
2. 确认所有环境变量已正确设置
3. 检查 `vite.config.ts` 中的build配置

---

## 🔄 更新部署

### 如果使用方法1（拖拽）：
- 重新在本地运行 `npm run build`
- 拖拽新的 `dist` 文件夹到Netlify
- 会创建一个新的部署

### 如果使用方法2（GitHub）：
- 推送代码到GitHub：`git push`
- Netlify会自动检测并重新部署
- 无需手动操作！

---

## 🌐 自定义域名

1. **购买域名**（可选）
   - 在Namecheap、GoDaddy等购买

2. **在Netlify添加域名**
   - Site settings → Domain management
   - Add custom domain
   - 输入你的域名（例如：mysterybox.example.com）

3. **配置DNS**
   - 在你的域名提供商处添加CNAME记录
   - 指向你的Netlify站点：`your-site.netlify.app`

4. **启用HTTPS**
   - Netlify会自动配置Let's Encrypt SSL证书
   - 通常在几分钟内完成

---

## 📊 性能优化建议

1. **启用资源压缩**
   - Netlify默认启用Gzip/Brotli压缩

2. **配置缓存**
   - 已在 `netlify.toml` 中配置静态资源缓存

3. **启用CDN**
   - Netlify自动提供全球CDN加速

4. **图片优化**
   - 考虑使用WebP格式
   - 使用Netlify Image CDN（如果需要）

---

## 📞 获取帮助

- **Netlify文档**：https://docs.netlify.com/
- **Netlify社区**：https://answers.netlify.com/
- **Zama FHEVM文档**：https://docs.zama.ai/fhevm

---

## ✅ 快速命令参考

```bash
# 本地构建
cd frontend
npm install
npm run build

# 预览构建结果
npm run preview

# 检查构建输出
ls -la dist/
```

---

## 🎉 恭喜！

你的Confidential Mystery Box已成功部署到Netlify！

现在你可以：
- ✅ 分享你的应用URL
- ✅ 让其他人测试你的应用
- ✅ 在简历/作品集中展示
- ✅ 参加Zama开发者计划

**记得在README.md中更新你的部署URL！** 🚀

