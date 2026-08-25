import { type JSX, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  type AppDispatch,
  type RootState,
  type InquiryProps,
  getInquiries,
  // getInquiry,
  // updateInquiry,
  deleteInquiry,
} from '../../../store';

export default function PanelInquiries(): JSX.Element {
  const { t } = useTranslation('admin');
  const HEADERS = [
    'ID',
    t('panel.table.date'),
    t('panel.table.subject'),
    t('panel.table.description'),
    t('panel.table.name'),
    'Telegram',
    'WhatsApp',
    'Viber',
    t('panel.table.actions'),
  ];

  const dispatch = useDispatch<AppDispatch>();
  const { data } = useSelector((state: RootState) => state.admin.inquiries);
  const { lang } = useParams();
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    dispatch(getInquiries());
  }, [lang]);

  const handleDelete = (inquiryId: number) => {
    const del = confirm(t('alerts.inquiry.confirmDelete', { id: inquiryId }));
    if (del) {
      dispatch(deleteInquiry(inquiryId));
      alert(t('alerts.inquiry.deleted', { id: inquiryId }));
    } else return;
  };

  const renderHeaders = (headers: Array<string>) => {
    return headers.map((header, idx) => {
      return <th key={idx}>{header}</th>;
    });
  };

  const renderRows = (items: Array<InquiryProps>) => {
    return items.map(
      ({
        id,
        name,
        subject,
        description,
        created_at,
        telegram,
        viber,
        whatsapp,
      }) => {
        return (
          <tr
            key={id}
            className='clickable-row'
            onClick={() => setSearchParams({ inquiry: String(id) })}
          >
            <td className='cell-id'>#{id}</td>
            <td>{new Date(created_at).toLocaleDateString()}</td>
            <td>{subject}</td>
            <td>
              {description && description.length > 20
                ? `${description.substring(0, 20)}...`
                : description}
            </td>
            <td>{name}</td>
            <td>
              {telegram ? (
                <span className='contact-method-badge telegram'>
                  <i className='fab fa-telegram-plane'></i> Yes
                </span>
              ) : (
                <span className='contact-method-badge empty'>-</span>
              )}
            </td>
            <td>
              {whatsapp ? (
                <span className='contact-method-badge whatsapp'>
                  <i className='fab fa-whatsapp'></i> Yes
                </span>
              ) : (
                <span className='contact-method-badge empty'>-</span>
              )}
            </td>
            <td>
              {viber ? (
                <span className='contact-method-badge viber'>
                  <i className='fab fa-viber'></i> Yes
                </span>
              ) : (
                <span className='contact-method-badge empty'>-</span>
              )}
            </td>
            <td className='actions'>
              <i
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchParams({ editInquiry: String(id) });
                }}
                className='fa-regular fa-pen-to-square'
              ></i>
              <i
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(id);
                }}
                className='fa-solid fa-trash-can'
              ></i>
            </td>
          </tr>
        );
      },
    );
  };

  return (
    <div className='admin-panel-table-container'>
      <div className='admin-panel-table-container-header'>
        <h2>{t('panel.tabs.inquiries')}</h2>
      </div>
      <p className='admin-panel-scroll-hint'>
        <i className='fa-solid fa-arrow-right-arrow-left'></i>{' '}
        {t('panel.scrollHint')}
      </p>
      <div className='admin-panel-table-wrapper'>
        <table className='admin-panel-table'>
          <thead>
            <tr>{renderHeaders(HEADERS)}</tr>
          </thead>
          <tbody>{renderRows(data)}</tbody>
        </table>
      </div>
    </div>
  );
}
