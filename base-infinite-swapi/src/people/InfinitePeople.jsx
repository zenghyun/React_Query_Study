import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Person } from "./Person";

const initialUrl = "https://swapi.dev/api/people/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfinitePeople() {
  const { data, fetchNextPage, hasNextPage, isLoading, isFetching, isError, error } =
    useInfiniteQuery(
      ["sw-people"],
       ({ pageParam = initialUrl }) => fetchUrl(pageParam),
      {
        // getNextPageParam : 다음 페이지로 가는 방식을 정의하는 함수 
        // getNextPageParam : (lastPage, allPages) 
        // 다음 페이지의 URL이 무엇인지 알려준다.
        getNextPageParam: (lastPage) => lastPage.next || undefined,
        /**
          - next query is returned as part of the data 
          {
            "count" : 37, 
            "next": "http://swapi.dev/api/species/?page=2",
            "previous": null,
            "results": [...]
          }
         */
      }
    );

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }
  if (isError) {
    return <div>Error! {error.toString()}</div>;
  }

  return (
    <>
    {isFetching && <div className="loading">Loading...</div> }
    <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
      {data.pages.map((pageData) => {
        return pageData.results.map((person) => {
          return (
            <Person
              key={person.name}
              name={person.name}
              hairColor={person.hair_color}
              eyeColor={person.eye_color}
            />
          );
        });
      })}
    </InfiniteScroll>
    </>
  );
}
