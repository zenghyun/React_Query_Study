# React Query

## ReactQueryDevtools
devtools는 기본값으로 `process.env.NODE_ENV === 'development`인 경우에만 실행된다. 즉, 일반적으로 개발환경에서만 작동하도록 설정되어있으므로, 프로젝트 배포 시에 Devtools 삽입코드를 제거해줄 필요가 없다. 

### options 
- initialIsOpen (Boolean)
  - `true`이면 개발 도구가 기본적으로 열려 있도록 설정 
- position?: `"top-left" | "top-right" | "bottom-left" | "bottom-right"`
  - 기본값": `bottom-left` 
  - devtools 패널을 열고 닫기 위한 로고 위치 
- 일반적으로 initialIsOpen, position을 자주 사용하지만, panelProps, closeButtonProps, toggleButtonProps와 같은 옵션들도 존재한다. 


### package 설치
#### v4 
- v4부터는 devtools를 위한 별도의 패키지 설치 필요 
```
$ npm i @tanstack/react-query-devtools 
or 
$ yarn add @tanstack/react-query-devtools
```  
    
## 캐싱 라이프 사이클 
### React Query의 캐시 라이프 사이클 
```
* Query Instances with and without cache data (캐시 데이터가 있거나 없는 쿼리 인스턴스)
* Background Refetching (백그라운드 리패칭)
* Inactive Queries (비활성 쿼리)
* Garbage Collection (가비지 컬렉션)
```
### cacheTime의 기본값 `5분`, staleTime의 기본값 `0초`를 가정 

1. `A`라는 queryKey를 가진 A 쿼리 인스턴스가 `mount`됨
2. 네트워크에서 데이터 fetch하고, 불러온 데이터는 A라는 queryKey로 `캐싱`함
3. 이 데이터는 `fresh` 상태에서 `staleTime(기본값 0)` 이후 `stale` 상태로 변경됨
4. A 쿼리 인스턴스가 `unmount`됨
5. 캐시는 `cacheTime(기본값 5min)` 만큼 유지되다가 `가비지 콜렉터(GC)`로 수집됨 
6. 만일, cacheTime이 지나기 전에 A 쿼리 인스턴스를 fresh한 상태라면 새롭게 mount 되었을 때 캐시 데이터를 보여줌  

## useQuery 
### useQuery의 기본 문법 
```js
// 사용법(1) 
const { data, isLoading, ... } = useQuery(queryKey, queryFn, {
    // ...options ex) enabled, staleTime ... 
});

// 사용법(2)
const result = useQuery({
    queryKey,
    queryFnm
    // ... options ex) enabled, staleTime, ... 
});

result.data
result.isLoading
// ...
```
```js
// 실제 예제 
const getAllSuperHero = async () => {
    return await axios.get("http://localhost:4000/superheroes");
};
const { data, isLoading } = useQuery(["super-heroes"], getAllSuperHero);
```
#### useQuery는 기본적으로 3개의 인자를 받는다. 첫 번째 인자가 `queryKey(필수)`, 두 번째 인자가 `queryFn(필수)`, 세 번째 인자가 `options(optional)`이다.

#### 1. queryKey 
```ts
// 1 
const getSuperHero = async ({queryKey} : any) => {
    const heroId = queryKey[1]; // queryKey: ['super-hero', '3']
    return await axios.get(`http://localhost:4000/superheroes/${heroId}`);
};

const useSuperHeroData = (heroId: string) => {
    // 해당 쿼리는 heroId에 의존 
    return useQuery({
        queryKey: ["super-hero", heroId], 
        queryFn: getSuperHero});
};
```
- v3까지는 queryKey로 문자열 또는 배열 모두 지정할 수 있었는데, v4 부터는 무조건 `배열`로 지정해야 한다.
- useQuery는 첫 번째 인자인 `queryKey`를 기반으로 `데이터 캐싱`을 관리한다.
  - 만약, 쿼리가 특정 변수에 의존한다면 배열에다 이어서 넣어주면 된다. `ex: ["super-hero", heroId ...]`
  - 이는 굉장히 중요하다. 예를 들어, `queryClient.setQueryData`등과 같이 특정 쿼리에 접근이 필요할 때, `초기에 설정해둔 포맷`을 지켜줘야 제대로 쿼리에 접근할 수 있다. 
  - 아래 options 예제를 살펴보면 useSuperHeroData의 queryKey는 `["super-hero", heroId]`이다. 그렇다면 queryClient.setQueryData를 이용할 때 똑같이 `["super-hero", heroId]` 포맷을 가져야 한다. 안그러면 원하는 쿼리에 제대로 접근할 수 없다.

#### 2. queryFn 
```ts
// 2 
const getSuperHero = async (heroId: string) => {
    return await axios.get(`http://localhost:4000/superheroes/${heroId}`);
}; 

