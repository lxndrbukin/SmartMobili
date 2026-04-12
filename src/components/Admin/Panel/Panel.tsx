import { type JSX, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PanelItems from './PanelItems';
import PanelCategories from './PanelCategories';

export default function Panel(): JSX.Element {
  const TABS = [
    { name: 'items', component: <PanelItems /> },
    { name: 'categories', component: <PanelCategories /> },
    { name: 'users', component: <></> },
    { name: 'orders', component: <></> },
  ];

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

  return (
    <div className='admin-panel'>
      <h1>{t('panel.header')}</h1>
      <div className='admin-panel-sections'>{renderTabBtns(TABS)}</div>
      {renderTabs(TABS)}
    </div>
  );
}
