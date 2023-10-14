# Infinite SWAPI

### A project to demonstrate React Query useInfiniteQuery, for the Udemy course "React Query: Server State Management for React"

## Installation

#. Download this directory, or clone or fork this repo
#. `npm install --legacy-peer-deps`

**Note** The `--legacy-peer-deps` is very important since this project uses [React Infinite Scroller](https://www.npmjs.com/package/react-infinite-scroller), which doesn't (yet) support React 17.

## Running the App

Run `npm start`. The app will be found at [http://localhost:3000]

## Server

This app uses the [Star Wars API](https://swapi.dev/) server.

----

### Second Project: Infinite SWAPI 
- 무한 스크롤
  - 사용자가 스크롤할 때 "적시에" 새 데이터를 가져옵니다.
  - 모든 데이터를 한 번에 가져오는 것보다 더 효율적입니다.
- 새 데이터를 가져오는 경우...
  - 사용자가 버튼을 클릭
  - 사용자가 페이지의 특정 지점으로 스크롤합니다.

### useInfiniteQuery
- 페이지 매김과 다른 API 형식이 필요합니다.
- 그래서 새로운 프로젝트!
- 페이지 매김
  - 구성 요소 상태에서 현재 페이지를 추적합니다.
  - 새로운 쿼리 업데이트 페이지 번호
- useInfiniteQuery는 다음 쿼리를 추적합니다.
  - 다음 쿼리는 데이터의 일부로 반환됩니다.

### Shape of useInfiniteQuery Data
- useQuery와 다른 데이터 형태
- 두 가지 속성을 가진 객체:
  - 페이지
  - pageParams
- 모든 쿼리에는 페이지 배열에 자체 요소가 있습니다.
- pageParams는 검색된 쿼리의 키를 추적합니다.
  - 거의 사용되지 않습니다. 여기서는 사용하지 않습니다.

### useInfiniteQuery Syntax 
- pageParam은 queryFn에 전달되는 매개변수입니다.
- useInfiniteQuery("sw-people", ({ pageParam = defaultUrl }) => fetchUrl(pageParam))
- pageParam의 현재 값은 React Query에 의해 유지됩니다.
- UseInfiniteQuery 옵션
  - getNextPageParam: (마지막 페이지, 모든 페이지)
    - 업데이트 pageParam
    - 데이터의 모든 페이지(allPages)를 사용할 수 있습니다.
    - 우리는 데이터의 마지막 페이지만 사용합니다(특히 다음 속성).

### useInfiniteQuery Return Object Properties
- fetchNextPage
  - 사용자에게 더 많은 데이터가 필요할 때 호출하는 기능
- hasNextPage
  - getNextPageParam의 반환값 기준
  - 정의되지 않은 경우 더 이상 데이터가 없습니다.
- isFetchingNextPage
  - 로딩 스피너 표시용
  - isFetching과 isFetchingNextPage를 구별하는 것이 유용한 경우의 예를 살펴보겠습니다.

### The Flow
1. Component mounts 
2. Fetch first page 
3. getNextPageParam Update pageParam
4. hasNextPage? 
5. yes => use scrolls / clicks button fetchNextPage 
6. go 3. 
7. no => done!

### React Infinite Scroller
```
 npm install react-infinite-scroller --save 
```
- useInfiniteQuery와 정말 잘 작동합니다.
- InfiniteScroll 구성 요소에 대한 두 개의 소품을 채웁니다.
  - loadMore = {fetchNextPage}
  - hasMore = {hasNextPage}
- 구성요소는 언제 더 로드해야 하는지 감지합니다.
- Data in data.pages[x].results

### Bi-directional Scrolling
- 양방향은 중간에 시작할 때 유용합니다.
- 모든 다음 메서드와 속성은 이전 메서드와 동일합니다.

### Infinite Scroll Summary 
- React 쿼리가 관리합니다.
  - 가져올 다음 페이지에 대한 pageParam
    - getNextPageParam 옵션
    - lastPage 또는 allPages에서 올 수 있음
  - hasNextPage
    - pageParam이 정의되지 않았는지 여부를 나타내는 부울 x
  - 구성요소는 fetchNextPage 호출을 처리합니다.
    - hasNextPage 값을 사용하여 중지 시점을 결정합니다.