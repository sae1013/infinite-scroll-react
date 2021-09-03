import React from "react";
import styled from "styled-components";

function Header() {
  return (
    <HeaderStyle>
      <Title>Observer Intersection 무한스크롤링</Title>
    </HeaderStyle>
  );
}

const HeaderStyle = styled.div`
  width: 100%;
  height: 50px;
  background-color: pink;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.p`
  font-size: 20px;
  font-weight: 600;
`;
export default Header;
