import styled from "styled-components";
import { FiCheck, FiX } from "react-icons/fi";
import { Spinner } from "../ui/Spinner";
import { JOB_STEPS } from "../../constants/options";


const List = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Step = styled.li`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 0;

  .dot {
    flex-shrink: 0;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: 13px;
    font-weight: 700;
    border: 2px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.textFaint};
    transition: all ${({ theme }) => theme.transitions.base};
  }
  .label {
    font-size: 15px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &[data-state="done"] .dot {
    background: ${({ theme }) => theme.colors.success};
    border-color: ${({ theme }) => theme.colors.success};
    color: #fff;
  }
  &[data-state="done"] .label {
    color: ${({ theme }) => theme.colors.text};
  }

  &[data-state="active"] .dot {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primarySoft};
  }
  &[data-state="active"] .label {
    color: ${({ theme }) => theme.colors.primaryDark};
    font-weight: 600;
  }

  &[data-state="error"] .dot {
    background: ${({ theme }) => theme.colors.danger};
    border-color: ${({ theme }) => theme.colors.danger};
    color: #fff;
  }
  &[data-state="error"] .label {
    color: ${({ theme }) => theme.colors.danger};
    font-weight: 600;
  }
`;

export function StatusTimeline({ status }) {
  const failed = status === "failed";
  const currentIndex = JOB_STEPS.findIndex((s) => s.key === status);

  const errorIndex = failed ? Math.max(1, JOB_STEPS.length - 2) : -1;

  return (
    <List>
      {JOB_STEPS.map((step, i) => {
        let state = "pending";
        if (failed) {
          if (i < errorIndex) state = "done";
          else if (i === errorIndex) state = "error";
        } else if (currentIndex === -1) {
          state = "pending";
        } else if (i < currentIndex) {
          state = "done";
        } else if (i === currentIndex) {
          state = step.key === "done" ? "done" : "active";
        }

        return (
          <Step key={step.key} data-state={state}>
            <span className="dot">
              {state === "done" ? (
                <FiCheck size={16} />
              ) : state === "error" ? (
                <FiX size={16} />
              ) : state === "active" ? (
                <Spinner size={16} />
              ) : (
                i + 1
              )}
            </span>
            <span className="label">{step.label}</span>
          </Step>
        );
      })}
    </List>
  );
}

export default StatusTimeline;
