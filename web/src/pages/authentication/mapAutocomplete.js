import { useRef, useState } from "react";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";

import styled, { createGlobalStyle } from "styled-components";
import { TextField } from "@mui/material";

const apiKey = "AIzaSyBxx8CORlQQBBkbGc-F0yu95DMZaiJkMmo";

const libraries = ["places"];

export const MapAutoComplete = ({ address, setAddress }) => {
  const autocompleteRef = useRef(null);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  });

  if (!isLoaded) return "Loading...";

  if (window.google === undefined) {
    return <div>Loading Google Maps API...</div>;
  }

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    const components = {};

    for (const component of place.address_components) {
      if (component.types.includes("country")) {
        components.country = component.long_name;
      } else if (component.types.includes("administrative_area_level_1")) {
        components.region = component.long_name;
      } else if (component.types.includes("locality")) {
        components.city = component.long_name;
      } else if (component.types.includes("sublocality_level_1")) {
        components.district = component.long_name;
      } else if (component.types.includes("route")) {
        components.street = component.long_name;
      } else if (component.types.includes("street_number")) {
        components.streetNumber = component.long_name;
      }
    }

    const latitude = place.geometry.location.lat();
    const longitude = place.geometry.location.lng();

    setAddress({
      country: components.country,
      region: components.region,
      city: components.city,
      district: components.district,
      street: components.street,
      streetNumber: components.streetNumber,
      latitude: latitude,
      longitude: longitude,
      address: place.formatted_address,
    });
  };

  return (
    <>
      <GlobalStyles />
      <Container>
        <Autocomplete
          onLoad={(ref) => (autocompleteRef.current = ref)}
          onPlaceChanged={handlePlaceChanged}
          query={{
            key: "AIzaSyBxx8CORlQQBBkbGc-F0yu95DMZaiJkMmo", // Consider storing sensitive keys in environment variables
            language: "en",
          }}
        >
          <TextField
            id="outlined-basic"
            label="Enter a location"
            variant="outlined"
            sx={{
              width: "75vw",
              "& .MuiOutlinedInput-root": {
                height: "53px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.1)",
                  borderRadius: "15px",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#f866b1",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#f866b1",
                },
              },
              "& .MuiOutlinedInput-input": {
                borderRadius: "15px",
                color: "#ccc",
              },
              "& label": {
                color: "#888",
                fontSize: "14px",
                letterSpacing: "0.5px",
              },
              "& label.Mui-focused": {
                color: "#ccc",
                fontSize: "14px",
                letterSpacing: "0.5px",
              },
            }}
          />
        </Autocomplete>
      </Container>
    </>
  );
};

const Container = styled.div`
  width: 75%;
  height: 100%;
  display: flex;
  justify-content: center;
  border-radius: 15px;

  .input {
    width: 100%;
    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: transparent;
    font-size: 16px;
    color: #ccc;
    transition: ease-in 200ms;
    padding: 0 15px;

    &::placeholder {
      color: #888;
      font-size: 14px;
    }

    &:focus {
      outline: none;
      box-shadow: none;
    }

    &:hover {
      outline: none;
      border: 1.5px solid #f866b1;
    }
  }
`;

const GlobalStyles = createGlobalStyle`
  .pac-container {
    border: 1.5px solid #f866b1;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    background-color: #fff;
    border-radius: 15px;
    margin-top: 8px;
    background: rgba(1, 2, 12, 0.8);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  .pac-item {
    padding: 5px 10px;
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    color: #ccc;
    font-weight: bold;
    border: none;
    letter-spacing: 0.5px;
  }

  .pac-item:hover {
    font-size: 14px;
    letter-spacing: 0.5px;
    background: none;
    opacity: 0.8;
  }

  .pac-item-query {
    font-weight: bold;
    color: #ccc;
    font-size: 14px;
    letter-spacing: 0.5px;
  }

  .pac-matched {
    font-weight: bold;
    color: #f866b1;
    font-size: 14px;
    letter-spacing: 0.5px;
  }

  .pac-icon {
    width: 15px;
    height: 20px;
    /* You might adjust the icon styling here */
  }
`;
