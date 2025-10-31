import * as React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('❌ 捕获到错误:', error);
    console.error('❌ 错误详情:', errorInfo);
    
    this.setState({
      hasError: true,
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          backgroundColor: '#111827',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}>
          <div style={{
            maxWidth: '600px',
            backgroundColor: '#1f2937',
            padding: '2rem',
            borderRadius: '12px',
            border: '2px solid #ef4444',
          }}>
            <h1 style={{ color: '#ef4444', marginBottom: '1rem' }}>
              ❌ 应用程序出错了
            </h1>
            <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
              抱歉，应用程序遇到了一个错误。请查看下面的详细信息：
            </p>
            
            <div style={{
              backgroundColor: '#374151',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              overflow: 'auto',
            }}>
              <strong>错误信息:</strong>
              <pre style={{ margin: '0.5rem 0', color: '#ef4444' }}>
                {this.state.error && this.state.error.toString()}
              </pre>
              
              {this.state.errorInfo && (
                <>
                  <strong style={{ marginTop: '1rem', display: 'block' }}>堆栈跟踪:</strong>
                  <pre style={{ margin: '0.5rem 0', color: '#fbbf24', fontSize: '0.75rem' }}>
                    {this.state.errorInfo.componentStack}
                  </pre>
                </>
              )}
            </div>

            <button
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: 'pointer',
              }}
            >
              🔄 重新加载页面
            </button>

            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              backgroundColor: '#374151',
              borderRadius: '8px',
            }}>
              <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                <strong>常见解决方案：</strong>
              </p>
              <ul style={{ 
                fontSize: '0.875rem',
                color: '#9ca3af',
                marginTop: '0.5rem',
                paddingLeft: '1.5rem',
              }}>
                <li>清除浏览器缓存并刷新（Ctrl + Shift + R）</li>
                <li>检查浏览器控制台（F12）查看详细错误</li>
                <li>确保安装了 MetaMask 浏览器插件</li>
                <li>尝试使用其他浏览器</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


