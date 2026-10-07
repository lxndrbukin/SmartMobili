import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { type RootState } from '../../../store';
import axios from 'axios';
import { API_URL } from '../../../api';
import type { WeekViewsEntry, CountryEntry, PageEntry } from './types';

export default function MyDashboard() {
  const { t } = useTranslation('admin');
  const { currentLang } = useSelector((state: RootState) => state.system);
  const [weekViewsData, setWeekViewsData] = useState<WeekViewsEntry[]>([]);
  const [countryData, setCountryData] = useState<CountryEntry[]>([]);
  const [pageData, setPageData] = useState<PageEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWeek, setIsWeek] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const weekViewsData = await axios.get(
          `${API_URL}/api/v1/analytics/views_for_week?days=${isWeek ? 6 : 13}`,
        );
        const pageData = await axios.get(
          `${API_URL}/api/v1/analytics/views_per_page?days=${isWeek ? 7 : 14}`,
        );
        const countryData = await axios.get(
          `${API_URL}/api/v1/analytics/views_per_country?days=${isWeek ? 7 : 14}`,
        );
        setCountryData(countryData.data.data);
        setPageData(pageData.data.data);
        setWeekViewsData(weekViewsData.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isWeek]);

  if (isLoading) {
    return (
      <div className='analytics-loading'>
        <div className='loading-spinner'></div>
        <span>{t('analytics.loading')}</span>
      </div>
    );
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(currentLang, {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatNumber = (value: number) => value.toLocaleString(currentLang);

  const formatVisitors = (count: number) =>
    t('analytics.visitorsCount', { count, value: formatNumber(count) });
  const formatPageviews = (count: number) =>
    t('analytics.pageviewsCount', { count, value: formatNumber(count) });

  const getNiceMax = (value: number) => {
    if (value <= 1) return 1;
    const magnitude = 10 ** Math.floor(Math.log10(value));
    const step = [1, 2, 5, 10].find((n) => n * magnitude >= value) ?? 10;
    return step * magnitude;
  };

  const renderEmpty = () => (
    <p className='analytics-empty'>{t('analytics.empty')}</p>
  );

  const renderStats = (data: WeekViewsEntry[]) => {
    const totalVisitors = data.reduce(
      (total, item) => total + item.visitors,
      0,
    );
    const totalPageviews = data.reduce(
      (total, item) => total + item.pageviews,
      0,
    );
    return (
      <div className='analytics-stats'>
        <div className='analytics-stat'>
          <span className='analytics-stat-label'>
            {t('analytics.visitors')}
          </span>
          <span className='analytics-stat-value'>
            {formatNumber(totalVisitors)}
          </span>
          <span className='analytics-stat-meta'>
            {isWeek ? t('analytics.lastWeek') : t('analytics.last14days')}
          </span>
        </div>
        <div className='analytics-stat'>
          <span className='analytics-stat-label'>
            {t('analytics.pageviews')}
          </span>
          <span className='analytics-stat-value'>
            {formatNumber(totalPageviews)}
          </span>
          <span className='analytics-stat-meta'>
            {isWeek ? t('analytics.lastWeek') : t('analytics.last14days')}
          </span>
        </div>
      </div>
    );
  };

  const renderWeekViews = (data: WeekViewsEntry[]) => {
    const peakVisitors = Math.max(...data.map((item) => item.visitors), 0);
    const scaleMax = getNiceMax(peakVisitors);
    const ticks = [0, scaleMax / 2, scaleMax].filter((tick) =>
      Number.isInteger(tick),
    );
    const peakIndex = data.findIndex((item) => item.visitors === peakVisitors);

    return (
      <section className='analytics-card analytics-card--wide'>
        <header className='analytics-card-header'>
          <h3>
            {isWeek ? t('analytics.weeklyVisits') : t('analytics.14daysVisits')}
          </h3>
          <span className='analytics-card-subtitle'>
            {t('analytics.weeklyVisitsSubtitle')}
          </span>
        </header>
        {data.length === 0 ? (
          renderEmpty()
        ) : (
          <div className='analytics-chart'>
            <div className='analytics-chart-plot'>
              {ticks.map((tick) => (
                <div
                  key={tick}
                  className='analytics-chart-gridline'
                  style={{ bottom: `${(tick / scaleMax) * 100}%` }}
                >
                  <span>{formatNumber(tick)}</span>
                </div>
              ))}
              <div className='analytics-chart-bars'>
                {data.map((item, idx) => (
                  <div
                    key={item.timestamp}
                    className='analytics-chart-column'
                    tabIndex={0}
                  >
                    <div
                      className='analytics-chart-bar'
                      style={{ height: `${(item.visitors / scaleMax) * 100}%` }}
                    >
                      {idx === peakIndex && peakVisitors > 0 && (
                        <span className='analytics-chart-value'>
                          {formatNumber(item.visitors)}
                        </span>
                      )}
                      <div className='analytics-chart-tooltip'>
                        <strong>{formatDate(item.timestamp)}</strong>
                        <span>{formatVisitors(item.visitors)}</span>
                        <span>{formatPageviews(item.pageviews)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className='analytics-chart-axis'>
              {data.map((item) => (
                <span key={item.timestamp}>{formatDate(item.timestamp)}</span>
              ))}
            </div>
          </div>
        )}
      </section>
    );
  };

  const renderBreakdown = <T extends { visitors: number; pageviews: number }>(
    title: string,
    labelHeader: string,
    data: T[],
    getLabel: (item: T) => string,
  ) => {
    const regionNames = new Intl.DisplayNames([currentLang], {
      type: 'region',
    });
    const maxVisitors = Math.max(...data.map((item) => item.visitors), 1);
    return (
      <section className='analytics-card'>
        <header className='analytics-card-header'>
          <h3>{title}</h3>
        </header>
        {data.length === 0 ? (
          renderEmpty()
        ) : (
          <div className='analytics-table-wrapper'>
            <table className='analytics-table'>
              <thead>
                <tr>
                  <th>{labelHeader}</th>
                  <th className='analytics-table-num'>
                    {t('analytics.visitors')}
                  </th>
                  <th className='analytics-table-num'>
                    {t('analytics.pageviews')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => {
                  const label = getLabel(item);
                  return (
                    <tr key={label}>
                      <td className='analytics-table-label'>
                        <span className='analytics-table-name' title={label}>
                          {label.length == 2 ? regionNames.of(label) : label}
                        </span>
                        <span className='analytics-table-share'>
                          <span
                            style={{
                              width: `${(item.visitors / maxVisitors) * 100}%`,
                            }}
                          ></span>
                        </span>
                      </td>
                      <td className='analytics-table-num'>
                        {formatNumber(item.visitors)}
                      </td>
                      <td className='analytics-table-num'>
                        {formatNumber(item.pageviews)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    );
  };

  return (
    <div className='admin-panel-table-container'>
      <div className='admin-panel-table-container-header'>
        <h2>{t('panel.tabs.analytics')}</h2>
      </div>
      <div className='admin-panel-table-container-header'>
        <button onClick={() => setIsWeek(!isWeek)}>
          {isWeek ? t('analytics.lastWeek') : t('analytics.last14days')}
        </button>
      </div>
      <div className='panel-analytics'>
        {renderStats(weekViewsData)}
        {renderWeekViews(weekViewsData)}
        {renderBreakdown(
          t('analytics.byCountry'),
          t('analytics.country'),
          countryData,
          (item) => item.country,
        )}
        {renderBreakdown(
          t('analytics.byPage'),
          t('analytics.page'),
          pageData,
          (item) => item.requestPath,
        )}
      </div>
    </div>
  );
}
