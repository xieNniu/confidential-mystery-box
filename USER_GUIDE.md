# 📖 User Guide - Confidential Mystery Box

Welcome to the **Confidential Mystery Box** system! This guide will help you get started with purchasing, opening, and claiming prizes from fully encrypted mystery boxes powered by Zama's FHEVM technology.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [For Users](#for-users)
4. [For Administrators](#for-administrators)
5. [System Modes](#system-modes)
6. [Decryption Process](#decryption-process)
7. [Troubleshooting](#troubleshooting)
8. [Security Tips](#security-tips)
9. [FAQ](#faq)

---

## 📖 Overview

### What is Confidential Mystery Box?

Confidential Mystery Box is a blockchain-based mystery box system where:

- 🎁 **Prize amounts are fully encrypted** on-chain using Zama's FHEVM
- 🔐 **Complete privacy**: No one can see prizes before opening
- ⚡ **Automatic fallback**: Seamless switching between FHE and plaintext modes
- 💰 **ETH prizes**: Real testnet ETH rewards
- 🎮 **Arcade-style UI**: Retro gaming experience

### Key Features

- **Fully Encrypted Prizes**: Prize amounts stored as `euint32` encrypted values
- **Dual Contract Architecture**: Automatic fallback ensures availability
- **Gateway Integration**: Seamless Zama Gateway decryption
- **Real-Time Progress**: Visual feedback during decryption
- **Smart Network Detection**: Auto-prompt for network switching

---

## 🚀 Getting Started

### Prerequisites

Before you begin, make sure you have:

1. **MetaMask Wallet**
   - Download: [https://metamask.io/](https://metamask.io/)
   - Create or import a wallet
   - Save your seed phrase securely

2. **Sepolia Testnet ETH**
   - Get free testnet ETH from: [https://sepoliafaucet.com/](https://sepoliafaucet.com/)
   - Or: [https://www.alchemy.com/faucets/ethereum-sepolia](https://www.alchemy.com/faucets/ethereum-sepolia)
   - You'll need ETH for:
     - Purchasing boxes
     - Gas fees for transactions
     - (Recommended: 0.1+ ETH for testing)

3. **Access to the Application**
   - Visit the deployed frontend (Netlify URL)
   - Or run locally: `cd frontend && npm run dev`

---

## 👤 For Users

### Step 1: Connect Your Wallet

1. **Click "Connect Wallet"** button in the top right corner
2. **Approve the connection** in MetaMask popup
3. **Network Check**:
   - If you see "Wrong Network" → Click **"Switch to Sepolia"**
   - MetaMask will prompt you to switch networks
   - Confirm the network switch

**✅ Success Indicators**:
- Wallet address displayed in header
- Network shows "Sepolia"
- Balance displayed

---

### Step 2: Browse Mystery Boxes

1. **Navigate to "Mystery Box Store"** tab (top navigation)
2. **View Available Series**:
   - Each series shows:
     - 📦 **Series Name**
     - 💰 **Price** (in ETH)
     - 📊 **Remaining Boxes** (e.g., "7/10")
     - 🏷️ **Status** (Active/Inactive)

3. **Review Series Details**:
   - Check if boxes are available
   - Verify you have enough ETH (price + gas)
   - Note: Boxes may sell out!

---

### Step 3: Purchase a Mystery Box

1. **Select a Series** you want to purchase from
2. **Click "Insert Coin"** (or "Buy Now") button
3. **Review Transaction** in MetaMask:
   - Check the amount (box price)
   - Review gas fee estimate
   - Confirm the transaction
4. **Wait for Confirmation** (~10-30 seconds)
5. **Success!** Your box is added to "My Boxes"

**💰 Purchase Flow**:
```
Click Buy → MetaMask Popup → Confirm → Wait → ✅ Box Purchased
```

**⚠️ Important Notes**:
- ✅ Ensure sufficient balance (price + gas)
- ✅ Transactions cannot be cancelled once submitted
- ✅ Purchased boxes cannot be refunded
- ✅ Each purchase is independent

---

### Step 4: Open Your Mystery Box

#### FHE Mode (Encrypted)

When Gateway is online, you'll see real-time decryption progress:

1. **Go to "My Boxes"** tab
2. **Find your unopened box** in "Unopened Boxes" section
3. **Click "Open Box"** button
4. **Confirm transaction** in MetaMask
5. **Watch the Progress**:
   - Progress bar shows decryption steps:
     - 10% - Submitting decryption request
     - 20-30% - Transaction confirmation
     - 30-85% - Gateway polling (5-15 seconds)
     - 85-95% - Waiting for on-chain callback
     - 95-100% - Getting final result
6. **Prize Revealed!** Box moves to "Opened Boxes"

**Decryption Time**: Typically 5-15 seconds

#### Simple Mode (Fallback)

When Gateway is offline, results are immediate:
- No progress bar
- Prize revealed instantly
- No encryption protection

---

### Step 5: Claim Your Prize

1. **Find your opened box** in "Opened Boxes" section
2. **Check Prize Amount**: Displayed in ETH
3. **Click "Withdraw Prize"** button
4. **Confirm transaction** in MetaMask
5. **Wait for confirmation** (~10-30 seconds)
6. **ETH transferred!** Check your MetaMask balance

**💡 Tips**:
- You can withdraw multiple prizes at once
- Withdrawn boxes show "✓ Withdrawn" badge
- Prize amount resets to 0 after withdrawal

---

## 👑 For Administrators

> **Note**: Admin features are only accessible to the contract owner (deployer)

### Accessing Admin Panel

1. **Connect your wallet** (must be the contract owner)
2. **Click "Admin Panel"** tab
3. **Verify Access**: You should see admin features

If you don't see the Admin Panel:
- ✅ Your wallet might not be the contract owner
- ✅ Try refreshing the page
- ✅ Check that you're connected

---

### Admin Feature 1: Fund the Contract

**⚠️ IMPORTANT**: You MUST fund the contract BEFORE creating series!

1. **Navigate to "Fund Contract"** section
2. **View Current Balance**: Shows contract's ETH balance
3. **Enter Deposit Amount** (in ETH)
4. **Click "Deposit"** button
5. **Confirm transaction** in MetaMask
6. **Wait for confirmation**

**💡 Recommended Deposit Amount**:
```
Recommended = (Box Price × Total Boxes) × 1.2
```

**Example**:
- Box Price: 0.01 ETH
- Total Boxes: 100
- Recommended: 0.01 × 100 × 1.2 = **1.2 ETH**

**Why 1.2x?** This ensures sufficient funds for prizes that may exceed the box price (up to 150%).

---

### Admin Feature 2: Create Mystery Box Series

1. **Navigate to "Create Mystery Box Series"** section
2. **Fill in Details**:
   - **Series Name**: e.g., "Lucky Box Series 1"
   - **Box Price** (ETH): Price per box (e.g., 0.01)
   - **Total Boxes**: Number of boxes in this series (e.g., 50)

3. **Click "Create Series"** button
4. **Confirm transaction** in MetaMask
5. **Wait for confirmation** (~10-30 seconds)
6. **Success!** Series appears in the Store

**📝 Series Details**:
- Prize amounts are **randomly generated** for each box
- Prize range: **50% - 150%** of box price
- Each box gets a unique encrypted prize amount
- Series is active immediately after creation

**⚠️ Important**:
- Ensure contract has sufficient balance before creating
- Series cannot be edited after creation
- You can toggle series active/inactive status

---

### Admin Feature 3: Monitor Contract Balance

- **Real-time balance** displayed in Admin Panel
- **Monitor regularly** to ensure sufficient funds
- **Deposit more** if balance gets low
- **Withdraw excess** (emergency withdraw function)

---

## ⚙️ System Modes

### Auto Mode (Recommended)

The system automatically detects Zama Gateway status:

**🟢 Gateway Online**:
- Automatically uses **FHE Encrypted Mode**
- ✅ Full privacy protection
- ✅ Prize amounts encrypted
- ⏱️ 5-15 second decryption time

**🔴 Gateway Offline**:
- Automatically switches to **Plaintext Mode**
- ⚡ Instant results
- ❌ No encryption protection
- 📝 Suitable for testing

**Status Display**:
- Shows in header: "🟢 Gateway Online" or "🔴 Gateway Offline"
- Current mode: "FHE Encrypted Mode" or "Plaintext Mode (Fallback)"

---

### Manual Mode

You can manually control which contract to use:

1. **Click "Auto Mode"** button to toggle
2. **Select Mode**:
   - **FHE Mode**: Full encryption (requires Gateway)
   - **Simple Mode**: Plaintext (instant, no encryption)

**Use Cases**:
- Testing specific functionality
- Gateway issues troubleshooting
- Development purposes

---

## 🔐 Decryption Process

### Understanding the 5-Step Flow

When you open a box in FHE mode, the system follows this process:

#### Step 1: Submit On-Chain Decryption Request (10%)
- Transaction submitted to blockchain
- Contract emits `DecryptionRequested` event
- Request ID generated

#### Step 2: Extract Request ID (20-30%)
- Transaction confirmed
- Event parsed to get Gateway request ID
- Request ID logged

#### Step 3: Poll Gateway (30-85%)
- System polls Zama Gateway API
- Checks if decryption is ready
- Progress updates every 5 seconds
- Typical duration: 5-15 seconds

#### Step 4: Wait for On-Chain Callback (85-95%)
- Gateway completes decryption
- Calls contract's callback function
- Prize amount stored on-chain
- Contract emits `DecryptionCompleted` event

#### Step 5: Get Final Result (95-100%)
- Frontend queries contract for result
- Prize amount displayed
- Box status updated to "Opened"

**Visual Feedback**:
- Progress bar shows percentage
- Status message updates at each step
- Estimated time displayed

---

## 🔄 Error Handling & Retry

### If Decryption Fails

The system includes robust error handling:

1. **Automatic Retry** (if supported):
   - System may retry up to 3 times
   - Wait 5 minutes between retries

2. **Manual Retry**:
   - Check box status in "My Boxes"
   - If stuck in "Decrypting" state, you can:
     - Wait for Gateway to recover
     - Use retry function (if implemented)
     - Contact support

3. **Timeout Handling**:
   - If decryption takes > 2 minutes, may timeout
   - Box status remains trackable
   - Can retry later

---

## ❓ Troubleshooting

### Issue 1: "Transaction Pending" Forever

**Symptoms**: Transaction stays in "Pending" state

**Solutions**:
1. **Check MetaMask**:
   - Open MetaMask extension
   - Go to Activity tab
   - Check transaction status
   
2. **Speed Up Transaction**:
   - Click on pending transaction
   - Select "Speed Up"
   - Increase gas price
   
3. **Wait**:
   - Sepolia blocks are ~15 seconds
   - Network congestion may delay

4. **Check Network**:
   - Ensure you're on Sepolia
   - Switch networks if needed

---

### Issue 2: "Insufficient Funds"

**Symptoms**: Transaction fails with "insufficient funds" error

**Solutions**:
1. **Check Balance**:
   - Ensure you have enough ETH
   - Need: Box price + Gas fee (~0.001 ETH)

2. **Get Testnet ETH**:
   - Visit: https://sepoliafaucet.com/
   - Request testnet ETH
   - Wait for deposit

3. **Reduce Amount**:
   - Buy cheaper boxes
   - Wait for more ETH

---

### Issue 3: "Gateway Offline"

**Symptoms**: Header shows "🔴 Gateway Offline"

**Solutions**:
1. **Wait**: Gateway may be under maintenance
2. **Check Status**: https://status.zama.ai/
3. **Use Simple Mode**: System auto-switches
4. **Try Later**: Gateway usually recovers quickly

**Note**: You can still use the system in Simple Mode, but without encryption.

---

### Issue 4: Box Won't Open

**Symptoms**: "Open Box" button doesn't work or shows error

**Solutions**:
1. **Check Box Status**:
   - Box must be in "Unopened" state
   - Already opened boxes can't be reopened

2. **Check Network**:
   - Ensure Sepolia network
   - Refresh page

3. **Check Gateway** (FHE mode):
   - Gateway must be online
   - Or switch to Simple mode

4. **Refresh Page**:
   - Clear browser cache
   - Hard refresh (Ctrl+F5)

---

### Issue 5: Prize Not Displayed After Opening

**Symptoms**: Box shows as opened but no prize amount

**Solutions**:
1. **Wait Longer** (FHE mode):
   - Decryption may take 5-15 seconds
   - Progress bar should show status

2. **Refresh Page**:
   - Click refresh button
   - Or reload (F5)

3. **Check Transaction**:
   - Verify transaction succeeded
   - Check on Sepolia Etherscan

4. **Check Box Status**:
   - Status should be "Opened"
   - If "Decrypting", wait for completion

---

### Issue 6: Can't Withdraw Prize

**Symptoms**: "Withdraw" button disabled or fails

**Solutions**:
1. **Check Box Status**:
   - Box must be "Opened"
   - Prize must be > 0 ETH

2. **Check Already Withdrawn**:
   - Look for "✓ Withdrawn" badge
   - Can't withdraw twice

3. **Check Transaction**:
   - Ensure previous transactions confirmed
   - Wait if any are pending

---

## 🔒 Security Tips

### Wallet Security

**⚠️ CRITICAL**: Never share these with anyone:

- ❌ **Private Key** - Never share
- ❌ **Seed Phrase** - Never share
- ❌ **Password** - Never share

**✅ Best Practices**:
- ✅ Use hardware wallet for large amounts
- ✅ Enable 2FA on all accounts
- ✅ Verify website URLs before connecting
- ✅ Regular security audits
- ✅ Backup wallet securely

---

### Transaction Security

**Before Confirming Any Transaction**:

1. **Verify Amount**: Check ETH amount matches expected
2. **Verify Address**: Ensure contract address is correct
3. **Check Gas Fee**: Reasonable gas fees (~0.001 ETH)
4. **Review Details**: Read all transaction parameters

**⚠️ Red Flags**:
- Requests to "verify" your wallet
- Unsolicited transactions
- Unexpected large gas fees
- Requests to approve unlimited spending

---

### Phishing Prevention

**How to Avoid Scams**:

1. **Verify URLs**: Only use official website
2. **Check Certificate**: HTTPS and valid certificate
3. **Official Links Only**: Never click suspicious links
4. **MetaMask Warnings**: Heed all MetaMask warnings
5. **Community Verification**: Check official channels

**Common Scams**:
- ❌ "Verify your wallet" messages
- ❌ "Free ETH" giveaways
- ❌ Fake airdrops
- ❌ Unauthorized transaction requests

---

## ❓ FAQ (Frequently Asked Questions)

### General Questions

**Q1: What is FHE?**

**A**: Fully Homomorphic Encryption (FHE) allows computations on encrypted data without decrypting it first. In this system, prize amounts are encrypted and stored on-chain, remaining secret until you open the box.

**Q2: Is this on mainnet?**

**A**: No, currently deployed on **Sepolia Testnet** for demonstration. Do not use with real assets.

**Q3: Are prizes random?**

**A**: Yes! Each box gets a random prize amount between 50% - 150% of the box price. Generated on-chain at purchase time.

---

### Technical Questions

**Q4: Why does decryption take 5-15 seconds?**

**A**: FHE decryption requires:
1. Blockchain transaction (~10-30 sec)
2. Gateway processing (~5-15 sec)
3. Callback confirmation (~2-5 sec)

Total: Typically 10-50 seconds in FHE mode.

**Q5: What happens if Gateway is offline?**

**A**: System automatically switches to Simple Mode:
- Immediate results (no decryption)
- No encryption protection
- Still fully functional

**Q6: Can I see prizes before opening?**

**A**: **No!** That's the whole point of FHE encryption. Prize amounts are encrypted and cannot be read until you explicitly open the box.

---

### Transaction Questions

**Q7: How much gas do I need?**

**A**: Typical gas fees:
- Purchase: ~0.0005 - 0.001 ETH
- Open Box: ~0.001 - 0.002 ETH (FHE mode)
- Withdraw: ~0.0003 - 0.0008 ETH

**Q8: Can I cancel a purchase?**

**A**: No, once submitted, transactions cannot be cancelled. However, you can check transaction status and speed it up if needed.

**Q9: What if my transaction fails?**

**A**: Failed transactions don't consume ETH (except gas fee). You can:
- Check error message
- Verify sufficient balance
- Try again with higher gas

---

### Prize Questions

**Q10: What's the minimum/maximum prize?**

**A**: Prize range is **50% - 150%** of box price:
- Minimum: 0.5x box price
- Maximum: 1.5x box price
- Example: For 0.01 ETH box → 0.005 - 0.015 ETH prize

**Q11: Can I lose money?**

**A**: In theory, yes. You pay the box price, but prize can be as low as 50% of that. However, prizes can also be up to 150%, so it's a gamble!

**Expected Value**: ~100% (break-even on average)

**Q12: Are prizes fair?**

**A**: Yes! Prize generation is:
- ✅ Random and verifiable
- ✅ On-chain and transparent
- ✅ Cannot be manipulated
- ✅ Provably fair

---

### Admin Questions

**Q13: How do I become an admin?**

**A**: You must be the contract deployer (owner). Admin status is checked automatically when you connect your wallet.

**Q14: Can I change box prices after creation?**

**A**: No, series details (price, quantity) cannot be changed after creation. You can only toggle active/inactive status.

**Q15: How much should I deposit?**

**A**: Recommended: `(Box Price × Total Boxes) × 1.2`

This ensures sufficient funds even if all prizes are maximum (150% of price).

---

## 🎯 Quick Reference

### For Users

| Action | Location | Button | Time |
|--------|----------|--------|------|
| Connect Wallet | Header | "Connect Wallet" | Instant |
| Browse Boxes | Store tab | - | - |
| Purchase Box | Store tab | "Insert Coin" | ~15 sec |
| Open Box | My Boxes tab | "Open Box" | 5-15 sec (FHE) |
| Withdraw Prize | My Boxes tab | "Withdraw Prize" | ~15 sec |

### For Admins

| Action | Location | Button | Prerequisites |
|--------|----------|--------|---------------|
| Fund Contract | Admin tab | "Deposit" | Wallet connected |
| Create Series | Admin tab | "Create Series" | Sufficient balance |
| View Balance | Admin tab | - | - |

---

## 📞 Getting Help

### Official Resources

- **GitHub Repository**: [https://github.com/xieNniu/confidential-mystery-box](https://github.com/xieNniu/confidential-mystery-box)
- **Zama Documentation**: [https://docs.zama.ai/fhevm](https://docs.zama.ai/fhevm)
- **Zama Developer Program**: [https://www.zama.ai/programs/developer-program](https://www.zama.ai/programs/developer-program)
- **Zama Status**: [https://status.zama.ai/](https://status.zama.ai/)

### Community Support

- **GitHub Issues**: Report bugs or request features
- **Zama Discord**: Join the FHEVM community
- **Documentation**: Check README.md and DEVELOPMENT_GUIDE.md

---

## 🎉 Ready to Start!

You're all set! Here's your first steps:

1. ✅ **Connect** your MetaMask wallet
2. ✅ **Switch** to Sepolia network
3. ✅ **Browse** the Mystery Box Store
4. ✅ **Purchase** your first box
5. ✅ **Open** and reveal your prize!

**Good luck!** 🍀✨

---

## 📝 Notes

### Testnet Disclaimer

⚠️ **Important**: This application is deployed on Sepolia **testnet**:
- Use only **testnet ETH** (not real ETH)
- All transactions are on testnet
- Do not use real assets
- For demonstration purposes only

### Gateway Availability

- Gateway may experience downtime
- System automatically falls back to Simple Mode
- Check [Zama Status](https://status.zama.ai/) for updates

### Prize Generation

- Prizes are randomly generated **at purchase time**
- Each box gets a unique prize amount
- Range: 50% - 150% of box price
- Fair and verifiable on-chain

---

**Last Updated**: 2025-01-XX  
**Version**: 1.0.0  
**Powered by**: Zama FHEVM

---

*Made with ❤️ for the Zama Developer Program*
