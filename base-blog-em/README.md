# Blog-em Ipsum

### A React App for the Udemy course "React Query: Server State Management for React"

## Installation

Run `npm install`

## Running the App

Run `npm start`. The app will be found at [http://localhost:3000]

## Server

This app uses the [JSON Placeholder](https://jsonplaceholder.typicode.com/) server.


## Blog-em Ipsum Summary
- 패키지 설치, QueryClient 생성 및 QueryProvider 추가
- 데이터 쿼리 사용
  - 반환 객체에는 isLoading / isFetching 및 오류도 포함됩니다.
- 다시 가져올지 여부에 대한 staleTime(트리거 시)
- 비활성 후 데이터를 보관하는 기간에 대한 캐시타임
- 종속성 배열로서의 쿼리 키
- 페이지 매김 및 프리페칭
- 서버 부작용에 대한 useMutation