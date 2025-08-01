import React from "react";
import styled from "styled-components";

const HeaderContainer = styled.header`
  background-color: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Heading = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
`;

const ToggleButton = styled.button`
  padding: 0.5rem;
  border-radius: 0.375rem;
  color: #9ca3af;
  background: transparent;
  border: none;
  cursor: pointer;

  &:hover {
    color: #6b7280;
    background-color: #f3f4f6;
  }
`;

export const Topbar: React.FC<{ onToggleSidebar: () => void }> = ({ onToggleSidebar }) => (
  <HeaderContainer>
    <Heading>Dashboard LinguaLab</Heading>
    <ToggleButton onClick={onToggleSidebar} aria-label="Abrir filtro">
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </ToggleButton>
  </HeaderContainer>
);