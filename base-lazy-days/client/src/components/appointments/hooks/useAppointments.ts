// @ts-nocheck
import dayjs from 'dayjs';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import { useUser } from '../../user/hooks/useUser';
import { AppointmentDateMap } from '../types';
import { getAvailableAppointments } from '../utils';
import { getMonthYearDetails, getNewMonthYear, MonthYear } from './monthYear';

// for useQuery call
async function getAppointments(
  year: string,
  month: string,
): Promise<AppointmentDateMap> {
  const { data } = await axiosInstance.get(`/appointments/${year}/${month}`);
  return data;
}

// types for hook return object
interface UseAppointments {
  appointments: AppointmentDateMap;
  monthYear: MonthYear;
  updateMonthYear: (monthIncrement: number) => void;
  showAll: boolean;
  setShowAll: Dispatch<SetStateAction<boolean>>;
}

// 이 hook의 목적:
// 1. 사용자가 선택한 현재 월/연도(일명 MonthYear)를 추적합니다.
// 1a. 상태를 업데이트하는 방법 제공
// 2. 특정 MonthYear에 대한 약속을 반환합니다.
// 2a. AppointmentDateMap 형식으로 반환(일별로 인덱싱된 약속 배열)
// 2b. 인접한 달의 약속을 미리 가져옵니다.
// 3. 필터 상태 추적(모든 약속 / 사용 가능한 약속)
// 3a. 이번 달 연도에 적용 가능한 약속만 반환합니다.
export function useAppointments(): UseAppointments {
  /** ****************** START 1: monthYear state *********************** */
  // 현재 날짜의 MonthYear를 가져옵니다(기본 MonthYear 상태의 경우).
  const currentMonthYear = getMonthYearDetails(dayjs());

  // 사용자가 선택한 이번 달 연도를 추적하는 상태
  // 상태 값은 후크 반환 개체에 반환됩니다.
  const [monthYear, setMonthYear] = useState(currentMonthYear);

  // 사용자가 보기에서 월을 변경할 때 상태의 MonthYear obj를 업데이트하도록 설정자,
  // 후크 반환 객체로 반환됨
  function updateMonthYear(monthIncrement: number): void {
    setMonthYear((prevData) => getNewMonthYear(prevData, monthIncrement));
  }
  /** ****************** END 1: monthYear state ************************* */
  /** ****************** START 2: filter appointments  ****************** */
  // 모든 약속 또는 가능한 약속만 표시하도록 필터링하는 상태 및 함수
  const [showAll, setShowAll] = useState(false);

  // 여기에 가져온 함수 getAvailableAppointments가 필요합니다.
  // 표시할 수 있도록 사용자가 getAvailableAppointments를 전달해야 합니다.
  // 로그인한 사용자가 예약한 약속(흰색)
  const { user } = useUser();

  /** ****************** END 2: filter appointments  ******************** */
  /** ****************** START 3: useQuery  ***************************** */
  // 이번 달의 약속에 대한 쿼리 호출을 사용합니다.
  const queryClient = useQueryClient();
  useEffect(() => {
    // assume increment of one month
    const nextMonthYear = getNewMonthYear(monthYear, 1);
    queryClient.prefetchQuery(
      [queryKeys.appointments, nextMonthYear.year, nextMonthYear.month],
      () => getAppointments(nextMonthYear.year, nextMonthYear.month),
    );
  }, [queryClient, monthYear]);

  // 노트:
  // 1. 약속은 AppointmentDateMap입니다(월의 날짜가 포함된 개체).
  // 속성으로, 해당 날짜의 약속 배열을 값으로)
  //
  // 2. getAppointments 쿼리 함수에는 MonthYear.year 및
  // 월년.월
  const fallback = {};
  const { data: appointments = fallback } = useQuery(
    [queryKeys.appointments, monthYear.year, monthYear.month],
    () => getAppointments(monthYear.year, monthYear.month),
    // keepPreviousData는 여기서 적합하지 않음
    // {
    //   keepPreviousData: true, // 쿼리 키가 변경될 때까지 이전의 모든 데이터가 그대로 유지된다.
    // },
  );

  /** ****************** END 3: useQuery  ******************************* */

  return { appointments, monthYear, updateMonthYear, showAll, setShowAll };
}
