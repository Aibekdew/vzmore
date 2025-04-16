"use client";
import React, { FC, useState, useMemo } from "react";
import styles from "./CalendarModalRates.module.scss";

interface ICalendarModalRatesProps {
  onClose: () => void;
  defaultStart?: string | null; // Формат: "DD.MM.YYYY"
  defaultEnd?: string | null;
  onSelectRange: (start: string, end: string) => void;
  lockStart?: boolean; // если true — дата заезда зафиксирована, можно выбрать только дату выезда
}

interface IMonthData {
  title: string; // например "Апрель 2025"
  year: number;
  month: number; // 0-11 (JS-формат)
  days: Date[]; // массив Date для каждого дня месяца
  offset: number; // кол-во пустых ячеек перед 1-м числом (с учётом начала недели: Пн)
  totalDays: number; // сколько дней в месяце
}

function formatDate(dateObj: Date): string {
  const dd = String(dateObj.getDate()).padStart(2, "0");
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const yyyy = dateObj.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

function parseDate(dateStr: string): Date {
  const [dd, mm, yyyy] = dateStr.split(".");
  return new Date(+yyyy, +mm - 1, +dd);
}

function generateMonths(): IMonthData[] {
  const monthsConfig = [
    { year: 2025, month: 3, title: "Апрель 2025" },
    { year: 2025, month: 4, title: "Май 2025" },
  ];

  function getMondayBasedWeekday(date: Date) {
    let wd = date.getDay();
    return wd === 0 ? 7 : wd;
  }

  return monthsConfig.map(({ year, month, title }) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();
    const offset = getMondayBasedWeekday(firstDay) - 1;
    const days: Date[] = [];
    for (let d = 1; d <= totalDays; d++) {
      days.push(new Date(year, month, d));
    }
    return { title, year, month, days, offset, totalDays };
  });
}

const CalendarModalRates: FC<ICalendarModalRatesProps> = ({
  onClose,
  defaultStart,
  defaultEnd,
  onSelectRange,
  lockStart = false,
}) => {
  const monthsData = useMemo(() => generateMonths(), []);

  const [startDate, setStartDate] = useState<string | null>(
    defaultStart || null
  );
  const [endDate, setEndDate] = useState<string | null>(defaultEnd || null);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const handleDayClick = (dateObj: Date) => {
    const dateStr = formatDate(dateObj);
    if (lockStart) {
      if (!startDate) return;
      if (dateObj <= parseDate(startDate)) {
        alert("Дата выезда должна быть позже даты заезда");
        return;
      }
      setEndDate(dateStr);
      return;
    } else {
      if (!startDate) {
        setStartDate(dateStr);
        setEndDate(null);
        return;
      }
      if (!endDate) {
        const s = parseDate(startDate);
        if (dateObj < s) {
          setEndDate(startDate);
          setStartDate(dateStr);
        } else {
          setEndDate(dateStr);
        }
        return;
      }
      setStartDate(dateStr);
      setEndDate(null);
    }
  };

  const handleMouseEnter = (dateObj: Date) => {
    if (!lockStart && startDate && !endDate) {
      setHoveredDate(formatDate(dateObj));
    }
  };
  const handleMouseLeave = () => {
    if (!lockStart && startDate && !endDate) {
      setHoveredDate(null);
    }
  };

  const isInRange = (dayObj: Date) => {
    if (!startDate) return false;
    let start = parseDate(startDate);
    let end = endDate
      ? parseDate(endDate)
      : hoveredDate
      ? parseDate(hoveredDate)
      : null;
    if (!end) return false;
    if (start > end) [start, end] = [end, start];
    return dayObj >= start && dayObj <= end;
  };

  const isRangeStart = (dayObj: Date) =>
    !!startDate && formatDate(dayObj) === startDate;
  const isRangeEnd = (dayObj: Date) =>
    !!endDate && formatDate(dayObj) === endDate;

  const handleApply = () => {
    if (startDate && endDate) {
      onSelectRange(startDate, endDate);
      onClose();
    } else {
      alert("Пожалуйста, выберите дату заезда и выезда!");
    }
  };

  const nightsCount = useMemo(() => {
    if (!startDate || !endDate) return null;
    const diff = parseDate(endDate).getTime() - parseDate(startDate).getTime();
    return Math.round(diff / (1000 * 60 * 60 * 24));
  }, [startDate, endDate]);

  const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.calendarTitle}>
          {lockStart ? "Выберите дату выезда" : "Выберите дату заезда"}
        </h3>

        <div className={styles.monthsWrapper}>
          {monthsData.map((monthInfo, idx) => (
            <div key={idx} className={styles.singleMonth}>
              <h4 className={styles.monthName}>{monthInfo.title}</h4>

              <div className={styles.weekDaysRow}>
                {weekDays.map((wday) => (
                  <div key={wday} className={styles.weekDayCell}>
                    {wday}
                  </div>
                ))}
              </div>

              <div className={styles.calendarGrid}>
                {Array.from({ length: monthInfo.offset }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className={`${styles.dayCell} ${styles.emptyCell}`}
                  />
                ))}
                {monthInfo.days.map((dayDateObj) => {
                  const iso = dayDateObj.toISOString();
                  const inRange = isInRange(dayDateObj);
                  const start = isRangeStart(dayDateObj);
                  const end = isRangeEnd(dayDateObj);

                  let dayClass = styles.dayCell;
                  if (inRange) dayClass += " " + styles.selected;
                  if (start) dayClass += " " + styles.rangeStart;
                  if (end) dayClass += " " + styles.rangeEnd;

                  const price = 4500;
                  return (
                    <div
                      key={iso}
                      className={dayClass}
                      onClick={() => handleDayClick(dayDateObj)}
                      onMouseEnter={() => handleMouseEnter(dayDateObj)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className={styles.dayNumber}>
                        {dayDateObj.getDate()}
                      </div>
                      <div className={styles.dayPrice}>{price} KGS</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {startDate && endDate && nightsCount !== null && (
          <div className={styles.selectedInfo}>
            Заезд {startDate} → Выезд {endDate} ({nightsCount} ночей)
          </div>
        )}

        <p className={styles.subInfo}>
          Лучшая цена для 1 гостя за ночь
          <br />
          Цена может быть недоступна при соблюдении специальных условий
          бронирования
        </p>

        <div className={styles.buttonsRow}>
          <button onClick={handleApply}>Применить</button>
          <button onClick={onClose}>Отмена</button>
        </div>
      </div>
    </div>
  );
};

export default CalendarModalRates;
