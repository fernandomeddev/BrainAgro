import type { ReactNode } from 'react';
import styled from 'styled-components';

export function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <FieldWrap>
      <label>
        {label}
        {required ? <span>*</span> : null}
      </label>
      {children}
    </FieldWrap>
  );
}

export function StatsCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <StatCard>
      <IconHalo>{icon}</IconHalo>
      <span>{label}</span>
      <strong>{value}</strong>
    </StatCard>
  );
}

export function LoadingSkeleton({ rows }: { rows: number }) {
  return (
    <SkeletonStack>
      {Array.from({ length: rows }).map((_, index) => (
        <SkeletonRow key={index} />
      ))}
    </SkeletonStack>
  );
}

export function EmptyState({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <EmptyBox>
      <IconHalo>{icon}</IconHalo>
      <strong>{title}</strong>
      <span>{description}</span>
    </EmptyBox>
  );
}

export const PageContainer = styled.section`
  display: grid;
  gap: 18px;
`;

export const Panel = styled.section`
  border: 1px solid rgba(90, 130, 100, 0.15);
  border-radius: 24px;
  padding: 18px;
  background:
    linear-gradient(180deg, rgba(16, 26, 22, 0.92), rgba(13, 21, 17, 0.9)),
    rgba(16, 26, 22, 0.72);
  box-shadow: 0 24px 90px rgba(0, 0, 0, 0.26);
`;

export const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: center;
  margin-bottom: 16px;

  h2 {
    margin: 0;
    color: #f8fafc;
    font-size: 1.05rem;
  }

  span {
    color: #64748b;
    font-size: 0.85rem;
  }
`;

export const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 14px 12px;
    border-bottom: 1px solid rgba(90, 130, 100, 0.12);
    text-align: left;
    vertical-align: middle;
  }

  th {
    color: #64748b;
    font-size: 0.75rem;
    letter-spacing: 0;
    text-transform: uppercase;
  }

  td {
    color: #cbd5e1;
  }

  th:last-child,
  td:last-child {
    width: 188px;
    text-align: right;
  }
`;

export const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border: 1px solid rgba(90, 130, 100, 0.15);
  border-radius: 14px;
  color: #94a3b8;
  background: rgba(16, 26, 22, 0.72);
  cursor: pointer;
  transition: 150ms ease;

  &:hover {
    color: #f8fafc;
    border-color: rgba(34, 197, 94, 0.35);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    transform: none;
  }
`;

export const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  border: 0;
  border-radius: 14px;
  padding: 0 16px;
  color: #052e16;
  background: linear-gradient(135deg, #22c55e, #86efac);
  box-shadow: 0 18px 46px rgba(34, 197, 94, 0.24);
  cursor: pointer;
  font-weight: 800;
  transition: 150ms ease;

  &:hover {
    transform: translateY(-1px);
    background: linear-gradient(135deg, #16a34a, #86efac);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  border: 1px solid rgba(90, 130, 100, 0.15);
  border-radius: 14px;
  padding: 0 14px;
  color: #cbd5e1;
  background: rgba(16, 26, 22, 0.72);
  cursor: pointer;
  font-weight: 700;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

export const Alert = styled.div`
  margin-bottom: 16px;
  border: 1px solid rgba(248, 113, 113, 0.28);
  border-radius: 16px;
  padding: 12px 14px;
  color: #fecaca;
  background: rgba(127, 29, 29, 0.24);
`;

export const Toast = styled.div`
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 30;
  border: 1px solid rgba(34, 197, 94, 0.25);
  border-radius: 16px;
  padding: 13px 16px;
  color: #dcfce7;
  background: rgba(16, 26, 22, 0.94);
  box-shadow: 0 20px 70px rgba(0, 0, 0, 0.3);
`;

export const Kicker = styled.span`
  color: #22c55e;
  font-size: 0.76rem;
  font-weight: 800;
  text-transform: uppercase;
`;

export const Empty = styled.p`
  margin: 0;
  color: #64748b;
`;

export const IconHalo = styled.div`
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 16px;
  color: #bbf7d0;
  background: rgba(34, 197, 94, 0.15);
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const FieldWrap = styled.div`
  display: grid;
  gap: 7px;

  label {
    color: #cbd5e1;
    font-size: 0.84rem;
    font-weight: 700;
  }

  span {
    color: #22c55e;
  }
`;

export const Input = styled.input`
  width: 100%;
  min-height: 44px;
  border: 1px solid rgba(90, 130, 100, 0.16);
  border-radius: 14px;
  padding: 0 12px;
  color: #f8fafc;
  background: rgba(8, 17, 13, 0.72);
  outline: 0;

  &:focus {
    border-color: rgba(34, 197, 94, 0.48);
    box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.08);
  }

  &::placeholder {
    color: #64748b;
  }
`;

export const Select = styled.select`
  width: 100%;
  min-height: 44px;
  border: 1px solid rgba(90, 130, 100, 0.16);
  border-radius: 14px;
  padding: 0 12px;
  color: #f8fafc;
  background: rgba(8, 17, 13, 0.72);
`;

export const InlineInput = styled(Input)`
  min-width: 130px;
  min-height: 38px;
`;

export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 20;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(2, 6, 5, 0.72);
  backdrop-filter: blur(14px);
`;

export const ModalPanel = styled.div`
  width: min(860px, 100%);
  max-height: calc(100vh - 48px);
  overflow: auto;
  border: 1px solid rgba(90, 130, 100, 0.17);
  border-radius: 24px;
  padding: 20px;
  background: #101a16;
  box-shadow: 0 28px 110px rgba(0, 0, 0, 0.44);
`;

export const ModalCard = styled.form`
  width: min(860px, 100%);
  max-height: calc(100vh - 48px);
  overflow: auto;
  border: 1px solid rgba(90, 130, 100, 0.17);
  border-radius: 24px;
  padding: 20px;
  background: #101a16;
  box-shadow: 0 28px 110px rgba(0, 0, 0, 0.44);
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;

  h2 {
    margin: 4px 0 0;
    color: #f8fafc;
  }
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
`;

export const IdentityCell = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  strong {
    display: block;
    color: #f8fafc;
  }

  small {
    color: #64748b;
  }
`;

export const Avatar = styled.span`
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 14px;
  color: #dcfce7;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(20, 184, 166, 0.45));
  font-weight: 800;
  font-size: 0.78rem;
`;

const StatCard = styled(Panel)`
  display: grid;
  gap: 9px;

  span {
    color: #94a3b8;
  }

  strong {
    font-size: 1.65rem;
  }
`;

const EmptyBox = styled.div`
  display: grid;
  place-items: center;
  gap: 8px;
  min-height: 180px;
  text-align: center;
  color: #64748b;

  strong {
    color: #f8fafc;
  }
`;

const SkeletonStack = styled.div`
  display: grid;
  gap: 10px;
`;

const SkeletonRow = styled.div`
  height: 58px;
  border-radius: 18px;
  background: linear-gradient(90deg, rgba(148, 163, 184, 0.08), rgba(148, 163, 184, 0.16), rgba(148, 163, 184, 0.08));
  animation: pulse 1.2s ease-in-out infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.55;
    }
    50% {
      opacity: 1;
    }
  }
`;
