import React from 'react';
import { createGlobalStyle } from 'styled-components';

export const darkTheme = {
  background: 'rgba(15, 15, 15, 1)',
  header: 'rgba(15, 15, 15, 1)',
  icon: '#f3f3f3',
  font: '#f3f3f3',
  disabled: '#222',
  secondLevel: '#222',
  logo: '#f3f3f3',
  logo2: '#f7f7f7',
  divider: '#222',
  loadingDivider: '#222',
  categoryItem: '#222',
  shadowColor: 'rgba(0,0,0,0.5)',
  lineColor: 'rgba(0,0,0,0.5)',
  frameColor: 'rgba(0,0,0,0.2)',
  mobileFeedCard: 'lineard-gradient(90deg, #050505, #222)',
  lightBackground: 'rgba(255,255,255,0.1)',
};
export const lightTheme = {
  background: '#FCFDFF',
  header: 'rgba(255, 255, 255, 1)',
  icon: '#050505',
  font: '#050505',
  disabled: '#ddd',
  secondLevel: '#f3f3f3',
  logo: '-webkit-linear-gradient(90deg, #222, #111, #111, #222)',
  logo2: '#222',
  divider: '#f3f3f3',
  loadingDivider: '#ccc',
  categoryItem: '#fff',
  shadowColor: 'rgba(0,0,0,0.1)',
  lineColor: '#e5e5e5',
  frameColor: '#fff',
  mobileFeedCard: '#f7e6ff',
  lightBackground: 'rgba(1,1,1,0.05)',
};

export const GlobalStyles = createGlobalStyle`

    body {
        background-color: ${(props) => props.theme.background}
    }

`;
