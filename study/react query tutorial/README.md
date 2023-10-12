# React tutorials on the channel
- React Fundamentals and Advanced Topics
- React Hooks
- React Redux
- React Formik
- React Storybook
- React Render
- Practical React
- React Table
- React TypeScript

## React Query? 
### What? 
React 애플리케이션에서 데이터를 가져오기 위한 라이브러리

### Why? 
1. React는 UI 라이브러리이므로 데이터 가져오기에 대한 특정 패턴이 없습니다.
2. 데이터 가져오기를 위한 useEffect 후크 및 로드, 오류 또는 결과 데이터와 같은 구성 요소 상태를 유지하기 위한 useState 후크
3. 앱 전체에서 데이터가 필요한 경우 상태 관리 라이브러리를 사용하는 경향이 있습니다.
4. 대부분의 상태 관리 라이브러리는 클라이언트 상태 작업에 적합합니다. 예: 애플리케이션의 '테마' / 모달이 열려 있는지 여부
5. 상태 관리 라이브러리는 비동기식 또는 서버 상태 작업에 적합하지 않습니다.

## Client vs Server State
### Client state
앱 메모리에 유지되며 액세스 또는 업데이트는 동기식입니다.
### Server state 
원격으로 유지되며 가져오기 또는 업데이트를 위해 비동기 API가 필요합니다.

공유 소유권이 있음

귀하가 모르는 사이에 다른 사람이 데이터를 업데이트할 수 있습니다.

Ul 데이터가 원격 데이터와 동기화되지 않을 수 있습니다.

캐싱, 동일한 데이터에 대한 여러 요청의 중복 제거, 백그라운드 성능 최적화에서 상태 데이터 업데이트 등을 처리해야 하는 경우 어려움

## Course Content
- Basic queries
- Poll data
- RQ dev tools 
- Create reusable query hooks 
- Query by ID
- Parallel queries
- Dynamic queries
- Dependent queries 
- Infinite & paginated queries 
- Update data using mutations 
- Invalidate queries 
- Optimistic updates
- Axios Interceptor

## Project Setup 
- CRA(Create React App)를 사용한 새로운 반응 프로젝트
- 애플리케이션에서 사용할 모의 데이터를 제공하는 API 엔드포인트 설정
- 애플리케이션에서 반응 라우터와 몇 가지 경로를 설정합니다.
- useEffect 및 useState를 사용하여 전통적인 방식으로 데이터를 가져옵니다.

### React Query 사용 전 
```js
import { useState, useEffect } from "react";
import axios from "axios";

export const SuperHeroesPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:4000/superheroes")
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <>
      <h2>Super Heroes Page</h2>
      {data.map((hero) => {
        return <div key={hero.name}>{hero.name}</div>;
      })}
    </>
  );
};


```

<br>

### React Query 사용 후 
```js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchSuperHeroes = () => {
  return axios.get("http://localhost:4000/superheroes");
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

```