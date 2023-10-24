import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { workingDaysOptions } from "../../datas/registerDatas";

// Main component
export const WDOptions = ({ value, setValue }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    // Whenever 'value' changes, synchronize it with 'selectedOptions'
    const newSelectedOptions = workingDaysOptions.filter((option) =>
      value.includes(option.value)
    );
    setSelectedOptions(newSelectedOptions);
  }, [value]);

  const lang = useSelector((state) => state.storeApp.language);

  const handleSelect = (option) => {
    if (selectedOptions.includes(option)) {
      // If the option is already selected, remove it from the array
      const newSelectedOptions = selectedOptions.filter((o) => o !== option);
      setSelectedOptions(newSelectedOptions);
      setValue((prev) => prev.filter((item) => item !== option.value));
    } else {
      // If the option is "everyDay" or "workingDays", remove all other options
      if (option.value === "everyDay" || option.value === "workingDays") {
        setSelectedOptions([option]);
        setValue([option.value]);
      } else {
        // If any other option is selected, remove "everyDay" and "workingDays" from the selection
        const newSelectedOptions = selectedOptions.filter(
          (o) => o.value !== "everyDay" && o.value !== "workingDays"
        );
        setSelectedOptions([...newSelectedOptions, option]);
        setValue((prev) =>
          prev
            .filter((item) => item !== "everyDay" && item !== "workingDays")
            .concat(option.value)
        );
      }
    }
  };

  return (
    <Container>
      {workingDaysOptions.map((option, index) => (
        <Option
          key={index}
          borderColor={
            value.includes(option.value) ? "#f866b1" : "rgba(255,255,255,0.1)"
          }
          color={value.includes(option.value) ? "#f866b1" : "#ccc"}
          onClick={() => handleSelect(option)}
        >
          {lang === "en" ? option.en : lang === "ru" ? option.ru : option.ka}
        </Option>
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
  gap: 5px;
`;

const Option = styled.button`
  padding: 8px;
  border-radius: 50px;
  align-items: center;
  border: none;
  cursor: pointer;
  outline: none;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0.5px;
  border: 1.5px solid ${(props) => props.borderColor};
  background: none;
  color: ${(props) => props.color};
`;
