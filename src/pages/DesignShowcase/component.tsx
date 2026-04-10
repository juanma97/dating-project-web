import React from 'react';
import { theme } from '../../theme';
import Typography from '../../components/ui/Typography/component';
import Button from '../../components/ui/Button/component';
import Card from '../../components/ui/Card/component';
import Input from '../../components/ui/Input/component';
import Badge from '../../components/ui/Badge/component';

const DesignShowcase: React.FC = () => {
  return (
    <div
      style={{ backgroundColor: theme.colors.background, minHeight: '100vh', padding: '40px 20px' }}
    >
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <header style={{ marginBottom: '60px', textAlign: 'center' }}>
          <Typography variant="h1" align="center" style={{ marginBottom: '16px' }}>
            Zapyens Design System
          </Typography>
          <Typography variant="body1" color="secondary" align="center">
            "De vuelta a lo natural" — A calm digital space where real connections happen.
          </Typography>
        </header>

        {/* Colors Section */}
        <section style={{ marginBottom: '60px' }}>
          <Typography
            variant="h2"
            style={{
              marginBottom: '24px',
              borderBottom: `1px solid ${theme.colors.border}`,
              paddingBottom: '8px',
            }}
          >
            Color Palette
          </Typography>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: '20px',
            }}
          >
            {[
              { name: 'Primary', color: theme.colors.primary },
              { name: 'Primary Light', color: theme.colors.primaryLight },
              { name: 'Accent', color: theme.colors.accent },
              { name: 'Background', color: theme.colors.background, border: true },
              { name: 'Text Primary', color: theme.colors.text.primary },
              { name: 'Secondary Blue', color: theme.colors.secondary.blue },
              { name: 'Secondary Pink', color: theme.colors.secondary.pink },
            ].map((c) => (
              <Card key={c.name} padding="sm" style={{ textAlign: 'center' }}>
                <div
                  style={{
                    backgroundColor: c.color,
                    height: '80px',
                    borderRadius: theme.radius.md,
                    marginBottom: '12px',
                    border: c.border ? `1px solid ${theme.colors.border}` : 'none',
                  }}
                />
                <Typography variant="caption" weight="medium">
                  {c.name}
                </Typography>
                <Typography variant="caption" color="muted">
                  {c.color.toUpperCase()}
                </Typography>
              </Card>
            ))}
          </div>
        </section>

        {/* Typography Section */}
        <section style={{ marginBottom: '60px' }}>
          <Typography
            variant="h2"
            style={{
              marginBottom: '24px',
              borderBottom: `1px solid ${theme.colors.border}`,
              paddingBottom: '8px',
            }}
          >
            Typography
          </Typography>
          <Card>
            <Typography variant="h1" style={{ marginBottom: '8px' }}>
              Heading 1 - Zapyens
            </Typography>
            <Typography variant="h2" style={{ marginBottom: '8px' }}>
              Heading 2 - Modern Sapiens
            </Typography>
            <Typography variant="h3" style={{ marginBottom: '8px' }}>
              Heading 3 - Human Connection
            </Typography>
            <div style={{ marginTop: '24px' }}>
              <Typography variant="body1" style={{ marginBottom: '16px' }}>
                Body 1: Nature, trust, and authenticity. This is the primary text style used for
                descriptions and long-form content. It is designed to be highly readable and
                grounded.
              </Typography>
              <Typography variant="body2" color="muted">
                Body 2: Soft dopamine. This is for secondary information that doesn't need to stand
                out as much.
              </Typography>
            </div>
          </Card>
        </section>

        {/* Components Section */}
        <section style={{ marginBottom: '60px' }}>
          <Typography
            variant="h2"
            style={{
              marginBottom: '24px',
              borderBottom: `1px solid ${theme.colors.border}`,
              paddingBottom: '8px',
            }}
          >
            Core Components
          </Typography>

          {/* Buttons */}
          <div style={{ marginBottom: '40px' }}>
            <Typography variant="h3" style={{ marginBottom: '16px' }}>
              Buttons
            </Typography>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <Button variant="primary">Primary Button</Button>
              <Button variant="accent">Action (Accent)</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="primary" loading>
                Loading
              </Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
            </div>
          </div>

          {/* Badges */}
          <div style={{ marginBottom: '40px' }}>
            <Typography variant="h3" style={{ marginBottom: '16px' }}>
              Badges
            </Typography>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Badge variant="primary">Adventure</Badge>
              <Badge variant="accent">Trending</Badge>
              <Badge variant="blue">Soft Tech</Badge>
              <Badge variant="pink">Warm Human</Badge>
              <Badge variant="secondary">Natural</Badge>
            </div>
          </div>

          {/* Inputs */}
          <div style={{ marginBottom: '40px' }}>
            <Typography variant="h3" style={{ marginBottom: '16px' }}>
              Forms
            </Typography>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <Input label="Name" placeholder="Enter your name" />
              <Input
                label="Email"
                placeholder="you@example.com"
                error="Please enter a valid email"
              />
            </div>
          </div>

          {/* Cards */}
          <div>
            <Typography variant="h3" style={{ marginBottom: '16px' }}>
              Cards
            </Typography>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px',
              }}
            >
              <Card onClick={() => {}}>
                <Badge variant="primary" size="sm" style={{ marginBottom: '12px' }}>
                  Interactive
                </Badge>
                <Typography variant="h4" style={{ marginBottom: '8px' }}>
                  Click Me
                </Typography>
                <Typography variant="body2">
                  I have a hover effect and deeper shadow on interaction. Calm and inviting.
                </Typography>
              </Card>
              <Card variant="background">
                <Typography variant="h4" style={{ marginBottom: '8px' }}>
                  Background Variant
                </Typography>
                <Typography variant="body2">
                  Using the theme's background color instead of surface white. More grounded.
                </Typography>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DesignShowcase;
