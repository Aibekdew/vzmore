"use client";
import { FC, useState, useEffect } from "react";
import scss from "./OurNumbers.module.scss";

interface RoomInfo {
  title: string;
  price: number;
  description: string;
  images: string[];
}

const OurNumbers: FC = () => {
  // Data for the two room types (Deluxe and Superior)
  const rooms: RoomInfo[] = [
    {
      title: "Deluxe",
      price: 150,
      description:
        "Этот номер идеально подходит для семейного отдыха, предлагает комфорт и удобства, необходимые для приятного пребывания.",
      images: [
        "https://media-cdn.tripadvisor.com/media/photo-s/0f/9f/a7/80/caption.jpg",
        "https://algritravel.kz/thumb/2/jUdyhxvLm0a5t6nO5kLz3A/719c479/d/copy_of_p1010044.jpg",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0xBUNr8tJhSgnlXkXonqv0d5AcvMCBhcZjQ&s",
      ],
    },
    {
      title: "Superior",
      price: 120,
      description:
        "Отличный выбор как для бизнеса, так и для отдыха, предоставляющий все необходимые для эффективной работы и комфортного проживания.",
      images: [
        "https://uploads2.stells.info/iOz9lKRaZJlt-AYsaNy0XSiJV9Q=/952x600/jpg/c/7f/c7f373c8337d35f6468a6f03052264ce.jpg",
        "https://buduvsochi.ru/up/files/images/sanatorii/yujnoe-vzmore.jpg",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHFkaobQrDli5ithbYDunJJoi2hjo4tv15WQ&s",
      ],
    },
  ];

  // Current displayed image index for each room
  const [currentIndices, setCurrentIndices] = useState<number[]>(
    new Array(rooms.length).fill(0)
  );

  // Change image index every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndices((prevIndices) =>
        prevIndices.map((currentIndex, idx) => {
          return (currentIndex + 1) % rooms[idx].images.length;
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [rooms]);

  // Function to scroll to the Filter component
  const scrollToFilter = () => {
    const filterElement = document.getElementById("filter");
    if (filterElement) {
      filterElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className={scss.OurNumbers}>
      <div className={scss.container}>
        <h2 className={scss.title}>Наши номера</h2>

        <div className={scss.cardsWrapper}>
          {rooms.map((room, i) => (
            <div className={scss.card} key={i}>
              <div className={scss.imageWrapper}>
                {room.images.map((imgSrc, idx) => (
                  <img
                    key={idx}
                    src={imgSrc}
                    alt={room.title}
                    className={
                      idx === currentIndices[i]
                        ? `${scss.roomImage} ${scss.active}`
                        : scss.roomImage
                    }
                  />
                ))}
              </div>
              <div className={scss.info}>
                <h3 className={scss.roomTitle}>
                  {room.title} - {room.price}$
                </h3>
                <p className={scss.description}>{room.description}</p>
                {/* Instead of linking to another page, we call scrollToFilter */}
                <button className={scss.btn} onClick={scrollToFilter}>
                  Бронировать
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurNumbers;
