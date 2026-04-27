import { type JSX, type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLocalePath from '../../hooks/useLocalePath';

export default function HeaderSearch(): JSX.Element {
  const navigate = useNavigate();
  const to = useLocalePath();
  const [query, setQuery] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.length) {
      navigate(`${to('/catalog')}?search=${encodeURIComponent(query)}`);
    }
    setQuery('');
  };

  return (
    <form onSubmit={handleSubmit} className='header-search'>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder='Search...'
      />
      <button>
        <i className='fa-solid fa-magnifying-glass'></i>
      </button>
    </form>
  );
}
