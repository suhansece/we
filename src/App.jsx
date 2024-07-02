import { useEffect, useState } from "react";
import "./App.css"; // Import CSS for styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const App = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [specialDates, setSpecialDates] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null); // State to track selected day
  const [inputValue, setInputValue] = useState(""); // State for input box value
  const [isStartButtonDisabled, setIsStartButtonDisabled] = useState(false); // State to track if Start button should be disabled
  const [isEndButtonDisabled, setIsEndButtonDisabled] = useState(false); // State to track if End button should be disabled
  const[update,setUpdate]=useState(0);

  // Function to navigate to the previous month
  const prevMonth = () => {
    setCurrentDate((prevDate) => {
      const prevMonthDate = new Date(prevDate);
      prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
      return prevMonthDate;
    });
  };

  const nextMonth = () => {
    setCurrentDate((prevDate) => {
      const nextMonthDate = new Date(prevDate);
      nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
      return nextMonthDate;
    });
  };

  const handleAddDate = async () => {
    try {
      await axios.put("api/addevent", { message: inputValue });
      setInputValue("");
      setUpdate(()=>update+1);
    } catch (e) {
      console.log(e);
    }
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const days = [];

    for (let i = 1; i <= daysInMonth + firstDayIndex; i++) {
      if (i > firstDayIndex) {
        const day = i - firstDayIndex;
        const isSpecial = isSpecialDate(month + 1, day, year);
        const specialSymbol = getSpecialSymbol(month, day);
        days.push({ day, isSpecial, specialSymbol });
      } else {
        days.push(null);
      }
    }

    return days;
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear() &&
      day === today.getDate()
    );
  };

  const isSpecialDate = (month, day, year) => {
    const specialDate = specialDates.find((date) => {
      const a = date.Date.split("/");
      return (
        Number(a[0]) === month &&
        Number(a[1]) === day &&
        Number(a[2]) === year
      );
    });

    return specialDate ? { type: specialDate.type, message: specialDate.message } : "h";
  };

  const getSpecialSymbol = (month, day) => {
    if (month === 0 && day === 27) {
      return "🤴";
    } else if (month === 10 && day === 13) {
      return "👸";
    }
    return null;
  };

  const handleDateClick = (day) => {
    setSelectedDay(day === selectedDay ? null : day.isSpecial.message);
  };

  const handleStartButtonClick = async () => {
    try {
      await axios.put("api/addstart");
      setUpdate(()=>update+1);
    } catch (e) {
      console.log(e);
    }
  };

  const handleEndButtonClick = async () => {
    try {
      await axios.put("api/addend");
      setUpdate(()=>update+1);
    } catch (e) {
      console.log(e);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    const get = async () => {
      const data = await axios.get("api/dates");
      setSpecialDates(data.data);
      console.log("Fetched special dates:", data.data);
    };
    get();
  }, [update]);

  useEffect(() => {
    // Check if today is a special start or end date
    const today = new Date();
    const isTodaySpecialStart = specialDates.some(date => {
      const [month, day, year] = date.Date.split("/");
      console.log(`Checking date: ${month}/${day}/${year.slice(0, 4)} - Type: ${date.type}`);
      console.log(`Checking date: ${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()} - Type: ${date.type}`);
      return (
        Number(month) === today.getMonth() + 1 &&
        Number(day) === today.getDate() &&
        Number(year.slice(0, 4)) === today.getFullYear() &&
        date.type === "Start"
      );
    });

    const isTodaySpecialEnd = specialDates.some(date => {
      const [month, day, year] = date.Date.split("/");
      console.log(`Checking date: ${month}/${day}/${year.slice(0, 4)} - Type: ${date.type}`);
      console.log(`Checking date: ${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()} - Type: ${date.type}`);
      return (
        Number(month) === today.getMonth() + 1 &&
        Number(day) === today.getDate() &&
        Number(year.slice(0, 4)) === today.getFullYear() &&
        date.type === "End"
      );
    });

    console.log(`Is today a special start date? ${isTodaySpecialStart}`);
    console.log(`Is today a special end date? ${isTodaySpecialEnd}`);
    setIsStartButtonDisabled(isTodaySpecialStart);
    setIsEndButtonDisabled(isTodaySpecialEnd);
  }, [specialDates]);

  return (
    <div className="container">
      <div className="nav">Every Thing About Us</div>
      <div className="calendar">
        <div className="header">
          <button onClick={prevMonth}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <h2>
            {currentDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <button onClick={nextMonth}>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
        <div className="days">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className="dates">
          {specialDates.length > 0 &&
            getDaysInMonth().map((item, index) => (
              <div
                key={index}
                className={
                  item ? isToday(item.day) ? "date today" : item.isSpecial ? (item.isSpecial.type === "Start" ? "Start" : item.isSpecial.type === "End" ? "End" : "date") : "date" : "sum"
                }
                onClick={() => handleDateClick(item)}
              >
                {item
                  ? item.specialSymbol
                    ? item.specialSymbol
                    : item.day
                  : ""}
              </div>
            ))}
        </div>
      </div>

      {selectedDay && (
        <div className="box">
          <p>{selectedDay}</p>
        </div>
      )}
      <div className="add-date">
        <h1>Today Memories</h1>
        <input
          type="text"
          placeholder="Your thoughts"
          value={inputValue} // Bind input box value to state
          onChange={handleInputChange} // Handle input change
        />
        <button onClick={handleAddDate}>
          <FontAwesomeIcon icon={faPlus} /> Add
        </button>
      </div>
      <div className="se-btn">
        <button onClick={handleStartButtonClick} disabled={isStartButtonDisabled}>Start</button>
        <button onClick={handleEndButtonClick} disabled={isEndButtonDisabled}>End</button>
      </div>
    </div>
  );
};

export default App;
