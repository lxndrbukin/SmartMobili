import { type JSX, useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import useLocalePath from '../../../hooks/useLocalePath';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { type RootState } from '../../../store';
import PanelItems from './PanelItems';
import PanelCategories from './PanelCategories';
import PanelServices from './PanelServices';
import PanelServiceCategories from './PanelServiceCategories';
import PanelBanners from './PanelBanners';
// import PanelLatestWorks from './PanelLatestWorks';
import PanelUsers from './PanelUsers';
import PanelInquiries from './PanelInquiries';
// import MyDashboard from '../Analytics/Analytics';

type PanelTab = {
  name: string;
  icon: string;
  component: JSX.Element;
};

type PanelGroup = {
  name: string;
  tabs: Array<PanelTab>;
};

export default function Panel(): JSX.Element {
  const GROUPS: Array<PanelGroup> = [
    {
      name: 'catalog',
      tabs: [
        { name: 'items', icon: 'fa-table-columns', component: <PanelItems /> },
        {
          name: 'categories',
          icon: 'fa-folder-tree',
          component: <PanelCategories />,
        },
      ],
    },
    {
      name: 'services',
      tabs: [
        {
          name: 'services',
          icon: 'fa-screwdriver-wrench',
          component: <PanelServices />,
        },
        {
          name: 'serviceCategories',
          icon: 'fa-folder-tree',
          component: <PanelServiceCategories />,
        },
      ],
    },
    {
      name: 'content',
      tabs: [
        { name: 'banners', icon: 'fa-image', component: <PanelBanners /> },
        // {
        //   name: 'latestWorks',
        //   icon: 'fa-images',
        //   component: <PanelLatestWorks />,
        // },
      ],
    },
    {
      name: 'customers',
      tabs: [
        {
          name: 'inquiries',
          icon: 'fa-inbox',
          component: <PanelInquiries />,
        },
        { name: 'users', icon: 'fa-users', component: <PanelUsers /> },
      ],
    },
    // {
    //   name: 'insights',
    //   tabs: [
    //     {
    //       name: 'analytics',
    //       icon: 'fa-chart-column',
    //       component: <MyDashboard />,
    //     },
    //   ],
    // },
  ];
  const TABS = GROUPS.flatMap((group) => group.tabs);

  const to = useLocalePath();
  const { token, user } = useSelector((state: RootState) => state.auth);
  const [currentTab, setCurrentTab] = useState<string>('items');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const navRef = useRef<HTMLElement>(null);
  const { t } = useTranslation('admin');

  useEffect(() => {
    if (!isMenuOpen) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  const isAuthenticating = token && !user;
  const isAdmin = token && user && user.user_role === 'admin';

  const activeTab = TABS.find((tab) => tab.name === currentTab) ?? TABS[0];

  const renderGroups = (groups: Array<PanelGroup>) => {
    return groups.map((group) => (
      <div className='admin-panel-nav-group' key={group.name}>
        <span className='admin-panel-nav-group-label'>
          {t(`panel.groups.${group.name}`)}
        </span>
        {group.tabs.map((tab) => (
          <button
            type='button'
            key={tab.name}
            className={tab.name === activeTab.name ? 'active' : ''}
            onClick={() => {
              setCurrentTab(tab.name);
              setIsMenuOpen(false);
            }}
          >
            <i className={`fa-solid ${tab.icon}`}></i>
            <span>{t(`panel.tabs.${tab.name}`)}</span>
          </button>
        ))}
      </div>
    ));
  };

  if (isAuthenticating) {
    return (
      <div
        className='admin-panel-loading'
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '300px',
          gap: 'var(--space-4)',
        }}
      >
        <div className='loading-spinner'></div>
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
      <div className='admin-panel-layout'>
        <nav
          ref={navRef}
          className={`admin-panel-nav${isMenuOpen ? ' open' : ''}`}
        >
          <button
            type='button'
            className='admin-panel-nav-toggle'
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <i className={`fa-solid ${activeTab.icon}`}></i>
            <span>{t(`panel.tabs.${activeTab.name}`)}</span>
            <i className='fa-solid fa-chevron-down admin-panel-nav-chevron'></i>
          </button>
          <div id='admin-panel-nav-menu' className='admin-panel-nav-menu'>
            {renderGroups(GROUPS)}
          </div>
        </nav>
        <div className='admin-panel-content'>{activeTab.component}</div>
      </div>
    </div>
  );
}
