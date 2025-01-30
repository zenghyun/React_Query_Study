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

<br>

# Prefetch and Pagination

### Options for pre-populating data

|                                       | 어디에 사용하나요?                          | 데이터는?                    | 캐시에 추가되었나요?      |
| ------------------------------------- | ------------------------------------------- | ---------------------------- | ------------------------- |
| <p align="center">prefetchQuery</p>   | <p align="center">method to queryClient</p> | <p align="center">server</p> | <p align="center">yes</p> |
| <p align="center">setQueryData</p>    | <p align="center">method to queryClient</p> | <p align="center">client</p> | <p align="center">yes</p> |
| <p align="center">placeholderData</p> | <p align="center">option to useQuery</p>    | <p align="center">client</p> | <p align="center">no</p>  |
| <p align="center">initialData</p>     | <p align="center">option to useQuery</p>    | <p align="center">client</p> | <p align="center">yes</p> |

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

<br>

# Filtering with the select option

- 사용자가 참석할 수 없는 appointments은을 필터링할 수 있도록 허용
- 선택 옵션이 이를 수행하는 가장 좋은 방법인 이유는 무엇입니까?
  - 불필요한 계산을 줄이기 위해 React Query를 메모합니다.
  - 기술 세부사항:
    - 선택 기능의 삼중 동일 비교
    - 데이터가 변경되고 함수가 변경된 경우에만 실행됩니다.
  - 안정적인 함수가 필요합니다(익명 함수의 경우 useCallback).
  - reference: [https://tkdodo.eu/blog/react-query-data-transformations](https://tkdodo.eu/blog/react-query-data-transformations)
- 후크에 포함된 상태(예: MonthYear)
- 유틸리티의 필터 기능: getAvailableAppointments

## Code Quiz! Selector for useStaff

- 특정 치료를 위해 AllStaff 페이지의 라디오 버튼을 활성화합니다.
- useStaff에서 추적된 상태(getter/setter 반환)
- utils.js에 미리 작성된 선택기 기능: filterByTreatment
  - 익명 함수로 선택 콜백을 만들어야 합니다(필터 매개변수 필요).
  - (unfilteredStaff) => filterByTreatment(unfilteredStaff, 필터)
  - 캐싱 이점을 위해 사용 중인 콜백 래핑
- 모두 선택 시 필터 기능을 사용하지 마세요.
  - useAppointments의 경우 showAll = true와 같습니다.

## Re-fetching! Why? When?

- 다시 가져오기를 통해 오래된 데이터가 서버에서 업데이트되도록 보장
  - 페이지를 떠나서 다시 집중할 때 표시됩니다.
- 다음과 같은 경우 오래된 쿼리가 백그라운드에서 자동으로 다시 가져옵니다. ( 사용자 조치가 없더라도 데이터가 업데이트 되는 경우 )
  - 쿼리 마운트의 새 인스턴스
  - useQuery 호출이 있는 반응 구성 요소가 마운트될 때마다
  - 창의 초점이 다시 맞춰졌습니다.
  - 네트워크가 다시 연결되었습니다
  - 구성된 refetchInterval이 만료되었습니다.
    - 자동 폴링

## Re-fetching! How?

- 전역 또는 쿼리별 옵션으로 제어:
  - refetchOnMount, refetchOnWindowFocus, refetchOnReconnect, refetchInterval
  - **refetchInterval을 제외한 나머지 3개는 default value : true**
- 또는 명령적으로: useQuery 반환 객체의 refetch 함수
- reference: [https://react-query.tanstack.com/guides/important-defaults](https://react-query.tanstack.com/guides/important-defaults)

### Suppressing Re-fetch

- 어떻게?
  -stale time 증가
  - refetchOnMount / refetchOnWindowFocus / refetchOnReconnect 끄기
- 미션 크리티컬 데이터가 아닌 아주 최근에 변경된 데이터에만 해당
  - treatments 또는 staff(확실히 appointments은 아닙니다!)
- 물어보세요: 그만한 가치가 있나요?
- 이 인용문을 기억하세요. '데이터가 어떻게 항상 실시간일 수 있습니까?'라고 묻는 것이 '왜 데이터를 업데이트할 수 없나요?'보다 낫습니다.

## Update Global Settings

- 전역 기본 옵션과 개별 쿼리 옵션 비교
- 여기에서는 appointments을 제외한 모든 항목에 대한 설정을 원합니다.
  - mutation 후 사용자 프로필 및 사용자 appointments은 무효화됨
  - appointments에 특별한 설정이 적용됩니다(간격에 따른 자동 다시 가져오기 포함).
- src/react-query/queryClient.ts의 전역 옵션

## Polling / Auto Re-fetching

- appointments은 treatments와 staff의 반대입니다.
  - 사용자가 아무런 조치를 취하지 않아도 업데이트가 되기를 원함
  - appointments은은 서버에서 변경될 수 있으므로 최신 상태를 유지하고 싶습니다.
- staleTime, cacheTime, refetchOn\*에 대한 기본값을 재정의합니다.
- 쿼리를 사용하려면 refetchInterval 옵션을 사용하세요.
  - 참조: [https://react-query.tanstack.com/examples/auto-refetching](https://react-query.tanstack.com/examples/auto-refetching)
- userAppointments는 어떻습니까?
  - 기본값으로 해도 되나요?
  - 예, "from underneath us" 업데이트되지 않기 때문입니다.
  - 클라이언트는 로그인한 사용자 appointments에 변경 사항이 있는지 알 수 있습니다.
  - 서버에서 변경될 수 있는 다른 appointments은 있습니다.

## Summary

- 필터링 옵션 선택
  - 캐싱을 활용하는 안정적인 기능
- 옵션으로 다시 가져오기 억제
- 간격을 두고 폴링/다시 가져오기

<br>

# React Query and Auth

- useAuth 또는 useQuery 중 누가 사용자 데이터를 "소유"해야 합니까?
  - useAuth가 useQuery를 호출해야 할까요, 아니면 직접 axios 호출을 해야 할까요?
  - useAuth에는 데이터를 저장하는 공급자가 있어야 합니까, 아니면 React Query 캐시에 사용자 데이터를 저장해야 합니까?

## Separation of Concerns

- React Query: 클라이언트의 서버 상태에 대한 캐시 제공
- useAuth: 로그인/가입/로그아웃 기능을 제공합니다.
- 결론: React Query는 (useUser를 통해) 데이터를 저장합니다.
- useAuth는 서버 호출에서 사용자 데이터를 수집합니다(캐시에 추가).

## Role of useUser

- React Query에서 사용자 데이터를 반환합니다.
  - 초기화 시 localStorage에서 로드
- useQuery를 통해 서버에서 사용자 데이터를 최신 상태로 유지
  - 로그인한 사용자가 없는 경우 쿼리 함수는 null을 반환합니다.
- 사용자가 업데이트할 때마다(로그인/로그아웃/mutation)
  - setQueryData를 통해 React 쿼리 캐시 업데이트
  - onSuccess 콜백에서 localStorage 업데이트
    - onSuccess는 다음 이후에 실행됩니다.
      - setQueryData
      - 쿼리 기능

## Why not store user data in Auth provider? (굳이?)

- 가능하기는 합니다만,
- 단점은 복잡성이 추가됨
  - 별도의 Provider(Context) 생성/유지관리
  - React Query 캐시와 전용 인증 공급자의 중복 데이터
- 새로 시작: 인증 제공자를 버리고 React 쿼리 캐시에 저장
- 레거시 프로젝트: 둘 다 유지하는 것이 더 편리할 수 있습니다.

## JWT Authentication

- 이 앱은 JWT(JSON Web Token) 인증을 사용합니다.
  - Firebase / Amplify / 기타 클라우드 기반 인증을 사용할 수 있습니다.
- JWT
  - 서버는 성공적인 로그인(또는 사용자 생성) 시 토큰을 보냅니다.
  - 클라이언트는 신원 증명으로 요청과 함께 헤더에 토큰을 보냅니다.
- 보안
  - 토큰에는 사용자 이름 및 사용자 ID와 같은 인코딩된 정보가 포함되어 있습니다.
  - 서버에서 디코딩 및 일치
- 이 앱에서는 JWT가 사용자 개체에 저장됩니다.
  - localStorage에 지속됨
  - 인증 시스템은 세션 간에 데이터를 유지하기 위해 다른 방법을 사용할 수 있습니다.
- 클라이언트와 서버에 JWT가 이미 설정되어 있습니다.

## Set query cache values in useAuth

- 인증 제공자 역할을 하는 React Query
- 사용자 queryClient.setQueryData
- updateUser 및 clearUser에 추가
  - useAuth는 이미 이러한 기능을 호출합니다.

## Setting lnitial Value

- 초기화 데이터 값을 사용하여 쿼리 사용
  - 캐시에 초기값을 추가하고 싶을 때 사용
  - 자리 표시자의 경우 placeholderData 또는 구조화되지 않은 기본 값을 사용하세요.
- 초기값은 localStorage에서 옵니다.

- https://react-query.tanstack.com/guilds/initial-query-data#using-initialdata-to-prepopulate-aquery

## Dependent Queries

- 사용자 약속에 대한 별도 쿼리
  - 사용자 데이터보다 더 자주 변경됩니다.
  - 약간 인위적이지만 종속 쿼리를 보여주기에 좋습니다.
- useUserAppointments에서 useQuery를 호출합니다.
  - 지금은 주요 사용자 약속을 사용하세요.
  - 쿼리 키 접두사를 보기 시작하면 변경됩니다.
- 사용자의 진실 여부에 따라 쿼리를 작성합니다.
  - 참조: https://react-query.tanstack.com/guides/dependent-queries

## Remove userAppointments Query

- 로그아웃 시 사용자 약속 데이터가 지워졌는지 확인하세요.
  - queryClient.removeQueries
- 사용자 데이터에 대해 RemoveQueries를 사용하지 않는 이유는 무엇입니까?
  - setQueryData는 onSuccess를 호출합니다(removeQueries는 호출하지 않음).
- userAppointments에는 useUser에 대한 onSuccess가 필요하지 않습니다.

## Summary

- useQuery는 사용자 데이터를 캐시하고 서버에서 새로 고칩니다.

  - 서버에서 새로 고치는 것이 돌연변이에 중요합니다.

- useUser는 쿼리 캐시 및 localStorage에서 사용자 데이터를 관리합니다.

  - 로그인/로그아웃 시 setQueryData를 사용하여 쿼리 캐시 설정
  - onSuccess 콜백은 localStorage를 관리합니다.

- 사용자 상태에 따른 사용자 약속 쿼리
  - RemoveQueries를 사용하여 로그아웃 시 데이터 제거

<br>

# React Query Mutations

- Blog-em lpsum 이후로 mutation이 다시 도입되었습니다.
- 여기서 좀 더 현실적으로 활용해보세요. (서버 업데이트 예정!)
  - 데이터가 캐시에서 제거되도록 변형에 대한 쿼리를 무효화합니다.
  - 돌연변이 후 서버에서 반환된 데이터로 캐시를 업데이트합니다.
  - 낙관적 업데이트(변이가 성공할 것이라고 가정하고 실패하면 롤백)

## Global Fetching / Error

- 쿼리와 매우 유사
- 오류

  - 쿼리 클라이언트 defaultOptions의 mutations 속성에 onError 콜백을 설정합니다.

- 로딩 표시기
  - useIsMutating은 useIsFetching과 유사합니다.
  - isMutating에 표시할 로드 구성요소 업데이트

## useMutation

- useQuery와 매우 유사합니다!
- 차이점
  - 캐시 데이터 없음
  - 재시도 없음
  - 다시 가져오지 않음
  - isLoading 대 isFetching 없음
  - 실제로 mutation을 실행하는 mutate 함수를 반환합니다.
  - onMutate 콜백(낙관적 쿼리에 유용합니다!)
- 참조
  - https://react-query.tanstack.com/reference/useMutation
  - https://react-query.tanstack.com/guides/mutations

## Filtering with the select option

- Allow user to filter out any appointments that aren't available
- Why is the select option the best way to do this?

  - React Query memo-izes to reduce unnecessary computation
  - tech Details
    - triple equals comparision of select function
    - only runs if data changes or the function has changed
  - need a stable function (useCallback for anonymous function)

- 데이터가 변경되거나 함수가 변경된 경우에만 선택 함수를 실행합니다.
- 데이터가 마지막으로 데이터를 검색했을 때와 동일하고 선택 함수가 동일한 경우 선택 함수를 다시 실행하지 않습니다.

## Re-fetching! How?

- Control with global or query-specific options:
  - refetchOnMount, refetchOnWindowFocus, refetchOnReconnect, refetchInterval
- Or, imperatively: refetch function in useQuery return object

### Suppressing Re-Fetch

- How?
  - Increase stale time
  - turn off refetchOnMount / refetchOnWindowFocus / refetchOnReconnect
- Only for very rarely changed, not mission-critical data
- 리패치를 실행하는 유일한 경 우는 캐시가 비어있을 때임 (gcTime이 0일 때)

### useMutation

- very similar to useQuery!
- Differences
  - no query key
  - no cache data
  - no retries
  - no refetch
  - no isLoading vs isFetching
  - return mutate function which actually runs mutation
  - onMutation callback (useful for optimistic queries!)

### Optimistic Updates

- update UI before response from the server
  - you're "optimistic" that the mutation will work
- Note: there's also an option to update the cache
  - more complicated, but more control
    - need to cancel queries in progress so old server data won't overwrite update
    - need to save data for possible rollback
    - need to handle rollback explicitly if update fails
  - useful if you're showing the data in multiple components

### Optimistic Updates: UI

- React query makes this pretty easy
- get mutation data with useMutationState
  - mutation key identifies which mutation data
  - display this data on the page while mutation is pending
- Invalidate query after mutation is settled
  - if the mutation failed, data will 'roll back' - i.e., it will be replaced with old data from server
    `

```javascript
// somewhere in your app
const { mutate } = useMutation({
  mutationFn: (newTodo: string) => axios.post('/api/data', { text: newTodo }),
  onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  mutationKey: ['addTodo'],
});

// access variables somewhere else
const variables =
  useMutationState <
  string >
  {
    filters: { mutationKey: ['addTodo'], status: 'pending' },
    select: (mutation) => mutation.state.variables,
  };

const queryClient = useQueryClient();

useMutation({
  mutationFn: updateTodo,
  // When mutate is called:
  onMutate: async (newTodo) => {
    // Cancel any outgoing refetches
    // (so they don't overwrite our optimistic update)
    await queryClient.cancelQueries({ queryKey: ['todos'] });

    // Snapshot the previous value
    const previousTodos = queryClient.getQueryData(['todos']);

    // Optimistically update to the new value
    queryClient.setQueryData(['todos'], (old) => [...old, newTodo]);

    // Return a context object with the snapshotted value
    return { previousTodos };
  },
  // If the mutation fails,
  // use the context returned from onMutate to roll back
  onError: (err, newTodo, context) => {
    queryClient.setQueryData(['todos'], context.previousTodos);
  },
  // Always refetch after error or success:
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  },
});
```
