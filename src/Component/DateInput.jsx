import { useEffect, useState } from "react";

const DateInput = ({ isoDateString, onChange }) => {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    if (isoDateString) {
      const date = new Date(isoDateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const day = String(date.getDate()).padStart(2, '0');
      setFormattedDate(`${year}-${month}-${day}`);
    }
  }, [isoDateString]);

  return (
    <input
      type="date"
      value={formattedDate}
      onChange={(e) => {
        setFormattedDate(e.target.value);
        onChange(e.target.value); // Pass only the value to the parent
      }}
      className="input input-bordered"
    />
  );
};

export default DateInput;
