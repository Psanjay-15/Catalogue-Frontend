import styled from "styled-components";


export const FieldWrap = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FieldLabel = styled.span`
  font-size: 13.5px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const FieldHint = styled.span`
  font-size: 12.5px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.textFaint};
`;

const controlStyles = `
  width: 100%;
  border-radius: 12px;
  font-size: 15px;
  transition: border-color 200ms, box-shadow 200ms;
`;

export const Input = styled.input`
  ${controlStyles}
  padding: 12px 14px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.colors.primarySoft};
  }
`;

export const Textarea = styled.textarea`
  ${controlStyles}
  padding: 14px 16px;
  min-height: 180px;
  resize: vertical;
  line-height: 1.6;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  font-family: ${({ theme }) => theme.fonts.sans};
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.colors.primarySoft};
  }
  &::placeholder {
    color: ${({ theme }) => theme.colors.textFaint};
  }
`;

export const Select = styled.select`
  ${controlStyles}
  padding: 12px 14px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%236a6680' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 38px;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 4px ${({ theme }) => theme.colors.primarySoft};
  }
`;

/** Convenience: a labelled wrapper around any control. */
export function Field({ label, hint, children, htmlFor }) {
  return (
    <FieldWrap htmlFor={htmlFor}>
      {label && (
        <FieldLabel>
          {label}
          {hint && <FieldHint>{hint}</FieldHint>}
        </FieldLabel>
      )}
      {children}
    </FieldWrap>
  );
}

export default Field;