const useSuperHeroData = (heroId: string) => {
    return useQuery({
        queryKey: ["super-heroes", heroId],
        queryFn: () => getSuperHero(heroId);
    })
}
```
  - useQuery의 두 번째 인자인 queryFn은 `Promise`를 반환하는 함수를 넣어야 한다. 
  - 참고로, queryKey의 예제와 queryFn의 예제에는 차이점이 있다. 
    - `queryKey` 예제는 2번째 queryFn에 `getSuperHero` 함수를 바로 넘겨주고, `getSuperHero`에서 매개변수로 객체를 받아와 해당 객체의 queryKey를 활용하고 있다.
    - `queryFn` 예제는 2번째 queryFn에 화살표 함수를 사용하고, getSuperHero의 인자로 heroId를 넘겨주고 있다.
    - 해당 두 가지 방법은 모두 알아야하고, 결과는 동일하다! 

#### 3. options 
- useQuery의 세 번째 인자인 options에 많이 쓰이는 옵션들은 아래 내용에서 설명할 예정이다. 문서 외에 더 많은 옵션들을 알고싶다면 [useQuery 공식문서](https://tanstack.com/query/v4/docs/react/reference/useQuery)를 통해 확인해보자. 

```ts
// 예시
const useSuperHeroData = (heroId: string) => {
    return useQuery({
        queryKey: ["super-heroes", heroId],
        queryFn: () => getSuperHero(heroId),
        cacheTime: 5 * 60 * 1000, // 5분 
        staleTime: 1 * 60 * 1000, // 1분
        retry: 1, 
        // ... options
    })
}
```

### useQuery 주요 리턴 데이터
```js
const { status, isLoading, isError, error, data, isFetching, ... } = useQuery({
    queryKey: ["colors", pageNum], 
    queryFn: () => fetchColors(pageNum)
});
```
- status: 쿼리 요청 함수의 상태를 표현하는 status는 4가지 값이 존재한다. (문자열 형태)
  - idle: 쿼리 데이터가 없고 비었을 때, `{enabled: false}` 상태로 쿼리가 호출되면 이 상태로 시작한다.
  - loading: 아직 캐시된 데이터가 없고 로딩중일 때 상태이다.
  - error: 요청 에러 발생했을 때의 상태이다. 
  - success: 요청 성공했을 때 상태이다. 
- data: 쿼리 함수가 리턴한 Promise에서 `resolved`된 데이터 
- isLoading: `캐싱된 데이터가 없을 때` 즉, 처음 실행된 쿼리일 때 로딩 여부에 따라 `true/false`로 반환된다.
  - 이는 캐싱된 데이터가 있다면 로딩 여부에 상관없이 `false`를 반환한다.
- isFetching: `캐싱된 데이터가 있더라도` 쿼리가 실행되면 로딩 여부에 따라 `true/false`로 반환된다.
  - 이는 캐싱된 데이터가 있더라도 쿼리 로딩 여부에 따라 `true/false`를 반환한다.
- error: 쿼리 함수에 오류가 발생한 경우, 쿼리에 대한 오류 객체를 나타낸다.
- isError: 에러가 발생한 경우 `true`
- 그외 등등  [useQuery 공식문서](https://tanstack.com/query/v4/docs/react/reference/useQuery)를 통해 확인해보자. 

#### 📌 v4부터는 status의 idle 상태값이 제거되고 fetchStatus가 추가됨 
- TanStack Query(v4)부터는 status의 idle의 제거되고, 새로운 상태값인 fetchStatus가 추가됐다.
- fetchStatus
  - fetching: 쿼리가 현재 실행중이다.
  - paused: 쿼리를 요청했지만, 잠시 중단된 상태이다. 
  - idle: 쿼리가 현재 아무 작업도 수행하지 않은 상태이다.  

#### 📌 v4부터는 왜 status, fetchStatus 나눠서 다루는걸까? 
- fetchStatus는 HTTP 네트워크 연결 상태와 좀 더 관련된 상태 데이터이다. 
  - 예를 들어, status가 `success` 상태라면 주로 fetchStatus는 `idle` 상태이지만, 백그라운드에서 re-fetch가 발생할 때 `fetching` 상태일 수 있다. 
  - status가 보통 `loading` 상태일 때 fetchStatus는 주로 `fetching`를 갖지만, 네트워크 연결이 되어있지 않은 경우 `paused` 상태를 가질 수 있다.
- 정리하자면 아래와 같다.
  - status는 `data`가 있는지 없는지에 대한 상태를 의미한다.
  - fetchStatus는 쿼리 즉, `queryFn 요청`이 진행중인지 아닌지에 대한 상태를 의미한다. 
#### [Why two different states?](https://tanstack.com/query/v4/docs/react/guides/queries#why-two-different-states)