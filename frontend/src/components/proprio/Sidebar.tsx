import React from "react";
import styled from "styled-components";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  tipoSelecionado: string;
  onTipoChange: (tipo: string) => void;
  tiposDisponiveis: string[];
  dataInicio: string;
  dataFim: string;
  onDataChange: (inicio: string, fim: string) => void;
}

const SidebarContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  width: 16rem;
  background-color: #ffffff;
  padding: 1.5rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  transform: translateX(${props => (props.isOpen ? "0" : "100%")});
  transition: transform 0.3s ease-in-out;
  z-index: 50;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const TitleSidebar = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;

  &:hover {
    color: #111827;
  }
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputDate = styled.input.attrs({ type: "date" })`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  }
`;

const ApplyButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  font-size: 0.875rem;
  font-weight: 500;
  color: #ffffff;
  background-color: #4f46e5;
  cursor: pointer;

  &:hover {
    background-color: #4338ca;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5);
  }
`;

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  tipoSelecionado,
  onTipoChange,
  tiposDisponiveis,
  dataInicio,
  dataFim,
  onDataChange,
}) => {
  const handleDataChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const inicio = (form.elements.namedItem("dataInicio") as HTMLInputElement).value;
    const fim = (form.elements.namedItem("dataFim") as HTMLInputElement).value;
    onDataChange(inicio, fim);
    onClose();
  };

  return (
    <SidebarContainer isOpen={isOpen}>
      <Header>
        <TitleSidebar>Filtros</TitleSidebar>
        <CloseButton onClick={onClose}>
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </CloseButton>
      </Header>

      <Section>
        <Label htmlFor="select-tipo">Tipo de Aula</Label>
        <Select
          id="select-tipo"
          value={tipoSelecionado}
          onChange={e => onTipoChange(e.target.value)}
        >
          <option value="">Todos</option>
          {tiposDisponiveis.map(tipo => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </Select>
      </Section>

      <Form onSubmit={handleDataChange}>
        <div>
          <Label htmlFor="dataInicio">Data de Início</Label>
          <InputDate id="dataInicio" name="dataInicio" defaultValue={dataInicio} />
        </div>
        <div>
          <Label htmlFor="dataFim">Data de Fim</Label>
          <InputDate id="dataFim" name="dataFim" defaultValue={dataFim} />
        </div>
        <ApplyButton type="submit">Aplicar Filtros</ApplyButton>
      </Form>
    </SidebarContainer>
);
}