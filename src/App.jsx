import { useEffect, useState } from 'react';
import './App.css'; // Import CSS for styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';

const App = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [specialDates, setSpecialDates] = useState([]);
  const [newDate, setNewDate] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null); // State to track selected day
  const [inputValue, setInputValue] = useState(''); // State for input box value

  // Function to navigate to the previous month
  const prevMonth = () => {
    setCurrentDate(prevDate => {
      const prevMonthDate = new Date(prevDate);
      prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
      return prevMonthDate;
    });
  };

  const nextMonth = () => {
    setCurrentDate(prevDate => {
      const nextMonthDate = new Date(prevDate);
      nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
      return nextMonthDate;
    });
  };

  const handleAddDate = async () => {
    try {
      await axios.put('api/addevent', { message: inputValue });
      setInputValue('');
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
        const isSpecial = isSpecialDate(month, day, year);
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
    return currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear() && day === today.getDate();
  };

  const isSpecialDate = (month, day, year) => {
    return specialDates.some(date => date.month === month && date.day === day && date.year === year);
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
    setSelectedDay(day === selectedDay ? null : day);
  };

  const handleStartButtonClick = async () => {
   
    try {
      await axios.put('api/addstart');
    } catch (e) {
      console.log(e);
    }
  };

  const handleEndButtonClick = async () => {
   
    try {
      await axios.put('api/addend');
    } catch (e) {
      console.log(e);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const addSpecial = () => {
   
  
    const updatedSpecialDates = [...specialDates]; // Create a copy of the current special dates
  
    newDate.forEach(date => {
      const temp = date.Date.substring(0, 10).split("/");
      const k = {
        month: parseInt(temp[0])-1,
        day: parseInt(temp[1]),
        year: parseInt(temp[2])
      };
      updatedSpecialDates.push(k);  

    });

    setSpecialDates(updatedSpecialDates); 
  };
  useEffect(() => {
    const get = async () => {
      const data = await axios.get('api/dates');
      setNewDate(data.data[0].dates);
      
    };
    get();
  }, []);
  
  // Re-run addSpecial whenever newDate changes
  useEffect(() => {
    if (newDate.length > 0) {
      addSpecial();
    }
  }, [newDate]);
  
  // Add specialDates as a dependency to useEffect to re-render when it changes
  useEffect(() => {
    // Your code for rendering the calendar div
  }, [specialDates]);

  return (
    <div className="container">
      <div className='nav'>
        Every Thing About Us
      </div>
     <div className="calendar">
        <div className="header">
          <button onClick={prevMonth}><FontAwesomeIcon icon={faChevronLeft} /></button>
          <h2>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
          <button onClick={nextMonth}><FontAwesomeIcon icon={faChevronRight} /></button>
        </div>
        <div className="days">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className="dates">
  {getDaysInMonth().map((item, index) => (
    <div key={index} className={item ? (isToday(item.day) ? 'date today' : (item.isSpecial ? 'date special' : 'date')) : 'empty'}
      onClick={() => handleDateClick(item.day)}>
      {item ? (item.specialSymbol ? item.specialSymbol : item.day) : ''}
    </div>
  ))}
</div>

      </div>

      {selectedDay && (
        <div className="box">
          <p> {selectedDay}</p>
        </div>
      )}
      <div className="add-date">
        <h1>New Special</h1>
        <input
          type="text"
          placeholder="Your thoughts"
          value={inputValue} // Bind input box value to state
          onChange={handleInputChange} // Handle input change
        />
        <button onClick={handleAddDate}><FontAwesomeIcon icon={faPlus} /> Add</button>
      </div>
      <div className='se-btn'>
        <button onClick={handleStartButtonClick}>Start</button>
        <button onClick={handleEndButtonClick}>End</button>
      </div>
    </div>
  );
};

export default App;
