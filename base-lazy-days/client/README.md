# Lazy Days Spa Client

### A React client for the "Lazy Days Spa" app in the Udemy course "React Query: Server State Management for React"

## Installing

Run `npm install`

## Starting the client

Run `npm start`. The app will be found at [http://localhost:3000]. You will probably want to make sure the server is running as well.


## React Query in Larget App
- 중앙 집중화 표시 표시/오류 처리
- 데이터 다시 가져오기
- 인증과 통합
- 종속 쿼리
- 테스트
- useQuery, mutation, pagination, prefetching의 추가 예시

### Custom Hooks 
- 대규모 앱에서는 각 데이터 유형에 대한 사용자 지정 후크를 만듭니다.
  - 여러 구성 요소에서 액세스할 수 있습니다.
  - 키를 혼동할 위험이 없습니다.
  - 사용자 정의 후크에 캡슐화된 쿼리 기능
  - 나중에 디스플레이에서 구현을 추상화합니다.
    - 구현을 변경하는 경우 후크 업데이트
    - 구성 요소를 업데이트할 필요가 없습니다.
  - reference: <b>https://react-query.tanstack.com/examples/custom-hooks</b>

### useIsFetching 
- 작은 앱의 경우
  - useQuery 반환 개체에서 isFetching을 사용했습니다.
  - 알림: isLoading은 isFetching이며 캐시된 데이터가 없습니다.

- 더 큰 앱에서
  - 쿼리가 가져오는 중일 때마다 스피너 로드
  - useIsFetching이 이를 알려줍니다!

- 모든 사용자 정의 후크/useQuery 호출에서 isFetching이 필요하지 않습니다.

### Passing errors to toasts
- useQuery 오류를 Chakra UI "toast"에 전달
  - 먼저 single call에 사용하고 그 다음에는 중앙 집중식으로 처리합니다.
- useQuery에 대한 onError 콜백
  - isError를 구조 분해하는 대신 useQuery 반환에서 오류가 발생합니다.
  - 쿼리 함수에서 오류가 발생하면 실행됩니다.
  - 콜백에 대한 오류 매개변수
- 토스트를 사용합니다.
  - 차크라 UI에는 편리한 토스트 후크가 함께 제공됩니다.

### QueryClient default onError option
- useIsFetching에 대한 useError 비유 없음
  - 정수 이상이 필요합니다. 구현 방법이 불분명함
- 대신 QueryClient에 대한 기본 onError 핸들러를 설정하세요.
  - QueryClient의 기본값
  ```
   defaultOptions: {
        queries: { useQuery options },

        mutations : { useMutation options }
    }
  ```

### Alternative to onError : Error Boundary
- 대안: React Error Boundary로 오류 처리
  - https://reactjs.org/docs/error-boundaries.html
- useQuery에 대한 useErrorBoundary
  - 참조: https//react-query.tanstack.com/reference/useQuery
- useQuery / useMutation 옵션
  - 또는 QueryClient를 생성할 때 defaultOptions에서
- 오류를 가장 가까운 오류 경계로 전파하려면 true로 설정합니다.

### Section Summary
- QueryClient용 파일 생성
  - 코드를 별도로 유지
- 사용자 정의 후크는 코드를 모듈식으로 유지합니다.
- 로딩 구성 요소를 중앙 집중화
  - useIsFetching
- 오류 처리를 중앙 집중화
  - 기본 onError 콜백

## Prefetch and Pagination 

### Options for pre-populating data 


| | 어디에 사용하나요? |데이터는?| 캐시에 추가되었나요?|
| --------------------| --------------------|--------------------| --------------------|
| <p align="center">prefetchQuery</p> | <p align="center">method to queryClient</p> |<p align="center">server</p> |<p align="center">yes</p> |
| <p align="center">setQueryData</p> | <p align="center">method to queryClient</p> |<p align="center">client</p> |<p align="center">yes</p> |
| <p align="center">placeholderData</p> | <p align="center">option to useQuery</p> |<p align="center">client</p> |<p align="center">no</p> |
| <p align="center">initialData</p> | <p align="center">option to useQuery</p> |<p align="center">client</p> |<p align="center">yes</p> |


### Prefetch Treatments 
- saw prefetch with pagination
  - 다음 페이지 미리 가져오기
- 다른 트리거: 홈페이지 로드 시 프리패치 처리
  - 연구 사용: 홈페이지 로드의 85%가 treatments 탭 로드로 이어집니다.
  - treatments이 자주 바뀌지 않으므로 캐시된 데이터는 별 문제가 되지 않습니다.
- 캐시타임 이후에 useQuery가 호출되지 않으면 가비지 수집됨
  - 일반적으로 기본 캐시 시간에 의해 로드되지 않는 경우
    (5분), 더 긴 캐시 시간을 지정합니다.
- prefetchQuery는 queryClient의 메소드입니다.
  - 클라이언트 캐시에 추가
- useQueryClient는 queryClient를 반환합니다(공급자 내에서).
- useTreatments.ts 내에서 usePrefetchTreatments 후크를 만듭니다.
  - useTreatments 호출과 동일한 쿼리 함수 및 키를 사용합니다.
  - 홈 구성 요소에서 usePrefetchTreatments를 호출합니다.

## Why doesn't new data load? 
- 모든 쿼리에 동일한 키 사용
- 새 달을 로드하려면 화살표를 클릭한 후
  - 데이터가 오래되었지만(staleTime = 0)...
  - 다시 가져오기를 트리거할 항목이 없습니다.
    - 구성 요소 다시 마운트
    - 창 재초점
    - 다시 가져오기 기능을 수동으로 실행
    - 자동 다시 가져오기
  - 위의 이유로 알려진 키에 대해서만 새 데이터를 가져옵니다.
  - 해결책? 매달 새로운 키
    - 키를 종속성 배열로 처리합니다.

### **새 쿼리를 만들고 새 데이터를 가져오기 위해, 데이터가 변경되면 키도 변경되어야 한다.**


### Code Quiz! Pre-fetch for appointments pagination 
- 복잡해요! 움직이는 부품이 너무 많아서
- 다음 달 프리페치 구현
  - 쿼리 클라이언트의 방법을 사용합니다.
  - React Query Hook을 사용하여 쿼리 클라이언트 가져오기
- useEffect에서 프리페치 구현
  - MonthYear(및 queryClient)에 대한 종속성
  - updateMonthYear에 프리페치를 넣는 것보다 낫습니다.
    - 상태의 비동기 업데이트로 인한 경쟁 조건
  - 프리페치 인수에 주의하세요.
    - 쿼리 키
    - getAppointments에 대한 인수
    - const nextMonthYear = getNewMonthYear(monthYear, 1)

## Summary
- 데이터 옵션 미리 채우기:
  - 프리페치, setQueryData, placeholderData,initialData
- 캐시를 미리 채우는 프리패치
  - 컴포넌트 렌더링 시
  - 페이지(월/연도) 업데이트
  - keepPreviousData는 배경이 변경되지 않는 경우에만 유용합니다.
- 키를 종속성 배열로 처리