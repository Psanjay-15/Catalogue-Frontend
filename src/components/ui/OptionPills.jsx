import styled from "styled-components";

const Group = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Pill = styled.button.attrs({ type: "button" })`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: 10px 16px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1.5px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.primary : theme.colors.border};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primarySoft : theme.colors.surface};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primaryDark : theme.colors.text};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};
  text-align: left;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  .label {
    font-weight: 600;
    font-size: 14px;
  }
  .hint {
    font-size: 11.5px;
    color: ${({ theme, $active }) =>
      $active ? theme.colors.primaryDark : theme.colors.textFaint};
  }
`;

export function OptionPills({ options, value, onChange, name }) {
  return (
    <Group role="radiogroup" aria-label={name}>
      {options.map((opt) => (
        <Pill
          key={opt.value}
          role="radio"
          aria-checked={value === opt.value}
          $active={value === opt.value}
          onClick={() => onChange(opt.value)}
        >
          <span className="label">{opt.label}</span>
          {opt.hint && <span className="hint">{opt.hint}</span>}
        </Pill>
      ))}
    </Group>
  );
}

export default OptionPills;
