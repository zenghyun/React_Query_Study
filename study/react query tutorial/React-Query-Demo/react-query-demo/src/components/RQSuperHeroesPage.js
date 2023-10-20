import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchSuperHeroes = async () => {
  return await axios.get("http://localhost:4000/superheroes");
};
export const RQSuperHeroesPage = () => {
  const {
    fetchStatus,
    status,
    isLoading,
    data,
    isError,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["super-heroes"],
    queryFn: fetchSuperHeroes,
    // staleTime: 3000,
    // refetchOnMount: true, // 데이터 상태에 따라 결정
    // refetchOnWindowFocus: true, // 즉시 업데이트 기능
    // refetchInterval: false, // false가 기본값 2000이면 쿼리가 2초마다 다시 가져옴
    // refetchIntervalInBackground: false, // 브라우저에 focus되어 있지 않아도 refetch를 시켜주는 것을 의미한다.
    enabled: false,
    // select(data) { // select 옵션을 사용하면 반환된 데이터의 일부를 변환하거나 선택할 수 있다.
    //   const superHeroNames = data.data.map((hero) => hero.name);
    //   return superHeroNames
    // }
  });
  console.log({ isLoading, isFetching });
  console.log("fetchStatus:", fetchStatus, "status:", status);

  const handleClickRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

 /**
  * isLoading && isFetching 해야하는 이유 
   https://despiteallthat.tistory.com/307  
  * 
  */
  if (isLoading && isFetching) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h2>{error.message}</h2>;
  }

  return (
    <>
      <h2>RQ Super Heroes Page</h2>
      <button onClick={handleClickRefetch}>Fetch Heroes</button>
      <ul>
        {data?.data.map((hero) => {
          return <li key={hero.name}>{hero.name}</li>;
        })}
      </ul>
    </>
  );
};
