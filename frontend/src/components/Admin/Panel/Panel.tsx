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

  const isAdmin = token && user && user.user_role === 'admin';

  const [currentTab, setCurrentTab] = useState<string>('items');
  const { t } = useTranslation('admin');

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
