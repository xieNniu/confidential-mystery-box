# Contributing to Confidential Mystery Box

First off, thank you for considering contributing to Confidential Mystery Box! It's people like you that make this project better.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

---

## 🤝 Code of Conduct

This project and everyone participating in it is governed by our commitment to fostering an open and welcoming environment. We pledge to make participation in our project a harassment-free experience for everyone.

### Our Standards

**Examples of behavior that contributes to a positive environment:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Examples of unacceptable behavior:**
- Trolling, insulting comments, or personal attacks
- Public or private harassment
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:
- Node.js v16 or higher
- npm or yarn
- Git
- A GitHub account
- MetaMask wallet with Sepolia testnet ETH

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
```bash
git clone https://github.com/YOUR_USERNAME/confidential-mystery-box.git
cd confidential-mystery-box
```

3. Add the upstream repository:
```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/confidential-mystery-box.git
```

4. Install dependencies:
```bash
npm install
cd frontend && npm install && cd ..
```

5. Create a `.env` file from the template:
```bash
cp env.example .env
# Edit .env with your configuration
```

---

## 💻 Development Process

### Branch Naming Convention

- `feature/` - New features (e.g., `feature/nft-prizes`)
- `fix/` - Bug fixes (e.g., `fix/wallet-connection`)
- `docs/` - Documentation updates (e.g., `docs/improve-readme`)
- `refactor/` - Code refactoring (e.g., `refactor/contract-structure`)
- `test/` - Test additions/improvements (e.g., `test/add-unit-tests`)

### Development Workflow

1. **Create a new branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**
   - Write clear, commented code
   - Follow the existing code style
   - Add tests for new features
   - Update documentation as needed

3. **Test your changes**
```bash
# Run smart contract tests
npx hardhat test

# Test frontend locally
cd frontend
npm run dev
```

4. **Commit your changes**
```bash
git add .
git commit -m "feat: add amazing new feature"
```

**Commit Message Format:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

5. **Push to your fork**
```bash
git push origin feature/your-feature-name
```

6. **Create a Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template

---

## 📝 Pull Request Process

### Before Submitting

- [ ] Code follows the project's style guidelines
- [ ] Self-review of your code completed
- [ ] Comments added for complex logic
- [ ] Documentation updated (if applicable)
- [ ] Tests added/updated (if applicable)
- [ ] All tests pass locally
- [ ] No console errors in frontend
- [ ] PR description clearly explains changes

### PR Template

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests
- [ ] All tests pass
```

### Review Process

1. At least one maintainer will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged
4. Your contribution will be credited in the release notes

---

## 🎨 Coding Standards

### Solidity (Smart Contracts)

```solidity
// ✅ Good
contract MysteryBox {
    // State variables
    uint256 public totalSeries;
    mapping(uint256 => Series) public series;
    
    // Events
    event SeriesCreated(uint256 indexed seriesId, string name);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    // Functions (external, public, internal, private)
    function createSeries(string memory _name) external onlyOwner {
        // Implementation
    }
}

// ❌ Bad
contract mysterybox {
    uint256 TotalSeries;
    function Create_Series(string memory n) public {
        // No documentation, inconsistent naming
    }
}
```

**Standards:**
- Use NatSpec comments for all public/external functions
- Follow Solidity naming conventions
- Order: state variables, events, modifiers, functions
- Function order: external, public, internal, private
- Always use explicit visibility modifiers

### TypeScript/React (Frontend)

```typescript
// ✅ Good
interface MysteryBoxProps {
  seriesId: number;
  price: string;
}

export function MysteryBox({ seriesId, price }: MysteryBoxProps) {
  const [loading, setLoading] = useState<boolean>(false);
  
  // Clear function names and error handling
  const handlePurchase = async () => {
    try {
      setLoading(true);
      await purchaseBox(seriesId, price);
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return <div>...</div>;
}

// ❌ Bad
export function Box(props) {
  const [l, setL] = useState(false); // Unclear variable names
  
  const h = async () => { // Unclear function name
    await p(props.s, props.p); // No error handling
  };
  
  return <div>...</div>;
}
```

**Standards:**
- Use TypeScript interfaces/types
- Functional components with hooks
- Clear variable and function names
- Proper error handling
- Add comments for complex logic

### File Structure

```
project-root/
├── contracts/          # Smart contracts
│   ├── MysteryBoxFHE.sol
│   └── MysteryBoxSimple.sol
├── scripts/           # Deployment scripts
├── test/              # Contract tests
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Utility functions
│   │   └── config/        # Configuration files
│   └── public/
└── docs/              # Additional documentation
```

---

## 🐛 Reporting Bugs

### Before Submitting a Bug Report

- Check the [existing issues](https://github.com/OWNER/REPO/issues)
- Verify you're using the latest version
- Test on Sepolia testnet
- Collect relevant information (screenshots, console logs, etc.)

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 96]
- MetaMask Version: [e.g., 10.5.0]
- Network: [e.g., Sepolia]

**Additional context**
Any other relevant information.
```

---

## 💡 Suggesting Features

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
What you want to happen.

**Describe alternatives you've considered**
Other solutions you've thought about.

**Additional context**
Mockups, examples, or other information.
```

---

## 🔒 Security

If you discover a security vulnerability, please **DO NOT** open a public issue. Instead, email the maintainers directly. We'll address the issue as quickly as possible.

---

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## 🎉 Recognition

Contributors will be:
- Listed in the README.md
- Credited in release notes
- Invited to join as project maintainers (for significant contributions)

---

## 💬 Questions?

- Open a [Discussion](https://github.com/OWNER/REPO/discussions)
- Join our community channels
- Contact the maintainers

---

Thank you for contributing to Confidential Mystery Box! 🎊

