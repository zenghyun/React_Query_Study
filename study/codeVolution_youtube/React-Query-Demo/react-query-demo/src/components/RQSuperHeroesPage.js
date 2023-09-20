import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchSuperHeroes = async () => {
  return await axios.get("http://localhost:4000/superheroes");
};

export const RQSuperHeroesPage = () => {
  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["super-heroes"],
    queryFn: fetchSuperHeroes,
  });

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h2>{error.message}</h2>;
  }

  return (
    <>
      <h2>RQ Super Heroes Page</h2>
      <ul>
        {data?.data.map((hero) => {
          return <li key={hero.name}>{hero.name}</li>;
        })}
      </ul>
    </>
  );
};
