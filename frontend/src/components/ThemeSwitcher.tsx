import React, { useState, useEffect } from 'react';

type Theme = 'default' | 'glassmorphism' | 'cyberpunk' | 'minimal' | 'game';

const themes = [
  {
    id: 'default' as Theme,
    name: '默认主题',
    icon: '🎨',
    description: '深色科技风',
    preview: '#111827',
  },
  {
    id: 'glassmorphism' as Theme,
    name: '玻璃拟态',
    icon: '✨',
    description: '现代渐变毛玻璃',
    preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    id: 'cyberpunk' as Theme,
    name: '赛博朋克',
    icon: '🌆',
    description: '霓虹灯科幻风',
    preview: '#ff2a6d',
  },
  {
    id: 'minimal' as Theme,
    name: '简约商务',
    icon: '📄',
    description: '白色极简风',
    preview: '#ffffff',
  },
  {
    id: 'game' as Theme,
    name: '游戏化',
    icon: '🎮',
    description: '3D互动游戏风',
    preview: 'linear-gradient(145deg, #9333ea, #f97316)',
  },
];

export function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<Theme>('default');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 从 localStorage 读取主题
    const savedTheme = localStorage.getItem('theme') as Theme || 'default';
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (theme: Theme) => {
    // 移除所有主题类
    document.body.classList.remove(
      'theme-glassmorphism',
      'theme-cyberpunk',
      'theme-minimal',
      'theme-game'
    );

    // 移除所有已加载的主题样式
    const existingStylesheets = document.querySelectorAll('link[data-theme-style]');
    existingStylesheets.forEach(el => el.remove());

    // 应用新主题
    if (theme !== 'default') {
      document.body.classList.add(`theme-${theme}`);
      
      // 动态加载主题 CSS（使用 import 而不是 link 标签）
      import(`../themes/${theme}.css`)
        .catch(err => {
          console.error(`Failed to load theme: ${theme}`, err);
        });
    }

    setCurrentTheme(theme);
    localStorage.setItem('theme', theme);
  };

  const switchTheme = (theme: Theme) => {
    applyTheme(theme);
    setIsOpen(false);
  };

  return (
    <div style={styles.container}>
      {/* 主题切换按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={styles.toggleButton}
        title="切换主题"
      >
        {themes.find(t => t.id === currentTheme)?.icon || '🎨'}
      </button>

      {/* 主题选择面板 */}
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <div
            style={styles.overlay}
            onClick={() => setIsOpen(false)}
          />
          
          {/* 主题卡片 */}
          <div style={styles.panel}>
            <div style={styles.header}>
              <h3 style={styles.title}>🎨 选择主题</h3>
              <button
                onClick={() => setIsOpen(false)}
                style={styles.closeButton}
              >
                ✕
              </button>
            </div>

            <div style={styles.grid}>
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => switchTheme(theme.id)}
                  style={{
                    ...styles.themeCard,
                    ...(currentTheme === theme.id ? styles.themeCardActive : {}),
                  }}
                >
                  <div
                    style={{
                      ...styles.preview,
                      background: theme.preview,
                    }}
                  />
                  <div style={styles.themeInfo}>
                    <div style={styles.themeIcon}>{theme.icon}</div>
                    <div style={styles.themeName}>{theme.name}</div>
                    <div style={styles.themeDesc}>{theme.description}</div>
                  </div>
                  {currentTheme === theme.id && (
                    <div style={styles.checkmark}>✓</div>
                  )}
                </button>
              ))}
            </div>

            <div style={styles.footer}>
              <p style={styles.footerText}>
                💡 主题会自动保存到浏览器
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 1000,
  },
  toggleButton: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.5)',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)',
    zIndex: 999,
  },
  panel: {
    position: 'fixed',
    bottom: '100px',
    right: '24px',
    width: '420px',
    maxHeight: '80vh',
    backgroundColor: '#1f2937',
    borderRadius: '16px',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
    overflow: 'hidden',
    zIndex: 1001,
    animation: 'slideUp 0.3s ease',
  },
  header: {
    padding: '20px',
    borderBottom: '1px solid #374151',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'white',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '0',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    transition: 'all 0.2s',
  },
  grid: {
    padding: '20px',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '12px',
    maxHeight: 'calc(80vh - 140px)',
    overflowY: 'auto',
  },
  themeCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    backgroundColor: '#374151',
    border: '2px solid transparent',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'left',
    position: 'relative',
  },
  themeCardActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#1e3a5f',
  },
  preview: {
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    flexShrink: 0,
    border: '2px solid rgba(255, 255, 255, 0.1)',
  },
  themeInfo: {
    flex: 1,
  },
  themeIcon: {
    fontSize: '20px',
    marginBottom: '4px',
  },
  themeName: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '4px',
  },
  themeDesc: {
    fontSize: '13px',
    color: '#9ca3af',
  },
  checkmark: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  footer: {
    padding: '16px 20px',
    borderTop: '1px solid #374151',
    backgroundColor: '#111827',
  },
  footerText: {
    margin: 0,
    fontSize: '13px',
    color: '#9ca3af',
    textAlign: 'center',
  },
};

