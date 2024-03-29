/* eslint-disable prettier/prettier */
// TODO: Лучше тут конечно всё типизировать, но нет на это времени. А ошибки - в константы

import { HttpException, HttpStatus } from "@nestjs/common";
import { addDays, differenceInDays, format, fromUnixTime, isPast } from "date-fns";

/** Ищет совпадающие элементы в двух массивах */
export const findArraysMatchingElements = (arr1, arr2) => arr1.filter((n) => arr2.indexOf(n) !== -1);

/** Создает диапазон (массив) дат между начальной и конечной */
export const getDatesRange = (startDate: Date, endDate: Date) => {
  const reservedDaysCount = differenceInDays(endDate, startDate);

  if (reservedDaysCount < 1) {
    throw new HttpException(
      'Неверно выбраны даты!',
      HttpStatus.BAD_REQUEST,
    );
  };

  const datesRange = [];

  for (let i = 0; i < reservedDaysCount + 1; i++) {
    datesRange.push(addDays(startDate, i));
  }

  return datesRange.map((date) => +new Date(date) / 1000);
}

/** Создает матрицу (двумерный массив) всех забронированных дат, а затем извлекает их до одномерного массива */
export const getAllBookedDates = (allStartEndRoomReservationDates) => {
  const allBookedDates = [];

  allStartEndRoomReservationDates.forEach((element) => {
    const datesRange = getDatesRange(element.dateStart, element.dateEnd)
    allBookedDates.push(datesRange);
  });

  return allBookedDates.flat().sort((a, b) => a - b)
}

/** Преобразует дату из UNIX-timestamp и форматирует ее в привычный вид */
export const getPrettyDatesString = (date) => format(fromUnixTime(date), 'dd/MM/yyyy');

/** Проверяет, что начальная и конечная даты ещё не наступили */
export const determineRelevanceOfDate = (dateStart: Date, dateEnd: Date) => {
  if (isPast(dateStart) || isPast(dateEnd)) {
    throw new HttpException(
      'Нельзя забронировать уже прошедшие даты!',
      HttpStatus.BAD_REQUEST,
    );
  }
}

export const getRandomFileName = () => {
  return Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
}