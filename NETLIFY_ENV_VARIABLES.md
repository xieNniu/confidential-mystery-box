# 📋 Netlify环境变量配置清单

## 🔑 必需的环境变量

将以下环境变量添加到Netlify的环境变量设置中：

### 网络配置

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `VITE_SEPOLIA_RPC_URL` | `https://eth-sepolia.public.blastapi.io` | Sepolia测试网RPC节点 |

### Zama FHEVM配置

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `VITE_GATEWAY_URL` | `https://gateway.zama.ai` | Zama Gateway服务 |
| `VITE_RELAYER_URL` | `https://relayer.zama.ai` | Zama Relayer服务 |

### FHEVM基础合约（Sepolia固定地址）

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `VITE_ACL_CONTRACT_ADDRESS` | `0xFBEcEaBC38264de2Dbb00e63a1E7566704b42610` | 访问控制列表合约 |
| `VITE_KMS_CONTRACT_ADDRESS` | `0x90b5eB5f2f2D6874B8Df3a95C6a32CBab66AD37b` | 密钥管理服务合约 |

### Mystery Box合约地址

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `VITE_CONTRACT_ADDRESS_SIMPLE` | `0x6ca2bff6ea43e2c847A1` | Plaintext模式合约 |
| `VITE_CONTRACT_ADDRESS_FHE` | `0x9180E8620B0C726E68f937` | FHE加密模式合约 |

---

## 🚀 如何在Netlify中添加环境变量

### 方法1：Web界面（推荐）

1. 登录 https://app.netlify.com/
2. 选择你的站点
3. 进入 **Site settings** → **Environment variables**
4. 点击 **"Add a variable"**
5. 填写 Key 和 Value
6. 点击 **"Save"**
7. 重复步骤4-6添加所有变量
8. 添加完成后，点击 **"Trigger deploy"** 重新部署

### 方法2：Netlify CLI

```bash
# 安装Netlify CLI
npm install -g netlify-cli

# 登录
netlify login

# 链接到你的站点
netlify link

# 添加环境变量
netlify env:set VITE_SEPOLIA_RPC_URL "https://eth-sepolia.public.blastapi.io"
netlify env:set VITE_GATEWAY_URL "https://gateway.zama.ai"
netlify env:set VITE_RELAYER_URL "https://relayer.zama.ai"
netlify env:set VITE_ACL_CONTRACT_ADDRESS "0xFBEcEaBC38264de2Dbb00e63a1E7566704b42610"
netlify env:set VITE_KMS_CONTRACT_ADDRESS "0x90b5eB5f2f2D6874B8Df3a95C6a32CBab66AD37b"
netlify env:set VITE_CONTRACT_ADDRESS_SIMPLE "0x6ca2bff6ea43e2c847A1"
netlify env:set VITE_CONTRACT_ADDRESS_FHE "0x9180E8620B0C726E68f937"

# 重新部署
netlify deploy --prod
```

---

## ✅ 验证环境变量

部署完成后，打开浏览器控制台（F12），在Console中输入：

```javascript
console.log(import.meta.env)
```

你应该看到所有以 `VITE_` 开头的环境变量。

---

## ⚠️ 重要注意事项

1. **变量名必须以 `VITE_` 开头**
   - Vite只会暴露以 `VITE_` 开头的环境变量到前端代码

2. **修改后需要重新部署**
   - 添加或修改环境变量后，必须重新部署才能生效

3. **不要在代码中硬编码**
   - 所有配置都应该通过环境变量管理

4. **合约地址需要确认**
   - 确保 `VITE_CONTRACT_ADDRESS_SIMPLE` 和 `VITE_CONTRACT_ADDRESS_FHE` 是你实际部署的合约地址

---

## 🔍 检查当前配置

在 `frontend/src/config/constants.ts` 中查看环境变量的使用情况：

```typescript
export const CONTRACT_ADDRESS_SIMPLE = import.meta.env.VITE_CONTRACT_ADDRESS_SIMPLE || '0x6ca2bff6ea43e2c847A1';
export const CONTRACT_ADDRESS_FHE = import.meta.env.VITE_CONTRACT_ADDRESS_FHE || '0x9180E8620B0C726E68f937';
```

---

## 📞 故障排除

### 问题：前端无法读取环境变量

**解决**：
1. 确认变量名以 `VITE_` 开头
2. 确认已重新部署
3. 清除浏览器缓存后重试

### 问题：合约调用失败

**解决**：
1. 确认合约地址正确
2. 确认网络切换到Sepolia
3. 检查浏览器控制台错误信息

---

## 🎯 快速复制（用于Netlify Web界面）

```
VITE_SEPOLIA_RPC_URL=https://eth-sepolia.public.blastapi.io
VITE_GATEWAY_URL=https://gateway.zama.ai
VITE_RELAYER_URL=https://relayer.zama.ai
VITE_ACL_CONTRACT_ADDRESS=0xFBEcEaBC38264de2Dbb00e63a1E7566704b42610
VITE_KMS_CONTRACT_ADDRESS=0x90b5eB5f2f2D6874B8Df3a95C6a32CBab66AD37b
VITE_CONTRACT_ADDRESS_SIMPLE=0x6ca2bff6ea43e2c847A1
VITE_CONTRACT_ADDRESS_FHE=0x9180E8620B0C726E68f937
```

逐行复制，在Netlify中：
- Key = 等号前面的部分
- Value = 等号后面的部分

