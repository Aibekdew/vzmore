"use client";
import styles from "./CalendarModalRates.module.scss";
import React, { FC, useState, useMemo, useEffect } from "react";
import { useCalendarQuery } from "@/redux/api/room";
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
  // Сначала получаем текущий год/месяц
  const now   = new Date();
  const thisY = now.getFullYear();
  const thisM = now.getMonth(); // 0‑based

  // Конфиг для двух месяцев: текущего и следующего
  const monthsConfig = [
    {
      year: thisY,
      month: thisM,
      title: now.toLocaleString("ru", { month: "long", year: "numeric" }),
    },
    {
      year: thisM === 11 ? thisY + 1 : thisY,
      month: (thisM + 1) % 12,
      title: new Date(thisY, thisM + 1, 1).toLocaleString("ru", {
        month: "long",
        year: "numeric",
      }),
    },
  ];

  // Помощник для смещения по понедельникам
  function getMondayBasedWeekday(d: Date) {
    const wd = d.getDay();
    return wd === 0 ? 7 : wd;
  }

  // Собираем IMonthData
  return monthsConfig.map(({ year, month, title }) => {
    const first = new Date(year, month, 1);
    const last  = new Date(year, month + 1, 0);
    const total = last.getDate();
    const offset = getMondayBasedWeekday(first) - 1;
    const days: Date[] = [];
    for (let i = 1; i <= total; i++) days.push(new Date(year, month, i));
    return { title, year, month, days, offset, totalDays: total };
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
  const guestsTotal = 1; // пока берём 1; можно прокинуть пропой

  // грузим два месяца параллельно
  const { data: cal1 } = useCalendarQuery({
    year: monthsData[0].year,
    month: monthsData[0].month + 1,
    guests: guestsTotal,
  });
  const { data: cal2 } = useCalendarQuery({
    year: monthsData[1].year,
    month: monthsData[1].month + 1,
    guests: guestsTotal,
  });

  // превращаем в Map<isoDate, price>
  const priceMap = useMemo(() => {
    const map = new Map<string, string | null>();
    [...(cal1 ?? []), ...(cal2 ?? [])].forEach((d) => map.set(d.date, d.price));
    return map;
  }, [cal1, cal2]);


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
    if (startDate && endDate && totalSelectedPrice !== null) {
      onSelectRange(startDate, endDate);
      localStorage.setItem("selectedPrice", String(totalSelectedPrice));
      onClose();
    } else {
      alert("Выберите даты, где есть свободные номера");
    }
  };
  const totalSelectedPrice = useMemo(() => {
    if (!startDate || !endDate) return null;
    const from = parseDate(startDate),
      to = parseDate(endDate);
    let sum = 0;
    for (let d = new Date(from); d < to; d.setDate(d.getDate() + 1)) {
      const iso = d.toISOString().slice(0, 10);
      const p = priceMap.get(iso);
      if (p === null || p === undefined) return null; // где‑то пропала цена
      sum += Number(p);
    }
    return sum;
  }, [startDate, endDate, priceMap]);

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
  const isoDate     = dayDateObj.toISOString().slice(0, 10);
  const dbPrice     = priceMap.get(isoDate) ?? null;
  const selectable  = dbPrice !== null;

  // выделения диапазона
  const inRange     = isInRange(dayDateObj);
  const start       = isRangeStart(dayDateObj);
  const end         = isRangeEnd(dayDateObj);

  let dayClass = styles.dayCell;
  if (!selectable) dayClass += " " + styles.unavailable;
  if (inRange)     dayClass += " " + styles.selected;
  if (start)       dayClass += " " + styles.rangeStart;
  if (end)         dayClass += " " + styles.rangeEnd;

  return (
    <div
      key={isoDate}
      className={dayClass}
      onClick={() => selectable && handleDayClick(dayDateObj)}
      onMouseEnter={() => selectable && handleMouseEnter(dayDateObj)}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.dayNumber}>{dayDateObj.getDate()}</div>
      <div className={styles.dayPrice}>
        {selectable ? Number(dbPrice!).toLocaleString() + " KGS" : "×"}
      </div>
    </div>
  );
})}

              </div>
            </div>
          ))}
        </div>

        {startDate &&
          endDate &&
          nightsCount !== null &&
          totalSelectedPrice !== null && (
            <div className={styles.selectedInfo}>
              Заезд {startDate} → Выезд {endDate} ({nightsCount}день.)
              <br />
              Сумма: <strong>{totalSelectedPrice.toLocaleString()} KGS</strong>
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
