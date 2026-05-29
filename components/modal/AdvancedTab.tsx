'use client';

import { useState } from 'react';
import Toggle from '@/components/ui/Toggle';
import { IconChevronDown, IconLock } from '@/components/ui/Icons';

type Plan = 'standard' | 'premium' | 'enterprise';

const PLAN_LEVEL: Record<Plan, number> = { standard: 1, premium: 2, enterprise: 3 };
const FEATURE_MIN_LEVEL: Record<string, number> = {
  'All plans': 0,
  'Standard plan': 1,
  'Premium plan': 2,
  'Enterprise plan': 3,
};

interface Feature {
  key: string;
  name: string;
  description: string;
  plan: string;
  upgradeDesc: string;
  learnMoreUrl?: string;
  learnMoreText?: string;
}

const FEATURES: Feature[] = [
  {
    key: 'customContext',
    name: 'Custom Context',
    description: 'Pass dynamic user data into each conversation.',
    plan: 'Premium plan',
    upgradeDesc:
      'Personalize agent responses with user name, account info, session data, or any custom variable. Perfect for logged-in user experiences.',
    learnMoreUrl: 'https://docs.customgpt.ai/docs/enable-and-use-custom-context',
    learnMoreText: 'Custom Context',
  },
  {
    key: 'prePrompt',
    name: 'Pre-Prompt',
    description: 'Set a hidden system instruction for every conversation.',
    plan: 'Standard plan',
    upgradeDesc:
      'Write a system-level instruction that guides the agent before any user message — invisible to visitors, always applied.',
    learnMoreUrl: 'https://docs.customgpt.ai/docs/how-to-enable-and-use-pre-prompt-for-your-agent',
    learnMoreText: 'Pre-Prompt',
  },
  {
    key: 'crmIntegration',
    name: 'CRM Integration',
    description: 'Sync conversation data to HubSpot, Salesforce, and more.',
    plan: 'Enterprise plan',
    upgradeDesc:
      'Route leads, tag contacts, and log conversations directly to your CRM. Connects to HubSpot, Salesforce, and Zapier workflows.',
    learnMoreUrl: 'https://docs.customgpt.ai/docs/how-to-enable-and-use-crm-integration-for-your-agent',
    learnMoreText: 'CRM Integration',
  },
  {
    key: 'labels',
    name: 'Labels',
    description: 'Tag and categorize conversations for reporting.',
    plan: 'All plans',
    upgradeDesc:
      'Apply custom labels to conversations for team routing, analytics filtering, and workflow automation.',
    learnMoreUrl: 'https://docs.customgpt.ai/docs/enable-and-use-labels-for-your-agent',
    learnMoreText: 'Labels',
  },
];

function PlanBadge({ plan }: { plan: string }) {
  if (plan === 'All plans' || plan === 'Standard plan') return null;
  const label = plan.replace(' plan', '');
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 12,
      fontWeight: 500,
      color: '#5C53C0',
      backgroundColor: '#EAE8FD',
      borderRadius: 999,
      padding: '2px 8px 2px 6px',
      flexShrink: 0,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ color: '#7367F0', display: 'inline-flex' }}>
        <IconLock size={12} />
      </span>
      {label}
    </span>
  );
}

export default function AdvancedTab({ currentPlan = 'standard' }: { currentPlan?: Plan }) {
  const [openDrawer, setOpenDrawer] = useState<string | null>(null);

  function toggleDrawer(key: string) {
    setOpenDrawer((prev) => (prev === key ? null : key));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <p style={{ margin: '0 0 16px', fontSize: 13, lineHeight: '20px', color: '#737373' }}>
        Advanced features are available on higher-tier plans. Click any feature to learn more.
      </p>

      {FEATURES.map((feature, i) => {
        const isOpen = openDrawer === feature.key;
        const isLocked = PLAN_LEVEL[currentPlan] < (FEATURE_MIN_LEVEL[feature.plan] ?? 0);

        return (
          <div
            key={feature.key}
            style={{
              borderTop: i === 0 ? '1px solid #E5E5E5' : undefined,
              borderBottom: '1px solid #E5E5E5',
            }}
          >
            {/* Feature row */}
            <button
              type="button"
              onClick={() => toggleDrawer(feature.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '16px 0',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                gap: 12,
                textAlign: 'left',
              }}
            >
              {/* Left: name + description */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#171717' }}>
                    {feature.name}
                  </span>
                  {isLocked && <PlanBadge plan={feature.plan} />}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2, flexWrap: 'wrap' }}>
                  <p style={{ margin: 0, fontSize: 12, color: '#737373', lineHeight: '16px' }}>
                    {feature.description}
                  </p>
                  {feature.learnMoreUrl && (
                    <a
                      href={feature.learnMoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: '#7367F0',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 3,
                        flexShrink: 0,
                      }}
                    >
                      {feature.learnMoreText ?? 'Learn More'}
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.5 8.5L8.5 1.5M8.5 1.5H3.5M8.5 1.5V6.5" stroke="#7367F0" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>

              {/* Right: toggle + state + chevron */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <Toggle checked={false} onChange={() => {}} disabled={isLocked} />
                <span style={{ fontSize: 12, fontWeight: 500, color: '#A3A3A3', minWidth: 44 }}>
                  Disabled
                </span>
                <span
                  style={{
                    color: '#A3A3A3',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 200ms',
                    display: 'inline-flex',
                  }}
                >
                  <IconChevronDown />
                </span>
              </div>
            </button>

            {/* Upgrade drawer */}
            <div
              className="upgrade-drawer"
              data-open={isOpen ? 'true' : 'false'}
            >
              <div
                style={{
                  backgroundColor: '#FAFAFA',
                  border: '1px solid #E5E5E5',
                  borderRadius: 8,
                  padding: '14px 16px',
                  marginBottom: 12,
                }}
              >
                <p style={{ margin: '0 0 8px', fontSize: 13, lineHeight: '20px', color: '#404040' }}>
                  {feature.upgradeDesc}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, color: '#737373' }}>
                    Requires{' '}
                    <strong style={{ color: '#404040' }}>{feature.plan}</strong>
                  </span>
                  <span
                    style={{
                      color: '#7367F0',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 3,
                    }}
                  >
                    See plans →
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
