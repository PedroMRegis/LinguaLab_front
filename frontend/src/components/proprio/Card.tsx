import React from "react";
import styled from "styled-components";



const Card: React.FC<{ title: string; value: string }> = ({ title, value }) => (
  <CardContainer>
    <Title>{title}</Title>
    <Value>{value}</Value>
  </CardContainer>
);

export default Card;

const CardContainer = styled.div`
  flex: 1;
  min-width: 200px;
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
`;

const Title = styled.h3`
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

const Value = styled.p`
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
`;

