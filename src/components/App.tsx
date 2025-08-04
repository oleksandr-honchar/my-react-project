import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import SearchForm from './SearchForm';
import ArticleList from './ArticleList';
import css from './App.module.css';
import { fetchArticles } from '../services/articleService';
import type { ArticlesHttpResponse } from '../services/articleService';

export default function App() {
  const [topic, setTopic] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, isSuccess } = useQuery<ArticlesHttpResponse>({
    queryKey: ['articles', topic, currentPage],
    queryFn: () => fetchArticles(topic, currentPage),
    enabled: topic !== '',
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.nbPages ?? 0;

  const handleSearch = (newTopic: string) => {
    setTopic(newTopic);
    setCurrentPage(1);
  };

  return (
    <>
      <SearchForm onSubmit={handleSearch} />
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={2}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          breakLabel="..."
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {isLoading && <p>Loading data, please wait...</p>}
      {isError && <p>Whoops, something went wrong! Please try again!</p>}
      {data?.hits && <ArticleList items={data.hits} />}
    </>
  );
}
