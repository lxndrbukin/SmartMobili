import { type JSX } from 'react';

export default function HeaderSearch(): JSX.Element {
  return (
    <form className='header-search'>
      <input placeholder='Search...' />
      <button>
        <i className='fa-solid fa-magnifying-glass'></i>
      </button>
    </form>
  );
}
