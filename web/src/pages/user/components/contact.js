import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import { setLoading } from "../../../redux/user";
import { BsFillTelephoneFill, BsBrowserChrome, BsTiktok } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import GoogleMapReact from "google-map-react";
import { HiLocationMarker } from "react-icons/hi";
import { BiLogoFacebook, BiLogoInstagramAlt } from "react-icons/bi";

export const Contact = () => {
  // redux dispatch
  const dispatch = useDispatch();
  // get outlet props context
  const [targetUser] = useOutletContext();

  const AnyReactComponent = ({ text }) => (
    <HiLocationMarker size={35} color="#f866b1" />
  );

  // active address
  const [activeAddress, setActiveAddress] = useState(0);
  const [address, setAddress] = useState(null);

  const defaultProps = {
    center: {
      lat: 41.6938,
      lng: 44.8015,
    },
    zoom: 15,
  };

  useEffect(() => {
    targetUser?.address?.map((i, x) => {
      if (x === activeAddress) {
        setAddress(i);
      }
    });
    setTimeout(() => {
      dispatch(setLoading(false));
    }, 1000);
  }, [targetUser, activeAddress]);

  return (
    <Container>
      <Links>
        <div>
          <div style={{ width: "30px", height: "30px" }}>
            <BsFillTelephoneFill color="#ccc" size={15} />
          </div>
          <a
            style={{
              textDecoration: "none",
              color: "inherit",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
            href={`tel:${targetUser?.phone?.phone}`}
          >
            {targetUser?.phone?.phone}
          </a>
        </div>
        <div>
          <div style={{ width: "30px", height: "30px" }}>
            <MdEmail color="#ccc" size={18} />
          </div>
          <a
            style={{
              textDecoration: "none",
              color: "inherit",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
            href={`mailto:${targetUser?.email}`}
          >
            {targetUser?.email}
          </a>
        </div>
        {targetUser?.media?.web && (
          <div>
            <div style={{ width: "30px", height: "30px" }}>
              <BsBrowserChrome color="#ccc" size={16} />
            </div>
            <a
              style={{
                textDecoration: "none",
                color: "inherit",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
              href={`https://${targetUser.media?.web}`}
            >
              {targetUser?.media?.web}
            </a>
          </div>
        )}
        {targetUser?.media?.facebook && (
          <div>
            <div style={{ width: "30px", height: "30px" }}>
              <BiLogoFacebook color="#ccc" size={22} />
            </div>
            <a
              style={{
                textDecoration: "none",
                color: "inherit",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
              href={`fb://profile/:${targetUser?.media?.email}`}
            >
              {targetUser?.media?.facebook}
            </a>
          </div>
        )}
        {targetUser?.media?.instagram && (
          <div>
            <div style={{ width: "30px", height: "30px" }}>
              <BiLogoInstagramAlt color="#ccc" size={22} />
            </div>
            <a
              style={{
                textDecoration: "none",
                color: "inherit",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
              href={`https://www.instagram.com/${targetUser?.media?.instagram}`}
            >
              {targetUser?.media?.instagram}
            </a>
          </div>
        )}
        {targetUser?.media?.tiktok && (
          <div>
            <div style={{ width: "30px", height: "30px" }}>
              <BsTiktok color="#ccc" size={16} />
            </div>
            <a
              style={{
                textDecoration: "none",
                color: "inherit",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
              href={`https://${targetUser.media?.web}`}
            >
              {targetUser?.media?.web}
            </a>
          </div>
        )}
      </Links>
      {/* <Address>
        <h4 style={{ color: "#ccc" }}>
          Address:{" "}
          <span style={{ fontWeight: "normal" }}>
            {address?.city.replace("'", "")} {address?.street && "-"}{" "}
            {address?.street} {address?.streetNumber && "N"}
            {address?.streetNumber}
          </span>
        </h4>
        <div
          style={{
            borderRadius: "10px",
            overflow: "hidden",
            width: "100%",
            height: "100%",
          }}
        >
          <GoogleMapReact
            bootstrapURLKeys={{
              key: "AIzaSyA61_a1cztE7_ygTRUdET6qN62cnYrOMvY",
            }}
            defaultCenter={defaultProps.center}
            defaultZoom={defaultProps.zoom}
          >
            <AnyReactComponent
              lat={address?.latitude}
              lng={address?.longitude}
              text="My Marker"
            />
          </GoogleMapReact>
        </div>
      </Address> */}
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  min-height: 100%;
  box-sizing: border-box;
  gap: 0.2vw;
  padding: 15px 25px;
  margin-bottom: 50px;
`;

const Links = styled.div`
  width: 100%;
  color: #ccc;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-sizing: border-box;

  div {
    width: 100%;
    display: flex;
    gap: 8px;
    align-items: center;
    letter-spacing: 0.5px;
    font-size: 14px;
    padding: 6px 8px;
    border-radius: 50px;
    background: rgba(255, 255, 255, 0.05);
    box-sizing: border-box;
  }
`;
const Address = styled.div`
  width: 100%;
  height: 300px;
`;
