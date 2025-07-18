import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Bonnie Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'linear-gradient(135deg, #fce4ec 0%, #f06292 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '20px',
            padding: '2rem',
            maxWidth: '400px',
            boxShadow: '0 10px 30px rgba(233, 30, 99, 0.3)',
            backdropFilter: 'blur(10px)'
          }}>
            <h1 style={{
              fontSize: '2rem',
              margin: '0 0 1rem 0',
              background: 'linear-gradient(135deg, #e91e63, #f06292)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              💋 Oops, darling...
            </h1>
            <p style={{
              fontSize: '1.1rem',
              margin: '0 0 1.5rem 0',
              color: '#666'
            }}>
              Something went wrong in my domain, but don't worry - I'll fix this for you 💕
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'linear-gradient(135deg, #e91e63, #f06292)',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                padding: '0.75rem 2rem',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                boxShadow: '0 4px 15px rgba(233, 30, 99, 0.3)'
              }}
              onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'}
              onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              Refresh My Space 💌
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;