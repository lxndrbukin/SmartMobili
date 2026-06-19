import { type JSX, useState } from 'react';
import { Navigate } from 'react-router-dom';
import useLocalePath from '../../../hooks/useLocalePath';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { type RootState } from '../../../store';
import PanelItems from './PanelItems';
import PanelCategories from './PanelCategories';
import PanelUsers from './PanelUsers';
import PanelInquiries from './PanelInquiries';

export default function Panel(): JSX.Element {
  const TABS = [
    { name: 'items', component: <PanelItems /> },
    { name: 'categories', component: <PanelCategories /> },
    { name: 'users', component: <PanelUsers /> },
    { name: 'inquiries', component: <PanelInquiries /> },
  ];

  const to = useLocalePath();
  const { token, user } = useSelector((state: RootState) => state.auth);
  const [currentTab, setCurrentTab] = useState<string>('items');
  const { t } = useTranslation('admin');

  const isAuthenticating = token && !user;
  const isAdmin = token && user && user.user_role === 'admin';

  const renderTabBtns = (
    tabs: Array<{ name: string; component: JSX.Element }>,
  ) => {
    return tabs.map((tab) => {
      return (
        <button
          onClick={() => setCurrentTab(tab.name)}
          className={tab.name === currentTab ? 'active' : ''}
          key={tab.name}
        >
          {t(`panel.tabs.${tab.name}`)}
        </button>
      );
    });
  };

  const renderTabs = (
    tabs: Array<{ name: string; component: JSX.Element }>,
  ) => {
    const tab = tabs.find((t) => t.name === currentTab);
    return tab?.component;
  };

  if (isAuthenticating) {
    return (
      <div className="admin-panel-loading" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: 'var(--space-4)' }}>
        <div className="loading-spinner"></div>
        <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
          {t('panel.loading', { defaultValue: 'Loading...' })}
        </span>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to={to('')} />;
  }

  return (
    <div className='admin-panel'>
      <h1>{t('panel.header')}</h1>
      <div className='admin-panel-sections'>{renderTabBtns(TABS)}</div>
      {renderTabs(TABS)}
    </div>
  );
}
