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
    t('panel.table.name'),
    t('panel.table.subject'),
    t('panel.table.description'),
    t('panel.table.date'),
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
    const del = confirm(`Do you want to delete inquiry ${inquiryId}?`);
    if (del) {
      dispatch(deleteInquiry(inquiryId));
      alert(`Inquiry ${inquiryId} deleted`);
    } else return;
  };

  const renderHeaders = (headers: Array<string>) => {
    return headers.map((header) => {
      return <th>{header}</th>;
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
          <tr>
            <td>{id}</td>
            <td>{name}</td>
            <td>{subject}</td>
            <td>{description}</td>
            <td>{new Date(created_at).toLocaleDateString()}</td>
            <td>
              <input type='checkbox' checked={telegram} />
            </td>
            <td>
              <input type='checkbox' checked={viber} />
            </td>
            <td>
              <input type='checkbox' checked={whatsapp} />
            </td>
            <td className='actions'>
              <i
                onClick={() => setSearchParams({ editInquiry: String(id) })}
                className='fa-regular fa-pen-to-square'
              ></i>
              <i
                onClick={() => handleDelete(id)}
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
      <table className='admin-panel-table'>
        <thead>
          <tr>{renderHeaders(HEADERS)}</tr>
        </thead>
        <tbody>{renderRows(data)}</tbody>
      </table>
    </div>
  );
}
