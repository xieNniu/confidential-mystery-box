# 🚀 开发指南

## 目录
- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [开发流程](#开发流程)
- [部署指南](#部署指南)
- [常见问题](#常见问题)

---

## 快速开始

### 1. 环境准备

确保已安装：
- Node.js 18+ 
- npm 或 yarn
- MetaMask 浏览器插件

### 2. 获取测试币

访问 [Sepolia 水龙头](https://sepoliafaucet.com/) 获取测试 ETH

### 3. 安装依赖

```bash
# 根目录 - 安装合约依赖
npm install

# 前端目录 - 安装前端依赖
cd frontend
npm install
```

### 4. 配置环境变量

创建根目录的 `.env` 文件：

```bash
# 您的 MetaMask 私钥（不要提交到 Git！）
PRIVATE_KEY=your_private_key_here

# Sepolia RPC URL
SEPOLIA_RPC_URL=https://eth-sepolia.public.blastapi.io
```

> ⚠️ **重要**: 永远不要将私钥提交到 Git 仓库！

### 5. 编译合约

```bash
# 在根目录运行
npx hardhat compile
```

### 6. 部署合约

```bash
# 部署 Simple 版本（Fallback）
npx hardhat run scripts/deploy_simple.js --network sepolia

# 部署 FHE 版本
npx hardhat run scripts/deploy_fhe.js --network sepolia
```

部署后会生成 `deployment_simple.json` 和 `deployment_fhe.json` 文件。

### 7. 更新合约地址

将部署的合约地址复制到前端配置：

```typescript
// frontend/src/config/constants.ts
export const CONTRACT_ADDRESS_SIMPLE = "0x..."; // 从 deployment_simple.json 复制
export const CONTRACT_ADDRESS_FHE = "0x...";    // 从 deployment_fhe.json 复制
```

### 8. 启动前端

```bash
cd frontend
npm run dev
```

浏览器会自动打开 http://localhost:5173

---

## 项目结构

```
mystery-box-fhe/
├── contracts/                  # 智能合约
│   ├── MysteryBoxSimple.sol   # 明文版本（Fallback）
│   └── MysteryBoxFHE.sol      # FHE 加密版本
│
├── scripts/                    # 部署脚本
│   ├── deploy_simple.js
│   └── deploy_fhe.js
│
├── frontend/                   # React 前端
│   ├── src/
│   │   ├── components/        # UI 组件
│   │   │   ├── Header.tsx     # 顶部导航
│   │   │   ├── Store.tsx      # 盲盒商店
│   │   │   ├── MyBoxes.tsx    # 我的盲盒
│   │   │   └── Admin.tsx      # 管理面板
│   │   │
│   │   ├── contexts/          # React Context
│   │   │   ├── WalletContext.tsx    # 钱包管理
│   │   │   └── ContractContext.tsx  # 合约/Gateway 管理
│   │   │
│   │   ├── hooks/             # 自定义 Hooks
│   │   │   ├── useContract.ts       # 合约交互
│   │   │   └── useMysteryBox.ts     # 盲盒业务逻辑
│   │   │
│   │   ├── utils/             # 工具函数
│   │   │   ├── fhevm.ts       # FHEVM SDK 集成
│   │   │   └── helpers.ts     # 辅助函数
│   │   │
│   │   ├── config/            # 配置文件
│   │   │   ├── constants.ts   # 常量和 UI 文本
│   │   │   └── abis.ts        # 合约 ABI
│   │   │
│   │   ├── types/             # TypeScript 类型
│   │   ├── App.tsx            # 主应用
│   │   └── main.tsx           # 入口文件
│   │
│   ├── vite.config.ts
│   └── package.json
│
├── hardhat.config.js
├── package.json
└── README.md
```

---

## 开发流程

### 阶段 1: 合约开发

#### Simple 版本（测试用）
```solidity
// contracts/MysteryBoxSimple.sol
// - 使用明文存储奖品金额
// - 不需要 Gateway
// - 用于快速测试和 Fallback
```

#### FHE 版本（生产用）
```solidity
// contracts/MysteryBoxFHE.sol
// - 使用 euint32 加密奖品金额
// - 通过 Gateway Coprocessor 解密
// - 完全的隐私保护
```

### 阶段 2: 前端开发

#### 双合约架构
```typescript
// ContractContext 自动管理：
// - Gateway 健康检查（每 60 秒）
// - 自动切换合约类型
// - FHE ↔ Simple 无缝切换
```

#### 核心功能
1. **管理员**：创建系列、充值奖品池
2. **用户**：购买盲盒、开启盲盒、领取奖品
3. **自动化**：Gateway 故障自动降级

### 阶段 3: 测试

#### 本地测试
```bash
# 1. 部署到 Sepolia
npm run deploy:simple
npm run deploy:fhe

# 2. 更新前端合约地址

# 3. 启动前端测试
cd frontend && npm run dev
```

#### 测试场景
- ✅ Gateway 在线 → 使用 FHE 模式
- ✅ Gateway 离线 → 自动切换到 Simple 模式
- ✅ 创建系列 → 购买 → 开启 → 领取（完整流程）

---

## 部署指南

### 准备工作

1. **获取 Sepolia ETH**
   - 至少 0.1 ETH 用于部署
   - 额外 0.5+ ETH 用于奖品池

2. **配置私钥**
   ```bash
   # .env
   PRIVATE_KEY=your_private_key
   ```

3. **检查 RPC 连接**
   ```bash
   curl https://eth-sepolia.public.blastapi.io \
     -X POST \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
   ```

### 部署步骤

#### 1. 编译合约
```bash
npx hardhat compile
```

#### 2. 部署 Simple 合约
```bash
npx hardhat run scripts/deploy_simple.js --network sepolia
```

输出示例：
```
🚀 Deploying MysteryBoxSimple to Sepolia...
👤 Deployer address: 0x1cF5...
💰 Deployer balance: 0.5 ETH
✅ MysteryBoxSimple deployed to: 0xABC...
💾 Deployment info saved to deployment_simple.json
```

#### 3. 部署 FHE 合约
```bash
npx hardhat run scripts/deploy_fhe.js --network sepolia
```

#### 4. 验证部署
在 [Sepolia Etherscan](https://sepolia.etherscan.io/) 查看合约

#### 5. 为合约充值
```bash
# 通过前端管理面板充值
# 或使用 Etherscan 直接转账
```

#### 6. 更新前端
```typescript
// frontend/src/config/constants.ts
export const CONTRACT_ADDRESS_SIMPLE = "0xABC...";
export const CONTRACT_ADDRESS_FHE = "0xDEF...";
```

#### 7. 构建前端
```bash
cd frontend
npm run build
```

#### 8. 部署前端（可选）
- Vercel
- Netlify
- GitHub Pages

---

## 常见问题

### Q1: 合约部署失败
```
Error: insufficient funds for intrinsic transaction cost
```

**解决**: 钱包余额不足，获取更多测试 ETH

### Q2: Gateway 一直离线
```
🔴 Gateway 离线
```

**解决**: 
1. 检查 https://status.zama.ai/
2. 等待 Gateway 恢复
3. 或使用 Simple 模式继续测试

### Q3: 前端无法连接钱包
```
❌ 未检测到钱包
```

**解决**: 
1. 安装 MetaMask
2. 刷新页面
3. 点击 "连接钱包"

### Q4: 交易一直 Pending
```
⏳ 等待交易确认...
```

**解决**: 
1. 检查 Gas 价格
2. 在 MetaMask 加速交易
3. 或取消后重试

### Q5: 开盒后看不到奖品
**FHE 模式**: 等待 5-15 秒，Gateway 解密需要时间

**Simple 模式**: 刷新页面

### Q6: 修改合约后前端报错
```
❌ execution reverted
```

**解决**: 
1. 重新编译: `npx hardhat compile`
2. 重新部署合约
3. 更新前端合约地址和 ABI

### Q7: 如何切换测试网络
在 MetaMask 中：
1. 点击网络下拉菜单
2. 选择 "Sepolia test network"
3. 或点击前端的 "切换到 Sepolia"

---

## 性能优化

### 合约优化
- ✅ 使用 `memory` 而非 `storage` 读取
- ✅ 批量操作减少 Gas
- ✅ 事件日志而非存储查询

### 前端优化
- ✅ React.memo 减少重渲染
- ✅ useCallback 缓存函数
- ✅ 轮询间隔 60 秒（Gateway 检查）

---

## 安全建议

### 合约安全
- ⚠️ 生产环境必须审计
- ⚠️ 使用 OpenZeppelin 库
- ⚠️ 权限控制（onlyOwner）
- ⚠️ 防重入攻击

### 前端安全
- ⚠️ 永远不要在代码中硬编码私钥
- ⚠️ 验证用户输入
- ⚠️ 使用 HTTPS 部署
- ⚠️ 定期更新依赖

---

## 下一步

### 功能扩展
- [ ] NFT 奖品支持
- [ ] 稀有度系统（普通/稀有/史诗/传奇）
- [ ] 盲盒交易市场
- [ ] 多链部署

### 技术优化
- [ ] 使用 The Graph 索引事件
- [ ] 添加单元测试
- [ ] CI/CD 自动化部署
- [ ] 性能监控

---

## 参考资源

- [Zama FHEVM 文档](https://docs.zama.ai/fhevm)
- [Hardhat 文档](https://hardhat.org/docs)
- [ethers.js v6 文档](https://docs.ethers.org/v6/)
- [React 文档](https://react.dev/)

---

**开发愉快！如有问题请查看项目 README 或提交 Issue。** 🚀


